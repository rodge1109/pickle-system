const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres.zhtyktlktykotyzhxyps:Ch3l3l3t110977@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres'
});
pool.query("SELECT appointment_time, service_type FROM pickle_appointment WHERE email = 'roger@rogertonacao.com' AND appointment_date = '2026-09-20'", (err, res) => {
  if (err) console.error(err);
  else console.log(res.rows);
  pool.end();
});
