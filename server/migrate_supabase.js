require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

async function migrate() {
  console.log('Connecting to database at:', process.env.DB_HOST);
  
  try {
    // 1. Update Users Table
    console.log('Migrating users table...');
    await pool.query(
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user',
      ADD COLUMN IF NOT EXISTS gcash_number VARCHAR(255),
      ADD COLUMN IF NOT EXISTS paymaya_number VARCHAR(255),
      ADD COLUMN IF NOT EXISTS bank_account VARCHAR(255),
      ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(255);
    );

    // 2. Update Courts Table
    console.log('Migrating pickle_courts table...');
    await pool.query(
      ALTER TABLE pickle_courts
      ADD COLUMN IF NOT EXISTS address VARCHAR(255),
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS owner_email VARCHAR(255),
      ADD COLUMN IF NOT EXISTS slots JSONB DEFAULT '[]'::jsonb,
      ADD COLUMN IF NOT EXISTS facilities JSONB DEFAULT '[]'::jsonb;
    );

    // 3. Create Messages Table
    console.log('Migrating pickle_messages table...');
    await pool.query(
      CREATE TABLE IF NOT EXISTS pickle_messages (
        id SERIAL PRIMARY KEY,
        sender_email TEXT NOT NULL,
        receiver_email TEXT NOT NULL,
        court_name TEXT,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    );

    // 4. Create Notifications Table
    console.log('Migrating pickle_notifications table...');
    await pool.query(
      CREATE TABLE IF NOT EXISTS pickle_notifications (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255) NOT NULL,
        sender_email VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    );

    console.log('? Supabase Migration Completed Successfully!');
  } catch (err) {
    console.error('? Migration Error:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
