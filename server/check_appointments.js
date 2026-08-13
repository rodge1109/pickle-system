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
    const res = await pool.query("SELECT id, full_name, email, is_open_challenge, challenge_type, status, to_char(preferred_date, 'YYYY-MM-DD') as date FROM pickle_appointment ORDER BY id DESC LIMIT 5");
    console.log(res.rows);
  } finally {
    pool.end();
  }
}
run();
