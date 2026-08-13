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
    const email = 'roger@rogertonacao.com';
    const { rows: assistants } = await pool.query(
      `SELECT * FROM pickle_booking_assistants WHERE is_active = TRUE AND user_email = $1 AND (expires_at IS NULL OR expires_at >= CURRENT_TIMESTAMP)`,
      [email]
    );

    for (const assistant of assistants) {
      const { user_email, preferred_date, preferred_time_start, preferred_time_end, court_preference } = assistant;
      
      const datesToCheck = [];
      if (preferred_date) {
        datesToCheck.push(new Date(preferred_date).toISOString().split('T')[0]);
      } else {
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() + i);
          datesToCheck.push(date.toISOString().split('T')[0]);
        }
      }

      let courtsToCheck = [];
      if (court_preference && court_preference !== 'Any') {
        courtsToCheck.push(court_preference);
      } else {
        const { rows: courts } = await pool.query(`SELECT name FROM pickle_courts`);
        courtsToCheck = courts.map(c => c.name);
      }

      let availableSlotsData = [];
      for (const date of datesToCheck) {
        for (const court of courtsToCheck) {
          const { rows: appointments } = await pool.query(
            `SELECT preferred_time FROM pickle_appointment 
             WHERE service_type = $1 AND preferred_date::date = $2::date 
             AND status NOT IN ('cancelled', 'completed')`,
            [court, date]
          );

          const bookedTimes = appointments.map(a => a.preferred_time);
          const startHour = parseInt(preferred_time_start.split(':')[0]);
          const endHour = parseInt(preferred_time_end.split(':')[0]);

          for (let hour = startHour; hour < endHour; hour++) {
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            if (!bookedTimes.includes(timeStr) && !bookedTimes.includes(`${timeStr}:00`)) {
              availableSlotsData.push({ date: date, court: court, time: timeStr, hour: hour });
            }
          }
        }
      }
      console.log('Available slots:', availableSlotsData.length);
    }
  } catch (error) {
    console.error('ERROR:', error);
  }
  process.exit(0);
}
test();
