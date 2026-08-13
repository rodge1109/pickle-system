require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function run() {
  try {
    await pool.query(`ALTER TABLE pickle_appointment ADD COLUMN IF NOT EXISTS challenge_description TEXT;`);
    console.log("Added challenge_description column");
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
run();
