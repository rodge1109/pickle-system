require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function migrate() {
  try {
    console.log('Adding Open Challenge columns to pickle_appointment...');
    await pool.query(`
      ALTER TABLE pickle_appointment
      ADD COLUMN IF NOT EXISTS is_open_challenge BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS challenge_type VARCHAR(50),
      ADD COLUMN IF NOT EXISTS host_tandem_name VARCHAR(255);
    `);

    console.log('Creating pickle_challenge_requests table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pickle_challenge_requests (
        id SERIAL PRIMARY KEY,
        appointment_id INT REFERENCES pickle_appointment(id) ON DELETE CASCADE,
        challenger_email VARCHAR(255) NOT NULL,
        challenger_name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(appointment_id, challenger_email)
      );
    `);

    console.log('Open Challenge Migration Completed Successfully!');
  } catch (err) {
    console.error('Migration Error:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
