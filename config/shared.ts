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
  }
};

export default sharedConfig;