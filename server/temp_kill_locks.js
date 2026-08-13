const pool = require('./db');
pool.query(`
  SELECT pg_terminate_backend(pid)
  FROM pg_stat_activity
  WHERE state = 'idle in transaction' OR state = 'active';
`)
  .then(res => { console.log('Terminated backends:', res.rowCount); pool.end(); })
  .catch(err => { console.error(err); pool.end(); });
