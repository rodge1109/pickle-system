require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function run() {
  try {
    await pool.query(`ALTER TABLE pickle_open_play_participants ADD COLUMN IF NOT EXISTS guest_count INT DEFAULT 0;`);
    console.log('Successfully added guest_count column');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
