const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'HRMS',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function verifyConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error.message || error);
    process.exit(1);
  }
}

verifyConnection();

module.exports = pool;
