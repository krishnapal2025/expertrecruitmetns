import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from '@shared/schema';

// Create a transporter using a free email service (Ethereal)
// In production, you would replace this with your actual email provider
const createTransporter = async () => {
  // Create a test account on Ethereal for development
  const testAccount = await nodemailer.createTestAccount();

  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  return { transporter, testAccount };
};

// Generate a reset token
export const generateResetToken = (): string => {
  return randomBytes(20).toString('hex');
};

// Generate a JWT token for reset URL
export const generateJwtToken = (userId: number, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET || 'expert-recruitment-default-secret',
    { expiresIn: '1h' }
  );
};

// Send password reset email
export const sendPasswordResetEmail = async (
  user: User,
  resetToken: string,
  recoveryEmail: string
): Promise<{ success: boolean; previewUrl?: string }> => {
  try {
    const { transporter, testAccount } = await createTransporter();
    
    // Create JWT token for added security
    const jwtToken = generateJwtToken(user.id, user.email);
    
    // Setup reset URL
    const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/admin/reset-password?token=${resetToken}&jwtToken=${jwtToken}`;
    
    // Send email
    const info = await transporter.sendMail({
      from: `"Expert Recruitments" <admin@expertrecruitments.com>`,
      to: recoveryEmail,
      subject: 'Password Reset Request',
      text: `Hello Admin,\n\nYou are receiving this email because a password reset has been requested for your account.\n\nPlease click the following link to reset your password:\n\n${resetUrl}\n\nDefault credentials are:\nEmail: ${user.email}\nPassword: admin@ER2025\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nRegards,\nExpert Recruitments Team`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:logo" alt="Expert Recruitments Logo" style="max-height: 60px;" />
          </div>
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hello Admin,</p>
          <p>You are receiving this email because a password reset has been requested for your account.</p>
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Default Admin Credentials:</strong></p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> admin@ER2025</p>
          </div>
          <p>Please click the button below to reset your password:</p>
          <div style="text-align: center; margin: 25px 0;">
            <a href="${resetUrl}" style="background-color: #4A90E2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p style="color: #777; font-size: 0.9em;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #999; font-size: 0.8em; text-align: center;">
            <p>Regards,<br />Expert Recruitments Team</p>
          </div>
        </div>
      `,
    });

    console.log('Password reset email sent successfully');
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return { 
      success: true, 
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false };
  }
};