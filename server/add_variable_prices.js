const pool = require('./db');

async function migrate() {
  try {
    await pool.query(`
      ALTER TABLE public.booking_services 
      ADD COLUMN IF NOT EXISTS variable_prices JSONB DEFAULT '[]'::jsonb;
    `);
    console.log('Successfully added variable_prices to booking_services table.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

migrate();
