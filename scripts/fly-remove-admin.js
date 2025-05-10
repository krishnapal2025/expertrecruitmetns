// This script removes admin accounts from the system
// Run with: fly ssh console -C "node scripts/fly-remove-admin.js"

const { db } = require('../server/db');
const { users, admins, notifications, blogPosts } = require('../shared/schema');
const { eq, inArray } = require('drizzle-orm');

async function removeAllAdminAccounts() {
  console.log("Starting admin removal script...");

  try {
    // 1. First find all blog posts by admin users
    console.log("Checking for blog posts authored by admins...");
    const adminUsers = await db
      .select()
      .from(users)
      .where(
        eq(users.userType, "admin").or(eq(users.userType, "super_admin"))
      );
    
    if (adminUsers.length === 0) {
      console.log("No admin users found");
      return;
    }

    const adminIds = adminUsers.map(user => user.id);
    console.log(`Found ${adminIds.length} admin users with IDs: ${adminIds.join(', ')}`);

    // 2. Update blog posts to remove references to admin users
    console.log("Updating blog posts to remove admin authors...");
    const updateResult = await db
      .update(blogPosts)
      .set({ authorId: null })
      .where(inArray(blogPosts.authorId, adminIds));
    
    console.log(`Updated ${updateResult.rowCount} blog posts`);

    // 3. Delete notifications for admin users
    console.log("Deleting notifications for admin users...");
    const notificationsResult = await db
      .delete(notifications)
      .where(inArray(notifications.userId, adminIds));
    
    console.log(`Deleted ${notificationsResult.rowCount} notifications`);

    // 4. Delete admin profiles
    console.log("Deleting admin profiles...");
    const adminsResult = await db
      .delete(admins)
      .where(inArray(admins.userId, adminIds));
    
    console.log(`Deleted ${adminsResult.rowCount} admin profiles`);

    // 5. Finally delete the admin user accounts
    console.log("Deleting admin user accounts...");
    const usersResult = await db
      .delete(users)
      .where(inArray(users.id, adminIds));
    
    console.log(`Deleted ${usersResult.rowCount} admin user accounts`);
    
    console.log("Admin removal completed successfully");
  } catch (error) {
    console.error("Error removing admin accounts:", error);
  } finally {
    // Ensure we close the DB connection
    await db.end?.();
    process.exit(0);
  }
}

// Execute the function
removeAllAdminAccounts().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});