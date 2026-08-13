const pool = require('./db');
pool.query("SELECT a.*, a.preferred_date as appointment_date, a.preferred_time as appointment_time FROM pickle_appointment a WHERE a.email = 'roger@rogertonacao.com' ORDER BY a.preferred_date DESC, a.preferred_time DESC")
  .then(res => { console.log(res.rows.slice(0, 3)); pool.end(); })
  .catch(err => { console.error(err); pool.end(); });
