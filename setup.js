/**
 * FUNDIFY SETUP SCRIPT
 * Run this ONCE after setting up the database:
 *   node setup.js
 *
 * This creates the admin account with the correct password hash.
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function setup() {
  let connection;
  try {
    console.log('🔧 Connecting to MySQL...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fundify'
    });
    console.log('✅ Connected!');

    // Generate correct hash
    const hash = await bcrypt.hash('admin123', 10);
    console.log('🔑 Password hash generated');

    // Delete existing admin if any
    await connection.execute(`DELETE FROM users WHERE email = 'admin@fundify.com'`);

    // Insert admin
    await connection.execute(
      `INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)`,
      ['Admin', 'admin@fundify.com', hash, 'admin', 1]
    );

    console.log('');
    console.log('========================================');
    console.log('  ✅ Setup complete!');
    console.log('  Admin email:    admin@fundify.com');
    console.log('  Admin password: admin123');
    console.log('');
    console.log('  Now run: npm start');
    console.log('========================================');

  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    console.error('   Make sure:');
    console.error('   1. MySQL is running');
    console.error('   2. You ran database.sql first');
    console.error('   3. Your .env file has the correct DB_PASSWORD');
  } finally {
    if (connection) await connection.end();
  }
}

setup();
