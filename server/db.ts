import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import ws from "ws";
import * as schema from "@shared/schema";
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { type NeonDatabase } from 'drizzle-orm/neon-serverless';

// Export type for use in other files
export type DatabaseInstance = PostgresJsDatabase<typeof schema> | NeonDatabase<typeof schema>;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Determine if we're using a Neon database or a standard PostgreSQL connection
const isNeonDatabase = process.env.DATABASE_URL.includes('neon.tech');

let db: DatabaseInstance;

if (isNeonDatabase) {
  // Setup for Neon database with WebSockets
  console.log("Using Neon database connection with WebSockets");
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else {
  // Setup for standard PostgreSQL connection
  console.log("Using standard PostgreSQL connection");
  const client = postgres(process.env.DATABASE_URL);
  db = drizzlePg({ client, schema });
}

export { db };
