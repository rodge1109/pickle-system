const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

async function migrateTables() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Duplicating appointments schema to pickle_appointment...');
    // Create new table with identical schema (but no data, since user requested empty)
    await client.query(`
      CREATE TABLE IF NOT EXISTS pickle_appointment 
      (LIKE appointments INCLUDING ALL);
    `);
    
    // In PostgreSQL, LIKE INCLUDING ALL copies defaults, constraints, and indexes. 
    // It also copies sequences if the original was a SERIAL, but we need to ensure the sequence doesn't overlap or we just create a new sequence.
    // However, if the original used SERIAL, LIKE INCLUDING DEFAULTS makes the new table share the old sequence!
    // To be completely safe and independent, we should drop the default on ID and create a new sequence, OR we can just create the table from scratch based on the known schema.
    
    console.log('Duplicating corporate_accounts schema to pickle_corporate_accounts...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS pickle_corporate_accounts 
      (LIKE corporate_accounts INCLUDING ALL);
    `);

    // Reset the sequences so they don't share with the old tables.
    // For pickle_appointment:
    await client.query(`ALTER TABLE pickle_appointment ALTER COLUMN id DROP DEFAULT;`);
    await client.query(`CREATE SEQUENCE IF NOT EXISTS pickle_appointment_id_seq;`);
    await client.query(`ALTER SEQUENCE pickle_appointment_id_seq OWNED BY pickle_appointment.id;`);
    await client.query(`ALTER TABLE pickle_appointment ALTER COLUMN id SET DEFAULT nextval('pickle_appointment_id_seq');`);

    // For pickle_corporate_accounts:
    await client.query(`ALTER TABLE pickle_corporate_accounts ALTER COLUMN id DROP DEFAULT;`);
    await client.query(`CREATE SEQUENCE IF NOT EXISTS pickle_corporate_accounts_id_seq;`);
    await client.query(`ALTER SEQUENCE pickle_corporate_accounts_id_seq OWNED BY pickle_corporate_accounts.id;`);
    await client.query(`ALTER TABLE pickle_corporate_accounts ALTER COLUMN id SET DEFAULT nextval('pickle_corporate_accounts_id_seq');`);

    await client.query('COMMIT');
    console.log('Successfully created empty tables: pickle_appointment, pickle_corporate_accounts');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error during migration:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrateTables();
