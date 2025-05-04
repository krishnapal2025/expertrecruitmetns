/**
 * Shared configuration values that are common across all environments
 */

const sharedConfig = {
  app: {
    name: 'Expert Recruitments',
    version: process.env.npm_package_version || '1.0.0',
  },
  
  email: {
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
    }
  },
  
  security: {
    tokenExpiry: '1h',
    passwordResetExpiry: 60 * 60 * 1000, // 1 hour in milliseconds
    jwtSecret: process.env.JWT_SECRET || 'expert-recruitments-secure-jwt-key',
    sessionSecret: process.env.SESSION_SECRET || 'expert-recruitments-session-secret-key'
  },
  
  // Session configuration settings (common across environments)
  session: {
    cookie: {
      // Default cookie settings - these can be overridden by environment
      secure: process.env.NODE_ENV === 'production', // Secure in production
      httpOnly: true,
      maxAge: 86400000, // 24 hours in milliseconds
      sameSite: 'lax' // Default is lax, can be overridden for specific environments
    },
    name: 'er.sid', // Custom session cookie name
    resave: false,
    saveUninitialized: false
  },
  
  features: {
    maxUploadSize: parseInt(process.env.MAX_UPLOAD_SIZE || '5242880', 10), // 5MB
    allowedFileTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png']
  },
  
  storage: {
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    avatarDir: '/avatars',
    resumeDir: '/resumes',
    companyLogosDir: '/company-logos',
    blogImagesDir: '/blog-images'
  },
  
  // System health and reliability settings
  system: {
    retryConfig: {
      maxAttempts: 5,
      initialDelay: 1000, // 1 second
      maxDelay: 10000, // 10 seconds
      factor: 2 // Exponential backoff factor
    },
    timeouts: {
      database: 30000, // 30 seconds
      api: 60000, // 60 seconds
      health: 5000 // 5 seconds
    }
  }
};

export default sharedConfig;