const pool = require('./db');

async function run() {
  try {
    const res = await pool.query("SELECT * FROM pickle_appointment LIMIT 3");
    console.log('appointments:', res.rows);
    
    const res2 = await pool.query("SELECT * FROM pickle_courts LIMIT 3");
    console.log('courts:', res2.rows);

  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

run();
