import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';
import { log } from './vite';

// Secret for JWT token signing
const JWT_SECRET = process.env.SESSION_SECRET || 'your-jwt-secret';

/**
 * Generate a random token for password reset
 */
export const generateResetToken = (): string => {
  return randomBytes(20).toString('hex');
};

/**
 * Generate a JWT token for various authentication purposes
 */
export const generateJwtToken = (userId: number, email: string): string => {
  return jwt.sign(
    {
      userId,
      email,
      timestamp: new Date().getTime()
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Send a password reset email to the admin
 */
export const sendPasswordResetEmail = async (
  user: User,
  resetToken: string,
  origin: string
): Promise<{ success: boolean; previewUrl?: string }> => {
  try {
    console.log(`Sending password reset email to ${user.email} with token ${resetToken}`);
    console.log(`Using origin: ${origin}`);
    
    // Create the reset URL
    const resetUrl = `${origin}/admin/reset-password?token=${resetToken}`;
    
    // In development mode, we'll skip actually sending an email
    // and just return a direct link to the reset page
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - using direct reset link instead of sending email');
      console.log(`Reset URL: ${resetUrl}`);
      
      return {
        success: true,
        previewUrl: resetUrl // Pass the direct reset URL as the preview URL
      };
    }
    
    // For production, use a real email service
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'noreply@expertrecruitments.com',
        pass: process.env.EMAIL_PASSWORD || 'placeholder_password',
      },
    });
    
    // Set up email data
    const mailOptions = {
      from: '"Expert Recruitments" <admin@expertrecruitments.com>',
      to: user.email,
      subject: 'Password Reset - Expert Recruitments',
      text: `
        Hello,
        
        You recently requested to reset your password for your Expert Recruitments admin account. Click the link below to reset it:
        
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you did not request a password reset, please ignore this email or contact support if you have concerns.
        
        Regards,
        Expert Recruitments Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://expertrecruitments.com/logo.png" alt="Expert Recruitments Logo" style="max-width: 200px;">
          </div>
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>You recently requested to reset your password for your Expert Recruitments admin account. Click the button below to reset it:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #ff0077; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          <p style="font-size: 0.9em; color: #666;">This link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
          <p>Regards,<br>Expert Recruitments Team</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.8em; color: #888; text-align: center;">
            <p>Expert Recruitments LLC, Dubai, UAE</p>
            <p>© ${new Date().getFullYear()} Expert Recruitments. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Send the email
    console.log('Attempting to send email...');
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully, message ID: ${info.messageId}`);
      return { success: true };
    } catch (mailError) {
      console.error('Error sending email:', mailError);
      return { success: false };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      success: false
    };
  }
};