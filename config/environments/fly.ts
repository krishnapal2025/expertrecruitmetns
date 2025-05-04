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
      max: 3, // Reduce max connections to avoid overwhelming the database
      idleTimeout: 30, // Increase idle timeout to reduce connection cycling
      connectionTimeout: 30, // Increase connection timeout for slower networks
      acquireConnectionTimeout: 10000 // Wait longer for connection acquisition
    }
  },
  
  // fly.io specific logging
  logging: {
    ...productionConfig.logging,
    format: 'json' // Fly.io works best with JSON formatted logs
  }
};

export default flyConfig;