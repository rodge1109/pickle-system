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
    const user_email = 'roger@rogertonacao.com';
    const summary = 'test summary';
    const availableSlotsData = [{test: 1}];
    
    await pool.query(
      `DELETE FROM pickle_notifications WHERE user_email = $1 AND title = 'Daily Booking Summary'`,
      [user_email]
    );
    await pool.query(
      `INSERT INTO pickle_notifications (user_email, sender_email, title, message, action_data)
       VALUES ($1, $2, $3, $4, $5)`,
      [user_email, 'system@bookingassistant.com', 'Daily Booking Summary', summary, JSON.stringify(availableSlotsData)]
    );
    console.log("INSERT SUCCESS");
  } catch (error) {
    console.error('ERROR:', error);
  }
  process.exit(0);
}
test();
