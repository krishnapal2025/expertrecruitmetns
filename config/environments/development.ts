/**
 * Development environment configuration for Expert Recruitments
 */

const developmentConfig = {
  app: {
    port: 5000,
    baseUrl: 'http://localhost:5000',
    clientUrl: 'http://localhost:5000',
  },
  
  database: {
    ssl: {
      enabled: true,
      rejectUnauthorized: false // Allow self-signed certs in development
    },
    poolConfig: {
      max: 3, // Smaller connection pool for development
      idleTimeout: 20,
      connectionTimeout: 10
    }
  },
  
  security: {
    sessionSecret: 'expert-recruitments-dev-secret',
    jwtSecret: 'expert-recruitments-jwt-dev-secret',
    bcryptSaltRounds: 10
  },
  
  email: {
    // Development defaults to Ethereal testing service if SMTP not provided
    ethereal: {
      enabled: true,
    }
  },
  
  features: {
    seedJobs: true,
    debugMode: true,
    enableEmailVerification: false,
    notificationPollingInterval: 5000, // 5 seconds 
  },
  
  logging: {
    level: 'debug',
    format: 'pretty',
    requestLogging: true
  }
};

export default developmentConfig;