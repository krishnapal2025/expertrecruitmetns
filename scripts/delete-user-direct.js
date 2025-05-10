/**
 * A direct utility script to delete a user account (employer or jobseeker) by ID directly using the database.
 * This bypasses the API authentication requirements.
 * 
 * Usage: node scripts/delete-user-direct.js USER_ID
 * Example: node scripts/delete-user-direct.js 5
 */

const pg = require('pg');
const { pool } = require('../server/db');

// Export the function for use in other scripts
async function deleteUser(userId) {
  console.log(`Starting deletion process for user ID ${userId}`);
  
  // First, determine user type
  const userResult = await pool.query(
    `SELECT id, email, user_type FROM users WHERE id = $1`,
    [userId]
  );
  
  if (userResult.rows.length === 0) {
    console.error(`User ID ${userId} not found.`);
    return { success: false, message: 'User not found' };
  }
  
  const user = userResult.rows[0];
  console.log(`Found user: ID=${user.id}, email=${user.email}, type=${user.user_type}`);
  
  try {
    // Start a transaction
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Handle user type-specific cleanup
      if (user.user_type === 'employer') {
        // Find employer profile
        const employerResult = await client.query(
          `SELECT id FROM employers WHERE user_id = $1`,
          [userId]
        );
        
        if (employerResult.rows.length > 0) {
          const employerId = employerResult.rows[0].id;
          console.log(`Found employer profile ID: ${employerId}`);
          
          // Update jobs to remove employer reference
          const jobsUpdate = await client.query(
            `UPDATE jobs SET employer_id = NULL WHERE employer_id = $1 RETURNING id`,
            [employerId]
          );
          console.log(`Updated ${jobsUpdate.rowCount} jobs to remove employer reference`);
          
          // Delete employer profile
          const employerDelete = await client.query(
            `DELETE FROM employers WHERE id = $1 RETURNING id`,
            [employerId]
          );
          console.log(`Deleted employer profile: ${employerDelete.rowCount} rows affected`);
        } else {
          console.log('No employer profile found for this user.');
        }
      } else if (user.user_type === 'jobseeker') {
        // Find job seeker profile
        const jobSeekerResult = await client.query(
          `SELECT id FROM job_seekers WHERE user_id = $1`,
          [userId]
        );
        
        if (jobSeekerResult.rows.length > 0) {
          const jobSeekerId = jobSeekerResult.rows[0].id;
          console.log(`Found job seeker profile ID: ${jobSeekerId}`);
          
          // Delete job applications
          const applicationsDelete = await client.query(
            `DELETE FROM applications WHERE job_seeker_id = $1 RETURNING id`,
            [jobSeekerId]
          );
          console.log(`Deleted ${applicationsDelete.rowCount} job applications`);
          
          // Delete job seeker profile
          const jobSeekerDelete = await client.query(
            `DELETE FROM job_seekers WHERE id = $1 RETURNING id`,
            [jobSeekerId]
          );
          console.log(`Deleted job seeker profile: ${jobSeekerDelete.rowCount} rows affected`);
        } else {
          console.log('No job seeker profile found for this user.');
        }
      } else {
        console.log(`Skipping profile deletion for user type: ${user.user_type}`);
      }
      
      // Delete notifications for this user
      const notificationsDelete = await client.query(
        `DELETE FROM notifications WHERE user_id = $1 RETURNING id`,
        [userId]
      );
      console.log(`Deleted ${notificationsDelete.rowCount} notifications`);
      
      // Finally delete the user
      const userDelete = await client.query(
        `DELETE FROM users WHERE id = $1 RETURNING id`,
        [userId]
      );
      console.log(`Deleted user: ${userDelete.rowCount} rows affected`);
      
      await client.query('COMMIT');
      console.log(`Successfully deleted user ID ${userId}`);
      return { success: true, message: 'User deleted successfully' };
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error in transaction, rolled back:', err);
      return { success: false, message: `Error deleting user: ${err.message}` };
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error connecting to database:', err);
    return { success: false, message: `Database connection error: ${err.message}` };
  }
}

async function main() {
  const userId = parseInt(process.argv[2], 10);
  
  if (isNaN(userId)) {
    console.error('Error: Please provide a valid user ID number as an argument.');
    console.error('Usage: node scripts/delete-user-direct.js USER_ID');
    process.exit(1);
  }
  
  try {
    const result = await deleteUser(userId);
    console.log(result);
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  } finally {
    // Make sure to end the pool
    pool.end();
  }
}

// Export the deleteUser function
module.exports = { deleteUser };

// Only run the script if it's called directly
if (require.main === module) {
  main();
}