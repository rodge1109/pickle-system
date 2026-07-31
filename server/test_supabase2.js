const { Pool } = require('pg');

async function testConnection(port, user, database) {
  const pool = new Pool({
    host: 'aws-1-ap-northeast-2.pooler.supabase.com',
    port: port,
    database: database,
    user: user,
    password: 'Ch3l3l3t110977',
    ssl: { rejectUnauthorized: false }
  });

  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`SUCCESS on port ${port} user ${user} db ${database}`);
  } catch (err) {
    console.log(`FAILED on port ${port} user ${user} db ${database}:`, err.message);
  } finally {
    await pool.end();
  }
}

async function run() {
  await testConnection(6543, 'postgres', 'postgres');
  await testConnection(5432, 'postgres', 'postgres');
  await testConnection(6543, 'postgres', 'clinic_booking');
  await testConnection(5432, 'postgres', 'clinic_booking');
}
run();
