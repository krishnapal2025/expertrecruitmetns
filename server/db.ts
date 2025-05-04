import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

// Export type for use in other files
export type DatabaseInstance = PostgresJsDatabase<typeof schema>;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Setup for PostgreSQL connection
console.log("Using PostgreSQL connection");

// Parse the connection string to determine environment (local vs fly.io)
const isProduction = process.env.NODE_ENV === 'production';
const isFlyIo = process.env.FLY_APP_NAME !== undefined;

// Ensure the connection string has sslmode=require if it's not already present
let connectionString = process.env.DATABASE_URL;
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

// Configure PostgreSQL client with optimal settings for different environments
const connectionConfig: postgres.Options<{}> = {
  // Max connections in the pool
  max: isProduction ? 10 : 3,
  
  // Idle timeout for connections
  idle_timeout: 20,
  
  // Connection timeout
  connect_timeout: 10,
  
  // Enable prepared statements for better performance
  prepare: true,

  // Force SSL for all environments (development and production)
  ssl: {
    // In production with Fly.io, allow self-signed certificates
    // In development, require valid certificates
    rejectUnauthorized: isProduction ? !isFlyIo : true
  },
};

console.log(`SSL config: ${isProduction ? 'Production' : 'Development'} mode with SSL enabled`);

// Create the database client with the updated connection string
const client = postgres(connectionString, connectionConfig);

// Initialize Drizzle ORM with the client
const db = drizzle({ client, schema });

// Export the configured database instance
export { db };
