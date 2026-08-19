require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres' });
pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'pickle_courts'").then(res => {
  console.table(res.rows);
  pool.end();
}).catch(err => {
  console.error(err);
  pool.end();
});
