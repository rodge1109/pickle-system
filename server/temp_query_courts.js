const pool = require('./db');
pool.query("SELECT * FROM pickle_courts")
  .then(res => { console.log(res.rows.length); pool.end(); })
  .catch(err => { console.error(err); pool.end(); });
