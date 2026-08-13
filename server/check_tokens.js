require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function test() {
  try {
    const { rows } = await pool.query('SELECT * FROM pickle_fcm_tokens');
    console.log(rows);
  } catch (e) { console.error(e); }
  process.exit(0);
}
test();
