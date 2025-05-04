import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import config from './config';

// Export type for use in other files
export type DatabaseInstance = PostgresJsDatabase<typeof schema>;

if (!config.database.url) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Setup for PostgreSQL connection
console.log(`Using PostgreSQL connection in ${process.env.NODE_ENV || 'development'} environment`);

// Modify the connection string to ensure SSL mode is properly set
let connectionString = config.database.url;
if (!connectionString.includes('sslmode=')) {
  // If URL has parameters already, add sslmode as another parameter
  if (connectionString.includes('?')) {
    connectionString += '&sslmode=require';
  } else {
    // Otherwise, add it as the first parameter
    connectionString += '?sslmode=require';
  }
  console.log("Added sslmode=require to database connection string");
}

// Configure PostgreSQL client with optimal settings for reliability
const connectionConfig: postgres.Options<{}> = {
  // Max connections in the pool
  max: config.database.poolConfig.max,
  
  // Idle timeout for connections
  idle_timeout: config.database.poolConfig.idleTimeout,
  
  // Connection timeout
  connect_timeout: config.database.poolConfig.connectionTimeout,
  
  // Enable prepared statements for better performance
  prepare: true,

  // SSL configuration - always require SSL but allow self-signed certs
  ssl: {
    rejectUnauthorized: false
  },
};

console.log(`Database SSL config: ${process.env.NODE_ENV === 'production' ? 'Production' : 'Development'} mode with SSL enabled`);

// Create the database client with the updated connection string
const client = postgres(connectionString, connectionConfig);

// Initialize Drizzle ORM with the client
const db = drizzle({ client, schema });

// Export the configured database instance
export { db };
