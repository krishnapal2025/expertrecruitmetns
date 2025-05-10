/**
 * A direct utility script to delete a super admin account by ID directly using the database.
 * This bypasses the API authentication requirements.
 * 
 * Usage: node scripts/delete-super-admin-direct.js SUPER_ADMIN_ID
 * Example: node scripts/delete-super-admin-direct.js 11
 */

import dotenv from 'dotenv';
import { pool } from '../server/db';

dotenv.config();

async function deleteSuperAdmin(id) {
  console.log(`Attempting to delete super admin with ID: ${id}`);
  
  // Use a client from the pool for transaction
  const client = await pool.connect();
  
  try {
    // Start by verifying the user exists and is a super_admin
    const userResult = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    if (userResult.rows.length === 0) {
      console.log(`No user found with ID ${id}`);
      return { success: false, message: "User not found" };
    }
    
    const user = userResult.rows[0];
    if (user.user_type !== "super_admin") {
      console.log(`User with ID ${id} is not a super_admin (type: ${user.user_type})`);
      return { success: false, message: "User is not a super admin" };
    }
    
    // Find the admin profile for this user
    const adminResult = await client.query(
      'SELECT * FROM admins WHERE user_id = $1',
      [id]
    );
    
    // Begin transaction
    await client.query('BEGIN');
    
    try {
      // Delete references in blog posts
      await client.query(
        `UPDATE blog_posts SET author_id = NULL WHERE author_id = $1`,
        [id]
      );
      
      // Delete notifications
      await client.query(
        `DELETE FROM notifications WHERE user_id = $1`,
        [id]
      );
      
      // Clear job assignments
      await client.query(
        `UPDATE jobs SET assigned_to = NULL WHERE assigned_to = $1`,
        [id]
      );
      
      // Delete admin profile if exists
      if (adminResult.rows.length > 0) {
        const adminId = adminResult.rows[0].id;
        await client.query(
          `DELETE FROM admins WHERE id = $1`,
          [adminId]
        );
      }
      
      // Finally delete the user
      const deleteResult = await client.query(
        `DELETE FROM users WHERE id = $1 AND user_type = 'super_admin' RETURNING id`,
        [id]
      );
      
      if (deleteResult.rowCount === 0) {
        // If no rows were affected, rollback and return failure
        await client.query('ROLLBACK');
        return { success: false, message: "Failed to delete super admin user" };
      }
      
      // Commit the transaction
      await client.query('COMMIT');
      
      console.log(`Successfully deleted super admin user with ID ${id}`);
      return { success: true, message: `Successfully deleted super admin with ID ${id}` };
    } catch (error) {
      // If there's an error, rollback
      await client.query('ROLLBACK');
      console.error(`Error in transaction while deleting super admin ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error deleting super admin ${id}:`, error);
    return { 
      success: false, 
      message: error.message || "Unknown error occurred" 
    };
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

const main = async () => {
  const args = process.argv.slice(2);
  
  if (args.length !== 1 || isNaN(parseInt(args[0]))) {
    console.error('Usage: node scripts/delete-super-admin-direct.js SUPER_ADMIN_ID');
    console.error('Example: node scripts/delete-super-admin-direct.js 11');
    process.exit(1);
  }
  
  const superAdminId = parseInt(args[0]);
  
  try {
    const result = await deleteSuperAdmin(superAdminId);
    console.log(result);
    
    if (result.success) {
      console.log('Super admin account deleted successfully');
      process.exit(0);
    } else {
      console.error('Failed to delete super admin account:', result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
};

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});