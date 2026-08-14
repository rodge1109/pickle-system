require('dotenv').config(); 
const { Pool } = require('pg'); 
const pool = new Pool({ 
  user: process.env.DB_USER, 
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD, 
  port: 5432, 
  ssl: { rejectUnauthorized: false } 
}); 

pool.query("INSERT INTO pickle_appointment (full_name, phone_number, email, status) VALUES ('Test', '000', 'test@test.com', 'cancelled') RETURNING id")
  .then(res => { 
    const id = res.rows[0].id; 
    pool.query('DELETE FROM pickle_appointment WHERE id = $1', [id])
      .then(() => { 
        console.log('Successfully inserted and deleted test data. Supabase is active for storing data.'); 
        process.exit(0); 
      }); 
  })
  .catch(e => { 
    console.log('Error:', e.message); 
    process.exit(1); 
  });
