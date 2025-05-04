/**
 * Production environment configuration for Expert Recruitments
 */

const productionConfig = {
  app: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 8080,
    baseUrl: process.env.BASE_URL || 'https://expertrecruitments.com',
    clientUrl: process.env.CLIENT_URL || 'https://expertrecruitments.com',
  },
  
  database: {
    ssl: {
      enabled: true,
      rejectUnauthorized: !process.env.FLY_APP_NAME // Only disable for fly.io
    },
    poolConfig: {
      max: 10, // Larger connection pool for production
      idleTimeout: 30,
      connectionTimeout: 15
    }
  },
  
  security: {
    // Use environment values or strong defaults
    sessionSecret: process.env.SESSION_SECRET || 'PRODUCTION_SESSION_SECRET_REPLACE_ME',
    jwtSecret: process.env.JWT_SECRET || 'PRODUCTION_JWT_SECRET_REPLACE_ME',
    bcryptSaltRounds: 12 // Higher rounds for production
  },
  
  email: {
    // Production should use real SMTP service
    ethereal: {
      enabled: false,
    }
  },
  
  features: {
    seedJobs: false, // No seeding in production
    debugMode: false,
    enableEmailVerification: true,
    notificationPollingInterval: 15000, // 15 seconds - less frequent in production
  },
  
  logging: {
    level: 'info', // Less verbose logging in production
    format: 'json', // JSON format for better parsing in log systems
    requestLogging: true
  }
};

export default productionConfig;