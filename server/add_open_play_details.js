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
    console.log('Adding instruction and payment details columns to pickle_appointment...');
    await pool.query(`
      ALTER TABLE pickle_appointment
      ADD COLUMN IF NOT EXISTS open_play_instructions TEXT,
      ADD COLUMN IF NOT EXISTS open_play_payment_details TEXT;
    `);
    console.log('? Migration Completed Successfully!');
  } catch (err) {
    console.error('? Migration Error:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
