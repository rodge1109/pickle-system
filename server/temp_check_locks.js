const pool = require('./db');
pool.query(`SELECT pid, statement_timestamp() - query_start as duration, query, state FROM pg_stat_activity WHERE state != 'idle' ORDER BY duration DESC;`)
  .then(res => { console.log(res.rows); pool.end(); })
  .catch(err => { console.error(err); pool.end(); });
