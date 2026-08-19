require('dotenv').config(); 
const {Pool}=require('pg'); 
const pool=new Pool({
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT, 
  database: process.env.DB_NAME, 
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  ssl: {rejectUnauthorized: false}
}); 
pool.query('SELECT id, email, service_type, preferred_date, preferred_time, is_open_challenge, status FROM pickle_appointment WHERE is_open_challenge = true ORDER BY id DESC LIMIT 5').then(res=>{
  console.table(res.rows); 
  pool.end();
});
