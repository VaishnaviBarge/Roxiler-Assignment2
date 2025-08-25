const bcrypt = require("bcryptjs");
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

async function createAdmin() {
  const client = await pool.connect();
  try {
    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const query = `
      INSERT INTO users (name, email, password, address, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO NOTHING;
    `;
    const values = [
      "System Admin",                       
      "vaishnavibarge0@gmail.com",          
      hashedPassword,                       
      "Head Office",                        
      "admin"                               
    ];

    await client.query(query, values);
    console.log(" Admin user created (if not already present)");
  } catch (err) {
    console.error(" Error creating admin:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

createAdmin();
