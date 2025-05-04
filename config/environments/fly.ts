/**
 * Fly.io specific configuration for Expert Recruitments
 * This extends the production configuration with Fly.io-specific settings
 * Optimized for network resilience and connection reliability
 */

import productionConfig from './production';

const flyConfig = {
  ...productionConfig,
  
  // Fly.io specific overrides
  database: {
    ...productionConfig.database,
    ssl: {
      enabled: true,
      rejectUnauthorized: false // Always false for Fly.io PostgreSQL
    },
    poolConfig: {
      ...productionConfig.database.poolConfig,
      // Fly.io optimized PostgreSQL pooling settings
      max: 5, // Modest pool size to balance availability and resource usage
      idleTimeout: 60, // Longer idle timeout (60 seconds) to reduce connection cycling
      connectionTimeout: 60 // Longer connection timeout (60 seconds) for network delays
    }
  },
  
  // fly.io specific logging
  logging: {
    ...productionConfig.logging,
    format: 'json', // Fly.io works best with JSON formatted logs
    level: 'debug' // More verbose logging on Fly.io to catch issues
  }
};

// Add any session-related configs to be included in setupAuth
flyConfig.auth = {
  ...productionConfig.auth,
  // Session settings for auth module
  sessionSecret: process.env.SESSION_SECRET || 'fly-io-session-secret',
  sessionCookie: {
    secure: true, // Always use secure cookies on Fly.io
    sameSite: 'none', // Allow cross-site requests (important for Fly.io deployments)
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
};

export default flyConfig;