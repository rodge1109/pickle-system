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
  const res = await pool.query("SELECT id, email, preferred_date, preferred_time, open_play_max_players, service_type FROM pickle_appointment WHERE is_open_play = true;");
  console.log(res.rows);
  const parts = await pool.query("SELECT * FROM pickle_open_play_participants");
  console.log('Participants:', parts.rows);
  process.exit(0);
}
run();
