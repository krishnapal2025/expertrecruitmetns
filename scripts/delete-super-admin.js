/**
 * A utility script to delete a super admin account by ID.
 * 
 * Usage: node scripts/delete-super-admin.js SUPER_ADMIN_ID
 * Example: node scripts/delete-super-admin.js 11
 */

const { db } = require('../server/db');
const { User, Admin } = require('../shared/schema');
const { eq } = require('drizzle-orm');

async function deleteSuperAdmin(id) {
  console.log(`Attempting to delete super admin with ID: ${id}`);
  
  try {
    // First verify that the user exists and is a super_admin
    const [user] = await db.select().from(User).where(eq(User.id, id));
    
    if (!user) {
      console.log(`No user found with ID ${id}`);
      return { success: false, message: "User not found" };
    }
    
    if (user.userType !== "super_admin") {
      console.log(`User with ID ${id} is not a super_admin (type: ${user.userType})`);
      return { success: false, message: "User is not a super admin" };
    }
    
    // Find the admin profile for this user
    const [adminProfile] = await db.select().from(Admin).where(eq(Admin.userId, id));
    
    // Transaction to ensure all deletions succeed or fail together
    return await db.transaction(async (tx) => {
      try {
        // Delete references in blog posts
        await tx.query(
          `UPDATE blog_posts SET author_id = NULL WHERE author_id = $1`,
          [id]
        );
        
        // Delete notifications
        await tx.query(
          `DELETE FROM notifications WHERE user_id = $1`,
          [id]
        );
        
        // Clear job assignments
        await tx.query(
          `UPDATE jobs SET assigned_to = NULL WHERE assigned_to = $1`,
          [id]
        );
        
        // Delete admin profile if exists
        if (adminProfile) {
          await tx.query(
            `DELETE FROM admins WHERE id = $1`,
            [adminProfile.id]
          );
        }
        
        // Finally delete the user
        const result = await tx.query(
          `DELETE FROM users WHERE id = $1 AND user_type = 'super_admin' RETURNING id`,
          [id]
        );
        
        if (result.rowCount === 0) {
          return { success: false, message: "Failed to delete super admin user" };
        }
        
        console.log(`Successfully deleted super admin user with ID ${id}`);
        return { success: true, message: `Successfully deleted super admin with ID ${id}` };
      } catch (error) {
        console.error(`Error in transaction while deleting super admin ${id}:`, error);
        throw error;
      }
    });
  } catch (error) {
    console.error(`Error deleting super admin ${id}:`, error);
    return { 
      success: false, 
      message: error.message || "Unknown error occurred" 
    };
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 1 || isNaN(parseInt(args[0]))) {
    console.error('Usage: node scripts/delete-super-admin.js SUPER_ADMIN_ID');
    console.error('Example: node scripts/delete-super-admin.js 11');
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
    // Close the database connection
    await db.end();
  }
}

// Run the script
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});