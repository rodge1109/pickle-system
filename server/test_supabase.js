const { Pool } = require('pg');
const pool = new Pool({
  host: 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.qndohdttxovfubzstxpn', // I don't know the exact username, wait, the username for Supabase pooler is usually postgres.[project-ref]. Let's try just postgres first as standard.
  password: 'Ch3l3l3t110977',
  ssl: { rejectUnauthorized: false }
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Connection failed:', err.message);
  } else {
    console.log('Connected to Supabase successfully!', res.rows);
  }
  pool.end();
});
