# Expert Recruitments Configuration System

This directory contains a comprehensive configuration system for the Expert Recruitments application.

## Overview

The configuration system is designed to:

1. Automatically detect the environment (development, production, Fly.io)
2. Load the appropriate configuration for each environment
3. Provide a unified configuration interface throughout the application
4. Support environment-specific settings while maintaining a shared base config

## Structure

- **config/index.ts**: Main entry point that determines which environment to load
- **config/shared.ts**: Common configuration shared across all environments
- **config/environments/**: Environment-specific configuration files
  - **development.ts**: Development environment settings (local development)
  - **production.ts**: Production environment settings (standard deployment)
  - **fly.ts**: Fly.io specific settings (extends production settings)

## Usage

Throughout the application, you can use the configuration by importing the config:

```typescript
import config from './config';

// Access environment information
console.log(`Running in ${config.ENV.NODE_ENV} environment`);

// Use configuration values
const port = config.app.port;
const databaseUrl = config.database.url;

// Check environment flags
if (config.ENV.IS_PRODUCTION) {
  // Production-specific code
}

if (config.ENV.IS_FLY_IO) {
  // Fly.io specific code  
}
```

## Environment Variables

The following environment variables are used:

- `NODE_ENV`: Determines if the app is running in development or production
- `DATABASE_URL`: The PostgreSQL connection string
- `PORT`: The port to run the server on (defaults: 5000 in dev, 8080 in prod)
- `FLY_APP_NAME`: Present when running in Fly.io (used for auto-detection)
- `REPL_ID` or `REPL_SLUG`: Present when running in Replit (used for auto-detection)

## Adding New Configuration

To add new configuration:

1. Add common values to `shared.ts` if they apply across environments
2. Add environment-specific values to the appropriate environment file
3. Import and use the configuration in your code via `import config from './config'`

## SSL Configuration

SSL for database connections is:
- Always enabled in production with `rejectUnauthorized: true`
- Enabled in development with `rejectUnauthorized: false` to allow self-signed certificates
- Special handling for Fly.io with `rejectUnauthorized: false`