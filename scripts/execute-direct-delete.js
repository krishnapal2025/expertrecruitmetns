/**
 * A script to directly delete a super admin account by ID
 * This bypasses the API and directly executes the deletion logic
 */

// Use CommonJS require instead of ESM imports
const { Pool } = require('pg');
const { storage } = require('../server/storage');

const superAdminId = 12; // ID of the super admin to delete

async function main() {
  try {
    console.log(`Attempting to directly delete super admin account with ID ${superAdminId}`);
    
    // Use the storage.deleteSuperAdmin method we just implemented
    const result = await storage.deleteSuperAdmin(superAdminId);
    
    console.log('Result:', result);
    
    if (result.success) {
      console.log('Super admin account successfully deleted!');
      process.exit(0);
    } else {
      console.error('Failed to delete super admin account:', result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error executing deletion:', error);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});