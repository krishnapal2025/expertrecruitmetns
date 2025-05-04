import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
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

// Add more robust connection polling for Fly.io
const createClient = (retryCount = 0) => {
  try {
    // Configure PostgreSQL client with optimal settings from environment config
    const connectionConfig: postgres.Options<{}> = {
      // Connection pool size
      max: config.database.poolConfig.max,
      // No min property in postgres.Options, use appropriate methods instead

      // Idle timeout for connections
      idle_timeout: config.database.poolConfig.idleTimeout,

      // Connection timeout
      connect_timeout: config.database.poolConfig.connectionTimeout,
      
      // Enable prepared statements for better performance
      prepare: true,
      
      // Set keep-alive settings, especially important for Fly.io deployments
      keep_alive: true as any, // Keep alive enabled - using type assertion due to postgres type issues
      
      // PostgreSQL-specific socket settings to prevent disconnects
      connection: {
        application_name: "expert_recruitments_app",
        // Enhanced TCP keepalive values for cloud environments
        keepalives: 1,
        keepalives_idle: 30,
        keepalives_interval: 10,
        keepalives_count: 5
      },

      // Advanced error handling
      onnotice: (notice) => {
        console.log("PostgreSQL Notice:", notice);
      },

      // SSL configuration based on environment
      ssl: config.database.ssl.enabled ? {
        rejectUnauthorized: config.database.ssl.rejectUnauthorized
      } : undefined,
      
      // Debug flag for development
      debug: config.ENV.IS_DEVELOPMENT
    };

    console.log(`Database connection attempt ${retryCount + 1} with SSL ${config.database.ssl.enabled ? 'enabled' : 'disabled'}`);
    return postgres(connectionString, connectionConfig);
  } catch (error) {
    console.error(`Failed to create database client (attempt ${retryCount + 1}):`, error);
    
    // Determine if we should retry
    const maxRetries = config.ENV.IS_FLY_IO ? 5 : 2;
    if (retryCount < maxRetries) {
      console.log(`Retrying database connection (${retryCount + 1}/${maxRetries})...`);
      const delayMs = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff with max 10s
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(createClient(retryCount + 1));
        }, delayMs);
      });
    }
    
    throw error;
  }
};

// Create the database client with exponential backoff retry
let client: postgres.Sql<{}>;
try {
  client = createClient() as postgres.Sql<{}>;
  
  // Add health check and error recovery for the client
  if (config.ENV.IS_FLY_IO) {
    // Set up periodic health check for Fly.io environment
    const healthCheckInterval = setInterval(async () => {
      try {
        const result = await client`SELECT 1 as health_check`;
        const healthCheck = result[0] as { health_check?: number } | undefined;
        
        if (healthCheck?.health_check !== 1) {
          console.warn("Database health check failed - result was not as expected");
        } else {
          // Healthy, do nothing
        }
      } catch (error) {
        console.error("Database health check failed:", error);
        
        // Consider recreating the connection on chronic failures
        // This would need careful handling to avoid race conditions
      }
    }, 30000); // Check every 30 seconds
    
    // Clean up on app exit
    process.on('SIGTERM', () => {
      clearInterval(healthCheckInterval);
    });
  }
} catch (e) {
  console.error("Failed to establish database connection after retries:", e);
  throw new Error("Could not connect to the database. Please check your database configuration and ensure PostgreSQL is running.");
}

// Initialize Drizzle ORM with the client
const db = drizzle(client, { schema });

// Verify database connection
db.execute(sql`SELECT version()`).then((result) => {
  const versionResult = result[0] as { version?: string } | undefined;
  const versionStr = versionResult?.version || "Connected";
  console.log("Successfully connected to PostgreSQL database:", versionStr.substring(0, 50));
}).catch(error => {
  console.error("Failed to verify database connection:", error);
});

// Export the configured database instance
export { db };
