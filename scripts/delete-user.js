/**
 * A utility script to delete a user account (employer or jobseeker) by ID.
 * 
 * Usage: node scripts/delete-user.js USER_ID
 * Example: node scripts/delete-user.js 5
 */

const fetch = require('node-fetch');
const { deleteUser } = require('./delete-user-direct');

async function deleteUserViaAPI(userId) {
  // Admin credentials - use the super_admin account
  const adminEmail = 'info@expertlaborsupply.com';
  const adminPassword = 'ER_Admin@123';
  
  try {
    // First, login to get a session
    console.log('Logging in as admin...');
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: adminEmail, password: adminPassword }),
      credentials: 'include',
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Admin login failed: ${loginResponse.statusText}`);
    }
    
    const admin = await loginResponse.json();
    console.log(`Logged in as admin ID ${admin.id}, type: ${admin.userType}`);
    
    // Now delete the user
    console.log(`Deleting user ID ${userId}...`);
    const deleteResponse = await fetch(`http://localhost:5000/api/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Admin-ID': admin.id,
        'X-Admin-Type': admin.userType,
        'X-Admin-Session': 'true',
      },
      credentials: 'include',
    });
    
    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      throw new Error(`Failed to delete user: ${errorData.message || deleteResponse.statusText}`);
    }
    
    const result = await deleteResponse.json();
    console.log('Delete operation successful:', result);
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    console.log('Attempting direct deletion as fallback...');
    return await deleteUser(userId);
  }
}

async function main() {
  const userId = parseInt(process.argv[2], 10);
  
  if (isNaN(userId)) {
    console.error('Error: Please provide a valid user ID number as an argument.');
    console.error('Usage: node scripts/delete-user.js USER_ID');
    process.exit(1);
  }
  
  try {
    console.log(`Starting deletion process for user ID ${userId}`);
    const result = await deleteUserViaAPI(userId);
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the script
main();