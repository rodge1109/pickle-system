const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres.npxfnydovbbokubqfsvt:picklebook321!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres' });
async function run() {
  const { rows } = await pool.query(
    "SELECT a.id, a.email, a.is_open_challenge, a.status, a.preferred_date, req.challenger_name as accepted_challenger_name FROM pickle_appointment a LEFT JOIN pickle_challenge_requests req ON a.id = req.appointment_id AND req.status = 'accepted' WHERE a.is_open_challenge = true"
  );
  console.log(rows);
  pool.end();
}
run();
