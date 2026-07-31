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
    console.log('Adding Open Play columns to pickle_appointment...');
    await pool.query(`
      ALTER TABLE pickle_appointment
      ADD COLUMN IF NOT EXISTS is_open_play BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS open_play_max_players INT DEFAULT 4,
      ADD COLUMN IF NOT EXISTS open_play_price DECIMAL(10,2) DEFAULT 0.00;
    `);

    console.log('Creating pickle_open_play_participants table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pickle_open_play_participants (
        id SERIAL PRIMARY KEY,
        appointment_id INT REFERENCES pickle_appointment(id) ON DELETE CASCADE,
        user_email VARCHAR(255) NOT NULL,
        payment_proof TEXT,
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(appointment_id, user_email)
      );
    `);

    console.log('? Open Play Migration Completed Successfully!');
  } catch (err) {
    console.error('? Migration Error:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
