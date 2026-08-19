require('dotenv').config();
const {Pool} = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {rejectUnauthorized: false}
});

async function main() {
  try {
    await pool.query("ALTER TABLE pickle_courts ADD COLUMN IF NOT EXISTS open_time VARCHAR(10) DEFAULT '00:00'");
    await pool.query("ALTER TABLE pickle_courts ADD COLUMN IF NOT EXISTS close_time VARCHAR(10) DEFAULT '23:59'");
    console.log("Columns added successfully");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
main();
