import 'dotenv/config';
import crypto from 'crypto';
import { promisify } from 'util';
import pg from 'pg';
const { Pool } = pg;

const scryptAsync = promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function seedAdmin() {
  // Database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });

  try {
    const client = await pool.connect();
    
    // Admin credentials (using environment variables for security)
    // Get admin email from environment variable
    const email = process.env.ADMIN_EMAIL;
    if (!email) {
      console.log('⚠️ ADMIN_EMAIL environment variable not set.');
      console.log('Please configure the ADMIN_EMAIL environment variable.');
      process.exit(1);
    }
    // Get admin password from environment variable
    const password = process.env.ADMIN_PASSWORD;
    if (!password) {
      console.log('⚠️ ADMIN_PASSWORD environment variable not set.');
      console.log('Please configure the ADMIN_PASSWORD environment variable.');
      process.exit(1);
    }
    
    // Option 1: Generate a fresh hash (recommended for maximum security)
    const hashedPassword = await hashPassword(password);
    
    // Option 2: Use a pre-defined hash (not recommended for security)
    // const hashedPassword = '[REDACTED]'; // Hash removed for security
    
    console.log('Checking if admin exists...');
    
    // Check if user exists
    const userResult = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    let userId;
    
    if (userResult.rows.length === 0) {
      // Create user if not exists
      console.log('Creating admin user...');
      const insertUserResult = await client.query(
        'INSERT INTO users (email, password, user_type, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
        [email, hashedPassword, 'admin']
      );
      userId = insertUserResult.rows[0].id;
    } else {
      // Update password for existing user
      console.log('Updating admin password...');
      await client.query(
        'UPDATE users SET password = $1 WHERE email = $2',
        [hashedPassword, email]
      );
      userId = userResult.rows[0].id;
    }
    
    // Check if admin profile exists
    const adminResult = await client.query(
      'SELECT * FROM admins WHERE user_id = $1',
      [userId]
    );
    
    if (adminResult.rows.length === 0) {
      // Create admin profile if not exists
      console.log('Creating admin profile...');
      await client.query(
        'INSERT INTO admins (user_id, first_name, last_name, role, phone_number) VALUES ($1, $2, $3, $4, $5)',
        [
          userId, 
          process.env.ADMIN_FIRST_NAME || 'Admin', 
          process.env.ADMIN_LAST_NAME || 'User', 
          'super_admin', 
          process.env.ADMIN_PHONE || 'Please set phone number'
        ]
      );
    }
    
    console.log('✅ Admin setup complete!');
    console.log('Admin user created or updated successfully.');
    console.log('Required environment variables:');
    console.log('  - ADMIN_EMAIL: Admin email address');
    console.log('  - ADMIN_PASSWORD: Admin password');
    console.log('Optional environment variables:');
    console.log('  - ADMIN_FIRST_NAME: Admin first name');
    console.log('  - ADMIN_LAST_NAME: Admin last name');
    console.log('  - ADMIN_PHONE: Admin phone number');
    
    client.release();
  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    await pool.end();
  }
}

seedAdmin();