/**
* FUNDIFY SETUP SCRIPT
* Run this ONCE after setting up the database:
* node setup.js
*
* This creates the admin account with the correct password hash.
* Set ADMIN_PASSWORD in your .env file before running, or a random
* password will be generated and printed once (save it immediately).
*/

require('dotenv').config();
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const crypto = require('crypto');

async function setup() {
  let connection;
  try {
    console.log('Connecting to MySQL...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fundify'
    });
    console.log('Connected!');

  // Use ADMIN_PASSWORD from .env if set, otherwise generate a random one-time password
  const adminPassword = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64');
    const generatedPassword = !process.env.ADMIN_PASSWORD;

  // Generate correct hash
  const hash = await bcrypt.hash(adminPassword, 10);
    console.log('Password hash generated');

  // Delete existing admin if any
  await connection.execute(`DELETE FROM users WHERE email = 'admin@fundify.com'`);

  // Insert admin
  await connection.execute(
    `INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, ?)`,
    ['Admin', 'admin@fundify.com', hash, 'admin', 1]
    );

  console.log('');
    console.log('========================================');
    console.log(' Setup complete!');
    console.log(' Admin email: admin@fundify.com');
    if (generatedPassword) {
      console.log(' Admin password (generated, save this now): ' + adminPassword);
    } else {
      console.log(' Admin password: set via ADMIN_PASSWORD in .env');
    }
    console.log('');
    console.log(' Now run: npm start');
    console.log('========================================');

} catch (err) {
    console.error('Setup failed:', err.message);
    console.error(' Make sure:');
    console.error(' 1. MySQL is running');
    console.error(' 2. You ran database.sql first');
    console.error(' 3. Your .env file has the correct DB_PASSWORD');
  } finally {
    if (connection) await connection.end();
  }
}

setup();
