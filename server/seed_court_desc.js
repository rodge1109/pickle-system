const pool = require('./db');

async function seedCourtDescriptions() {
  try {
    const defaultDesc = 'Enjoy a fun and active game on our well-maintained pickleball court, perfect for players of all skill levels.';
    
    // Add description column to booking_services if not existing
    await pool.query(`
      ALTER TABLE booking_services 
      ADD COLUMN IF NOT EXISTS description TEXT DEFAULT 'Enjoy a fun and active game on our well-maintained pickleball court, perfect for players of all skill levels.'
    `);
    
    // Update all existing rows in pickle_courts
    const resCourts = await pool.query(
      `UPDATE pickle_courts SET description = $1 RETURNING id, name, description`,
      [defaultDesc]
    );
    console.log(`Updated ${resCourts.rowCount} rows in pickle_courts:`, resCourts.rows);

    // Update all existing court rows in booking_services
    const resServices = await pool.query(
      `UPDATE booking_services SET description = $1 WHERE category ILIKE '%pickle%' OR name ILIKE '%court%' RETURNING id, name, description`,
      [defaultDesc]
    );
    console.log(`Updated ${resServices.rowCount} rows in booking_services:`, resServices.rows);

  } catch (err) {
    console.error('Error seeding court descriptions:', err);
  } finally {
    await pool.end();
  }
}

seedCourtDescriptions();
