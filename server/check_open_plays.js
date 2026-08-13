const pool = require('./db.js');
pool.query(`
  SELECT id, email, preferred_date, preferred_time, is_open_play, status, service_type
  FROM pickle_appointment 
  WHERE is_open_play = true
  ORDER BY created_at DESC
  LIMIT 20
`).then(res => {
  console.log('All open plays (including past):');
  console.table(res.rows);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
