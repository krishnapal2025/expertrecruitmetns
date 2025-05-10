// This script removes all admin accounts (admin and super_admin) from the system
// It handles all the necessary database clean-up with proper ordering to satisfy foreign key constraints

import pkg from 'pg';
const { Pool } = pkg;

// Create a connection to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function removeAllAdminAccounts() {
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    console.log("Starting admin removal process...");
    
    // 1. First, find all admin users
    const { rows: adminUsers } = await client.query(
      `SELECT id FROM users WHERE user_type = 'admin' OR user_type = 'super_admin'`
    );
    
    if (adminUsers.length === 0) {
      console.log("No admin users found");
      await client.query('COMMIT');
      return { success: true, message: "No admin accounts found to remove" };
    }
    
    const adminIds = adminUsers.map(user => user.id);
    console.log(`Found ${adminIds.length} admin users with IDs: ${adminIds.join(', ')}`);
    
    // 2. Update blog posts to remove references to admin authors
    const updateBlogResult = await client.query(
      `UPDATE blog_posts SET author_id = NULL WHERE author_id = ANY($1)`,
      [adminIds]
    );
    console.log(`Updated ${updateBlogResult.rowCount} blog posts`);
    
    // 3. Delete notifications for admin users
    const deleteNotificationsResult = await client.query(
      `DELETE FROM notifications WHERE user_id = ANY($1)`,
      [adminIds]
    );
    console.log(`Deleted ${deleteNotificationsResult.rowCount} notifications`);
    
    // 4. Delete admin profiles
    const deleteAdminProfilesResult = await client.query(
      `DELETE FROM admins WHERE user_id = ANY($1)`,
      [adminIds]
    );
    console.log(`Deleted ${deleteAdminProfilesResult.rowCount} admin profiles`);
    
    // 5. Finally, delete the admin user accounts
    const deleteUsersResult = await client.query(
      `DELETE FROM users WHERE id = ANY($1)`,
      [adminIds]
    );
    console.log(`Deleted ${deleteUsersResult.rowCount} user accounts`);
    
    // Commit the transaction
    await client.query('COMMIT');
    
    console.log("Successfully removed all admin accounts");
    return { 
      success: true, 
      message: `Successfully removed ${adminIds.length} admin account(s)`,
      removedCount: adminIds.length,
      removedIds: adminIds
    };
    
  } catch (error) {
    // Rollback the transaction if there's an error
    await client.query('ROLLBACK');
    console.error("Error removing admin accounts:", error);
    return { 
      success: false, 
      message: "Failed to remove admin accounts", 
      error: error.message 
    };
  } finally {
    // Release the client back to the pool
    client.release();
  }
}

// Wrap execution in an immediately invoked async function
(async () => {
  try {
    const result = await removeAllAdminAccounts();
    console.log("Result:", result);
    await pool.end(); // Close the connection pool when done
  } catch (error) {
    console.error("Fatal error:", error);
    await pool.end(); // Make sure to close the connection pool even on error
    process.exit(1);
  }
})();