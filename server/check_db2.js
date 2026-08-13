const pool = require('./db.js');
pool.query("SELECT id, email FROM pickle_users WHERE email = 'rodge1109@yahoo.com'").then(res => {
  console.log('pickle_users:', res.rows);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
