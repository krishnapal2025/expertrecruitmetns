/**
 * Main configuration module for Expert Recruitments
 * Automatically selects the correct environment configuration
 */

import developmentConfig from './environments/development';
import productionConfig from './environments/production';
import flyConfig from './environments/fly';
import sharedConfig from './shared';

// Environment detection
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV !== 'production',
  IS_FLY_IO: process.env.FLY_APP_NAME !== undefined,
  IS_REPLIT: process.env.REPL_ID !== undefined || process.env.REPL_SLUG !== undefined,
};

// Determine which environment config to use
function getEnvironmentConfig() {
  if (ENV.IS_PRODUCTION) {
    if (ENV.IS_FLY_IO) {
      console.log('Loading fly.io configuration');
      return flyConfig;
    }
    console.log('Loading production configuration');
    return productionConfig;
  }
  
  console.log('Loading development configuration');
  return developmentConfig;
}

// Deep merge objects
const mergeConfig = (target: any, source: any) => {
  const result = { ...target };
  
  for (const key in source) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      result[key] = mergeConfig(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }
  
  return result;
};

// Merge environment-specific config with shared config
const environmentConfig = getEnvironmentConfig();
const mergedConfig = mergeConfig(sharedConfig, environmentConfig);

// Database URL is always from environment
const databaseConfig = {
  database: {
    ...mergedConfig.database,
    url: process.env.DATABASE_URL || '',
  }
};

// Create the final config
const config = {
  ENV,
  ...mergedConfig,
  ...databaseConfig,
};

export default config;