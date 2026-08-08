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
    await pool.query("DELETE FROM pickle_open_play_participants WHERE user_email = 'roger@rogertonacao.com'");
    console.log("Deleted old join records.");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
