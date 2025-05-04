/**
 * Fly.io specific configuration for Expert Recruitments
 * This extends the production configuration with Fly.io-specific settings
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
      max: 5, // Balanced pool size for Fly.io
      min: 1, // Keep at least one connection alive
      idleTimeout: 60, // Increase idle timeout to reduce connection cycling (in seconds)
      connectionTimeout: 60, // Increase connection timeout for slower networks (in seconds)
      acquireConnectionTimeout: 15000, // Wait longer for connection acquisition (15 seconds)
      // Additional settings for better reliability
      retry: {
        enabled: true,
        attempts: 5,
        delay: 1000, // 1 second between retries
        maxDelay: 5000 // Maximum 5 seconds delay
      }
    }
  },
  
  // fly.io specific logging
  logging: {
    ...productionConfig.logging,
    format: 'json', // Fly.io works best with JSON formatted logs
    level: 'debug' // More detailed logging in Fly.io environment
  },

  // Session configuration optimized for Fly.io
  session: {
    cookie: {
      secure: true, // Always use secure cookies on Fly.io (HTTPS)
      httpOnly: true,
      sameSite: 'none', // Handle cross-site requests properly
      maxAge: 86400000 // 24 hours in milliseconds
    },
    // More resilient session configuration
    name: 'er.sid',
    resave: false,
    saveUninitialized: false,
    rolling: true // Reset expiration countdown on every response
  }
};

// Log configuration for debugging
console.log('Loaded Fly.io specific configuration:', {
  ssl: flyConfig.database.ssl.enabled ? 'enabled' : 'disabled',
  poolSize: flyConfig.database.poolConfig.max,
  retries: flyConfig.database.poolConfig.retry?.attempts || 5,
  sessionCookie: 'configured'
});

export default flyConfig;