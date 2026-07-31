require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

pool.query('ALTER TABLE pickle_courts ADD COLUMN IF NOT EXISTS address VARCHAR(255)')
  .then(() => {
    console.log('Address column added successfully to pickle_courts');
    process.exit(0);
  })
  .catch(e => {
    console.error('Error adding address column:', e);
    process.exit(1);
  });
