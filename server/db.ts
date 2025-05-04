import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import config from './config';
import { ENV } from './config';

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

// Configure PostgreSQL client with optimal settings from environment config
const connectionConfig: postgres.Options<{}> = {
  // Max connections in the pool
  max: config.database.poolConfig.max,
  
  // Idle timeout for connections
  idle_timeout: config.database.poolConfig.idleTimeout,
  
  // Connection timeout
  connect_timeout: config.database.poolConfig.connectionTimeout,
  
  // Increase timeout values for more reliable connections on Fly.io
  timeout: config.ENV.IS_FLY_IO ? 30 : undefined,
  
  // Enable prepared statements for better performance
  prepare: true,
  
  // Set keep-alive settings, especially important for Fly.io deployments
  keep_alive: 30, // Keep alive time in seconds
  
  // PostgreSQL-specific socket settings to prevent disconnects
  connection: {
    application_name: "expert_recruitments_app",
    // Slightly increase TCP keepalive values to prevent disconnections
    keepalives: 1,
    keepalives_idle: 30,
    keepalives_interval: 10,
    keepalives_count: 3
  },

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
