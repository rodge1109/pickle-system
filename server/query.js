const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres.zhtyktlktykotyzhxyps:Ch3l3l3t110977@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres' });
pool.query(`SELECT DISTINCT a.*, a.preferred_date as appointment_date, a.preferred_time as appointment_time, c.address as court_address, c.latitude as court_lat, c.longitude as court_lng,
       req.challenger_name as accepted_challenger_name
       FROM pickle_appointment a 
       LEFT JOIN pickle_courts c ON a.service_type = c.name 
       LEFT JOIN pickle_open_play_participants p ON a.id = p.appointment_id
       LEFT JOIN pickle_challenge_requests req ON a.id = req.appointment_id AND req.status = 'accepted'
       WHERE a.email = $1 OR (p.user_email = $1 AND p.status != 'rejected')
       ORDER BY a.preferred_date DESC, a.preferred_time DESC`,
      ['roger@rogertonacao.com'])
  .then(res => { console.log(JSON.stringify(res.rows.slice(0,2), null, 2)); pool.end(); })
  .catch(console.error);
