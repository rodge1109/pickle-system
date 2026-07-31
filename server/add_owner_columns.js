const pool = require('./db');

async function run() {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS gcash_number VARCHAR(255),
      ADD COLUMN IF NOT EXISTS paymaya_number VARCHAR(255),
      ADD COLUMN IF NOT EXISTS bank_account VARCHAR(255),
      ADD COLUMN IF NOT EXISTS bank_account_name VARCHAR(255);
    `);
    console.log("Columns added successfully");
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}
run();
