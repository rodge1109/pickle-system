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
  const { rows } = await pool.query(
    `SELECT a.service_type, c.name, c.latitude, c.longitude, c.address 
     FROM pickle_appointment a 
     LEFT JOIN pickle_courts c ON a.service_type = c.name 
     WHERE a.email = 'roger@rogertonacao.com' LIMIT 5`
  );
  console.log(rows);
  process.exit(0);
}
test();
