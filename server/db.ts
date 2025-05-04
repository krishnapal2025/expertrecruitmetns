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
console.log(`Using PostgreSQL connection in ${config.ENV.NODE_ENV} environment`);

// Modify the connection string to ensure SSL mode is properly set
let connectionString = config.database.url;
if (config.database.ssl.enabled && !connectionString.includes('sslmode=')) {
  // If URL has parameters already, add sslmode as another parameter
  if (connectionString.includes('?')) {
    connectionString += '&sslmode=require';
  } else {
    // Otherwise, add it as the first parameter
    connectionString += '?sslmode=require';
  }
  console.log("Added sslmode=require to database connection string");
}

// Configure PostgreSQL client with optimal settings from environment config
const connectionConfig: postgres.Options<{}> = {
  // Max connections in the pool
  max: config.database.poolConfig.max,
  
  // Idle timeout for connections
  idle_timeout: config.database.poolConfig.idleTimeout,
  
  // Connection timeout
  connect_timeout: config.database.poolConfig.connectionTimeout,
  
  // Enable prepared statements for better performance
  prepare: true,

  // SSL configuration based on environment
  ssl: config.database.ssl.enabled ? {
    rejectUnauthorized: config.database.ssl.rejectUnauthorized
  } : undefined,
};

console.log(`Database SSL config: ${config.ENV.IS_PRODUCTION ? 'Production' : 'Development'} mode with SSL ${config.database.ssl.enabled ? 'enabled' : 'disabled'}`);

// Create the database client with the updated connection string
const client = postgres(connectionString, connectionConfig);

// Initialize Drizzle ORM with the client
const db = drizzle({ client, schema });

// Export the configured database instance
export { db };
