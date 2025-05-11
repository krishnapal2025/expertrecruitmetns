import pg from 'pg';
import fs from 'fs';

const { Pool } = pg;

// Create a connection to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    console.log('Adding resumePath column to applications table...');
    
    // Check if the column already exists
    const checkResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'applications' AND column_name = 'resume_path'
    `);
    
    if (checkResult.rows.length === 0) {
      // Add the column if it doesn't exist
      await pool.query(`
        ALTER TABLE applications 
        ADD COLUMN resume_path TEXT
      `);
      console.log('Successfully added resume_path column to applications table');
    } else {
      console.log('resume_path column already exists in applications table');
    }

    console.log('Database update completed successfully');
  } catch (error) {
    console.error('Error updating database:', error);
  } finally {
    // Close the database connection
    await pool.end();
  }
}

main();