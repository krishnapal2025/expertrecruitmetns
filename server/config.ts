/**
 * Centralized configuration management for Expert Recruitments
 * This file provides environment-specific configuration settings
 */

// Environment detection
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV !== 'production',
  IS_FLY_IO: process.env.FLY_APP_NAME !== undefined,
  IS_REPLIT: process.env.REPL_ID !== undefined || process.env.REPL_SLUG !== undefined,
};

// Main configuration object
const config = {
  // Environment variables (exposed for easy access)
  ENV,
  
  // Application settings
  app: {
    name: 'Expert Recruitments',
    version: process.env.npm_package_version || '1.0.0',
    port: parseInt(process.env.PORT || '5000', 10),
    baseUrl: process.env.BASE_URL || 'http://localhost:5000',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5000',
  },
  
  // Database configuration
  database: {
    url: process.env.DATABASE_URL || '',
    ssl: {
      enabled: true, // Always enable SSL for security
      rejectUnauthorized: false // Allow self-signed certs for development and Fly.io
    },
    poolConfig: {
      max: ENV.IS_PRODUCTION ? 10 : 3,
      idleTimeout: 20,
      connectionTimeout: 10
    }
  },
  
  // Security settings
  security: {
    sessionSecret: process.env.SESSION_SECRET || 'expert-recruitments-dev-secret',
    jwtSecret: process.env.JWT_SECRET || 'expert-recruitments-jwt-dev-secret',
    tokenExpiry: '1h',
    passwordResetExpiry: 60 * 60 * 1000, // 1 hour in milliseconds
    bcryptSaltRounds: 10
  },
  
  // Email configuration
  email: {
    enabled: !!process.env.SMTP_HOST,
    from: process.env.EMAIL_FROM || 'no-reply@expertrecruitments.com',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@expertrecruitments.com',
    smtp: {
      host: process.env.SMTP_HOST || '',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASSWORD || ''
      }
    },
    // Used for development testing with Ethereal
    ethereal: {
      enabled: ENV.IS_DEVELOPMENT && !process.env.SMTP_HOST,
      user: process.env.ETHEREAL_USER || '',
      pass: process.env.ETHEREAL_PASS || ''
    }
  },
  
  // Feature flags and settings
  features: {
    seedJobs: process.env.SEED_JOBS !== 'false',
    debugMode: process.env.DEBUG_MODE === 'true',
    enableEmailVerification: ENV.IS_PRODUCTION,
    notificationPollingInterval: parseInt(process.env.NOTIFICATION_POLLING_INTERVAL || '5000', 10), // milliseconds
    maxUploadSize: parseInt(process.env.MAX_UPLOAD_SIZE || '5242880', 10), // 5MB
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
  },
  
  // Logging configuration
  logging: {
    level: ENV.IS_PRODUCTION ? 'info' : 'debug',
    format: ENV.IS_PRODUCTION ? 'json' : 'pretty',
    requestLogging: true
  },
  
  // Storage settings (for file uploads)
  storage: {
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    avatarDir: '/avatars',
    resumeDir: '/resumes',
    companyLogosDir: '/company-logos',
    blogImagesDir: '/blog-images'
  }
};

export default config;