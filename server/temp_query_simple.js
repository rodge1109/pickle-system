const pool = require('./db');
pool.query("SELECT * FROM pickle_appointment WHERE email = 'roger@rogertonacao.com'")
  .then(res => { console.log(res.rows.length); pool.end(); })
  .catch(err => { console.error(err); pool.end(); });
