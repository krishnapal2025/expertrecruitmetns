/**
 * A server utility script to delete super admin accounts
 * This function is called directly by the API endpoint
 */

import { pool } from '../db.js';

/**
 * Delete a super admin user from the database
 * @param {number} id - The ID of the super admin to delete
 * @returns {Promise<{success: boolean, message: string}>} - Result of the operation
 */
export async function deleteSuperAdmin(id) {
  // Get a client from the pool
  const client = await pool.connect();
  
  try {
    // Begin a transaction
    await client.query('BEGIN');
    
    // First check if user exists and is a super_admin
    const userResult = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    
    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return { success: false, message: `No user found with ID ${id}` };
    }
    
    const user = userResult.rows[0];
    if (user.user_type !== 'super_admin') {
      await client.query('ROLLBACK');
      return { 
        success: false, 
        message: `User with ID ${id} is not a super_admin (type: ${user.user_type})`
      };
    }
    
    // Update blog posts to remove author reference
    await client.query(
      'UPDATE blog_posts SET author_id = NULL WHERE author_id = $1',
      [id]
    );
    
    // Delete notifications
    await client.query(
      'DELETE FROM notifications WHERE user_id = $1',
      [id]
    );
    
    // Delete admin profile
    await client.query(
      'DELETE FROM admins WHERE user_id = $1',
      [id]
    );
    
    // Delete the user
    const deleteResult = await client.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (deleteResult.rowCount === 0) {
      // If deletion failed, rollback
      await client.query('ROLLBACK');
      return { success: false, message: `Failed to delete super admin with ID ${id}` };
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    
    return { 
      success: true, 
      message: `Successfully deleted super admin with ID ${id}` 
    };
  } catch (error) {
    // If any error occurs, rollback
    await client.query('ROLLBACK');
    console.error('Error deleting super admin:', error);
    return { 
      success: false, 
      message: error.message || 'An unknown error occurred' 
    };
  } finally {
    // Release the client back to the pool
    client.release();
  }
}