const pool = require('./db.js');
pool.query("SELECT id, email FROM users").then(res => {
  console.log('All emails:', res.rows.map(r => r.email));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
