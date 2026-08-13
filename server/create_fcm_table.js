require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function createTable() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pickle_fcm_tokens (
        user_email VARCHAR(255) NOT NULL,
        fcm_token VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_email, fcm_token)
      );
    `);
    console.log("Table pickle_fcm_tokens created.");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    process.exit(0);
  }
}

createTable();
