const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'clinic_booking',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: '-c timezone=Asia/Manila',
  max: 5,
  idleTimeoutMillis: 10000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', (client) => {
  client.query("SET TIME ZONE 'Asia/Manila'").catch(() => {});
  console.log('Connected to PostgreSQL database (Asia/Manila)');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

module.exports = pool;
