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
      // Fly.io recommends specific PostgreSQL pooling settings
      max: 5,
      idleTimeout: 10
    }
  },
  
  // fly.io specific logging
  logging: {
    ...productionConfig.logging,
    format: 'json' // Fly.io works best with JSON formatted logs
  }
};

export default flyConfig;