const pool = require('./db');

async function run() {
  try {
    const res = await pool.query("SELECT column_name, is_nullable FROM information_schema.columns WHERE table_name = 'pickle_appointment'");
    console.log("pickle_appointment columns:");
    console.log(res.rows);
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
run();
