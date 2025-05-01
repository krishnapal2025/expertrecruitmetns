import pkg from 'pg';
const { Pool } = pkg;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL environment variable is required');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Creating blog_posts table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        subtitle TEXT,
        content TEXT NOT NULL,
        banner_image TEXT,
        author_id INTEGER REFERENCES users(id),
        publish_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        published BOOLEAN DEFAULT FALSE,
        category TEXT,
        tags TEXT[],
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT,
        read_time TEXT
      )
    `);

    console.log('Blog posts table created successfully!');
  } catch (error) {
    console.error('Error creating table:', error);
  } finally {
    await pool.end();
  }
}

main().catch(console.error);