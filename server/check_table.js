require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});
async function check() {
  const result = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'pickle_courts'");
  console.log(result.rows);
  process.exit(0);
}
check();
