const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres:Ch3l3l3t110977@localhost:5432/clinic_booking'
});

async function run() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pickle_booking_assistants (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        preferred_date DATE,
        preferred_time_start TIME,
        preferred_time_end TIME,
        court_preference VARCHAR(255),
        payment_reference VARCHAR(255),
        payment_status VARCHAR(50) DEFAULT 'paid',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table pickle_booking_assistants created successfully.');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    await pool.end();
  }
}

run();
