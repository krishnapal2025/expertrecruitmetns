const { scrypt, randomBytes, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
const { db } = require('../server/db');
const { users } = require('../shared/schema');
const { eq } = require('drizzle-orm');

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function updateAdminPassword() {
  try {
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
    
    const hashedPassword = await hashPassword(password);
    
    // Update the user's password in the database
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));
    
    console.log(`✅ Password updated successfully for admin: ${email}`);
    console.log('Required environment variables:');
    console.log('  - ADMIN_EMAIL: Admin email address');
    console.log('  - ADMIN_PASSWORD: New admin password');
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    process.exit(0);
  }
}

updateAdminPassword();