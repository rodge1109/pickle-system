const pool = require('./db.js');
pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'pickle_courts'").then(res => {
  console.log('Columns:', res.rows.map(r => r.column_name));
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
