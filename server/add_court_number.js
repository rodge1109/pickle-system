const pool = require('./db.js');
pool.query("ALTER TABLE pickle_courts ADD COLUMN court_number VARCHAR(50)").then(res => {
  console.log('Added court_number column');
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
