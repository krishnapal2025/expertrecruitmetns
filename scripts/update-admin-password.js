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
    const email = 'admin@expertrecruitments.com';
    const password = 'admin@ER2025';
    
    const hashedPassword = await hashPassword(password);
    
    // Update the user's password in the database
    await db.update(users)
      .set({ password: hashedPassword })
      .where(eq(users.email, email));
    
    console.log(`Password updated for user: ${email}`);
  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    process.exit(0);
  }
}

updateAdminPassword();