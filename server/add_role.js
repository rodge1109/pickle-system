const pool = require('./db');

async function addRole() {
  try {
    await pool.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user'");
    console.log("Successfully added 'role' column to users table.");
    process.exit(0);
  } catch (err) {
    console.error("Error adding column:", err);
    process.exit(1);
  }
}

addRole();
