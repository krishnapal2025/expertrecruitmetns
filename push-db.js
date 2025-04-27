import { Pool } from 'pg';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Creating vacancies table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vacancies (
        id SERIAL PRIMARY KEY,
        company_name TEXT NOT NULL,
        contact_name TEXT NOT NULL,
        contact_email TEXT NOT NULL,
        contact_phone TEXT NOT NULL,
        job_title TEXT NOT NULL,
        job_description TEXT NOT NULL,
        location TEXT NOT NULL,
        industry TEXT NOT NULL,
        employment_type TEXT NOT NULL,
        salary_range TEXT,
        required_skills TEXT NOT NULL,
        experience_level TEXT NOT NULL,
        application_deadline TIMESTAMP NOT NULL,
        additional_information TEXT,
        status TEXT DEFAULT 'pending',
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Table created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);