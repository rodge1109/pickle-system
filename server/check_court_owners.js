const pool = require('./db');

async function checkCourtOwners() {
  try {
    const { rows } = await pool.query(
      `SELECT id, name, owner_email FROM pickle_courts ORDER BY id`
    );
    console.log('Courts in pickle_courts:');
    rows.forEach(r => console.log(`  [${r.id}] ${r.name} -> owner: ${r.owner_email || '(NULL)'}`));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkCourtOwners();
