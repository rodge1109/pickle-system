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
    // Add columns to pickle_appointment
    await pool.query("ALTER TABLE pickle_appointment ADD COLUMN IF NOT EXISTS is_assume BOOLEAN DEFAULT false");
    await pool.query("ALTER TABLE pickle_appointment ADD COLUMN IF NOT EXISTS assume_price VARCHAR(255)");
    await pool.query("ALTER TABLE pickle_appointment ADD COLUMN IF NOT EXISTS assume_notes TEXT");
    
    // Create requests table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pickle_pasalo_requests (
        id SERIAL PRIMARY KEY,
        appointment_id INTEGER REFERENCES pickle_appointment(id) ON DELETE CASCADE,
        requester_email VARCHAR(255),
        requester_name VARCHAR(255),
        requester_phone VARCHAR(255),
        proof_of_payment TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log("Database updated successfully");
  } catch(e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
main();
