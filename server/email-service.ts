import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import { User, Vacancy } from '@shared/schema';
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
    
    // In development mode, we'll use Ethereal mail for testing (no real emails sent)
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - using Ethereal test email account');
      console.log(`Reset URL: ${resetUrl}`);
      
      try {
        // Create a test account on Ethereal for development testing
        const testAccount = await nodemailer.createTestAccount();
        console.log('Created Ethereal test account');
        
        // Create a transporter using the test account
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        // Set up email options
        const mailOptions = {
          from: process.env.EMAIL_FROM || '"Expert Recruitments" <noreply@example.com>',
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
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.8em; color: #888; text-align: center;">
                <p>Expert Recruitments LLC, Dubai, UAE</p>
                <p>© ${new Date().getFullYear()} Expert Recruitments. All rights reserved.</p>
              </div>
            </div>
          `
        };
        
        // Send the test email
        const info = await transporter.sendMail(mailOptions);
        console.log('Test email sent:', info.messageId);
        
        // Generate and return the preview URL (Ethereal provides this for viewing the test email)
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('Preview URL:', previewUrl);
        
        return {
          success: true,
          previewUrl: previewUrl || resetUrl // Return the preview URL or reset URL as fallback
        };
      } catch (error) {
        console.error('Error creating test email:', error);
        // Even if creating the test account fails, we'll still return the direct reset URL
        return {
          success: true,
          previewUrl: resetUrl // Pass the direct reset URL as the preview URL
        };
      }
    }
    
    // For production, use configured email service
    let transporter;
    
    // Check if email credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      console.log('Email credentials not provided, using placeholder values');
      // In production without credentials, we'll log but won't actually try to send
      return {
        success: true,
        previewUrl: resetUrl // Use the reset URL as the preview URL
      };
    }
    
    // Set up email data
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Expert Recruitments" <noreply@example.com>',
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

/**
 * Send a reply to an inquiry
 */
export const sendInquiryReply = async (
  recipientEmail: string,
  recipientName: string,
  subject: string,
  message: string,
  senderName: string
): Promise<{ success: boolean; previewUrl?: string }> => {
  try {
    console.log(`Sending inquiry reply to ${recipientEmail}`);
    
    // In development mode, we'll use Ethereal mail for testing (no real emails sent)
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - using Ethereal test email account');
      
      try {
        // Create a test account on Ethereal for development testing
        const testAccount = await nodemailer.createTestAccount();
        console.log('Created Ethereal test account for inquiry reply');
        
        // Create a transporter using the test account
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        // Set up email options
        const mailOptions = {
          from: process.env.EMAIL_FROM || '"Expert Recruitments" <noreply@example.com>',
          to: `"${recipientName}" <${recipientEmail}>`,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://expertrecruitments.com/logo.png" alt="Expert Recruitments Logo" style="max-width: 200px;">
              </div>
              <h2 style="color: #333; text-align: center;">Inquiry Response</h2>
              <p>Dear ${recipientName},</p>
              <div style="margin: 20px 0; line-height: 1.6; white-space: pre-wrap; background-color: #f9f9f9; padding: 15px; border-radius: 5px;">${message}</div>
              <p>Best regards,<br>${senderName}<br>Expert Recruitments Team</p>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.8em; color: #888; text-align: center;">
                <p>If you have any further questions, please feel free to contact us by replying to this email or using our contact form.</p>
                <p>&copy; ${new Date().getFullYear()} Expert Recruitments. All rights reserved.</p>
              </div>
            </div>
          `
        };
        
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Inquiry reply email sent successfully (development mode)');
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        
        return {
          success: true,
          previewUrl: nodemailer.getTestMessageUrl(info) || ''
        };
      } catch (mailError) {
        console.error('Error sending inquiry reply email:', mailError);
        return { success: false };
      }
    } else {
      // TODO: Implement production email sending
      console.log('Production email sending not yet implemented');
      return { success: false };
    }
  } catch (error) {
    console.error('Error sending inquiry reply email:', error);
    return { success: false };
  }
};

/**
 * Send a vacancy assignment email to a recruiter
 */
export const sendVacancyAssignmentEmail = async (
  recruiterEmail: string,
  recruiterName: string,
  vacancy: Vacancy,
  origin: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    console.log(`Sending vacancy assignment email to ${recruiterEmail}`);
    
    // Create a view vacancy URL
    const vacancyUrl = `${origin}/recruiter/vacancy/${vacancy.id}`;
    
    // In development mode, we'll use Ethereal mail for testing (no real emails sent)
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode - using Ethereal test email account');
      console.log(`Recruiter: ${recruiterName} (${recruiterEmail})`);
      console.log(`Vacancy: ${vacancy.jobTitle} at ${vacancy.companyName}`);
      console.log(`Vacancy URL: ${vacancyUrl}`);
      
      try {
        // Create a test account on Ethereal for development testing
        const testAccount = await nodemailer.createTestAccount();
        console.log('Created Ethereal test account for vacancy assignment');
        
        // Create a transporter using the test account
        const transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        // Set up and send the test email
        const mailOptions = {
          from: process.env.EMAIL_FROM || '"Expert Recruitments" <noreply@example.com>',
          to: recruiterEmail,
          subject: `New Vacancy Assignment: ${vacancy.jobTitle} at ${vacancy.companyName}`,
          text: `
            Hello ${recruiterName},
            
            You have been assigned a new vacancy to handle:
            
            Company: ${vacancy.companyName}
            Position: ${vacancy.jobTitle}
            Location: ${vacancy.location}
            
            Job Description:
            ${vacancy.jobDescription}
            
            Required Skills:
            ${vacancy.requiredSkills}
            
            Experience Level:
            ${vacancy.experienceLevel}
            
            Salary Range:
            ${vacancy.salaryRange || 'Not specified'}
            
            Contact Person:
            ${vacancy.contactName}
            
            Please review the details and begin the recruitment process as soon as possible.
            
            Regards,
            Expert Recruitments Team
          `,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
              <div style="text-align: center; margin-bottom: 20px;">
                <img src="https://expertrecruitments.com/logo.png" alt="Expert Recruitments Logo" style="max-width: 200px;">
              </div>
              <h2 style="color: #333; text-align: center;">New Vacancy Assignment</h2>
              <p>Hello ${recruiterName},</p>
              <p>You have been assigned a new vacancy to handle:</p>
              
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #ff0077; margin-top: 0;">${vacancy.jobTitle}</h3>
                <p><strong>Company:</strong> ${vacancy.companyName}</p>
                <p><strong>Location:</strong> ${vacancy.location}</p>
                <p><strong>Industry:</strong> ${vacancy.industry}</p>
                <p><strong>Employment Type:</strong> ${vacancy.employmentType}</p>
                <p><strong>Salary Range:</strong> ${vacancy.salaryRange || 'Not specified'}</p>
              </div>
              
              <h4 style="color: #333;">Job Description:</h4>
              <p style="line-height: 1.6;">${vacancy.jobDescription}</p>
              
              <h4 style="color: #333;">Required Skills:</h4>
              <p style="line-height: 1.6;">${vacancy.requiredSkills}</p>
              
              <h4 style="color: #333;">Experience Level:</h4>
              <p style="line-height: 1.6;">${vacancy.experienceLevel}</p>
              
              <h4 style="color: #333;">Contact Information:</h4>
              <p><strong>Name:</strong> ${vacancy.contactName}</p>
              <p><strong>Email:</strong> ${vacancy.contactEmail}</p>
              <p><strong>Phone:</strong> ${vacancy.contactPhone}</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${vacancyUrl}" style="background-color: #ff0077; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">View Vacancy Details</a>
              </div>
              
              <p>Please review the details and begin the recruitment process as soon as possible.</p>
              <p>Regards,<br>Expert Recruitments Team</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.8em; color: #888; text-align: center;">
                <p>Expert Recruitments LLC, Dubai, UAE</p>
                <p>© ${new Date().getFullYear()} Expert Recruitments. All rights reserved.</p>
              </div>
            </div>
          `
        };
        
        // Send the test email
        const info = await transporter.sendMail(mailOptions);
        console.log('Test email sent:', info.messageId);
        
        // Generate and return the preview URL (Ethereal provides this for viewing the test email)
        const previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('Preview URL:', previewUrl);
        
        return {
          success: true,
          message: `Development mode - Email preview available at: ${previewUrl}`
        };
      } catch (error: any) {
        console.error('Error creating test email:', error);
        return {
          success: false,
          message: `Failed to create test email: ${error?.message || 'Unknown error'}`
        };
      }
    }
    
    // For production, use configured email service
    let transporter;
    
    // Check if email credentials are provided
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      console.log('Email credentials not provided, using placeholder values');
      // In production without credentials, we'll log but won't actually try to send
      return {
        success: true,
        message: "Email service not configured, but vacancy assignment was recorded successfully"
      };
    }
    
    // Set up email data
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"Expert Recruitments" <noreply@example.com>',
      to: recruiterEmail,
      subject: `New Vacancy Assignment: ${vacancy.jobTitle} at ${vacancy.companyName}`,
      text: `
        Hello ${recruiterName},
        
        You have been assigned a new vacancy to handle:
        
        Company: ${vacancy.companyName}
        Position: ${vacancy.jobTitle}
        Location: ${vacancy.location}
        
        Job Description:
        ${vacancy.jobDescription}
        
        Required Skills:
        ${vacancy.requiredSkills}
        
        Experience Level:
        ${vacancy.experienceLevel}
        
        Salary Range:
        ${vacancy.salaryRange || 'Not specified'}
        
        Contact Person:
        ${vacancy.contactName}
        
        Please review the details and begin the recruitment process as soon as possible.
        
        Regards,
        Expert Recruitments Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://expertrecruitments.com/logo.png" alt="Expert Recruitments Logo" style="max-width: 200px;">
          </div>
          <h2 style="color: #333; text-align: center;">New Vacancy Assignment</h2>
          <p>Hello ${recruiterName},</p>
          <p>You have been assigned a new vacancy to handle:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #ff0077; margin-top: 0;">${vacancy.jobTitle}</h3>
            <p><strong>Company:</strong> ${vacancy.companyName}</p>
            <p><strong>Location:</strong> ${vacancy.location}</p>
            <p><strong>Industry:</strong> ${vacancy.industry}</p>
            <p><strong>Employment Type:</strong> ${vacancy.employmentType}</p>
            <p><strong>Salary Range:</strong> ${vacancy.salaryRange || 'Not specified'}</p>
          </div>
          
          <h4 style="color: #333;">Job Description:</h4>
          <p style="line-height: 1.6;">${vacancy.jobDescription}</p>
          
          <h4 style="color: #333;">Required Skills:</h4>
          <p style="line-height: 1.6;">${vacancy.requiredSkills}</p>
          
          <h4 style="color: #333;">Experience Level:</h4>
          <p style="line-height: 1.6;">${vacancy.experienceLevel}</p>
          
          <h4 style="color: #333;">Contact Information:</h4>
          <p><strong>Name:</strong> ${vacancy.contactName}</p>
          <p><strong>Email:</strong> ${vacancy.contactEmail}</p>
          <p><strong>Phone:</strong> ${vacancy.contactPhone}</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${vacancyUrl}" style="background-color: #ff0077; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">View Vacancy Details</a>
          </div>
          
          <p>Please review the details and begin the recruitment process as soon as possible.</p>
          <p>Regards,<br>Expert Recruitments Team</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.8em; color: #888; text-align: center;">
            <p>Expert Recruitments LLC, Dubai, UAE</p>
            <p>© ${new Date().getFullYear()} Expert Recruitments. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    // Send the email
    console.log('Attempting to send assignment email...');
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`Email sent successfully, message ID: ${info.messageId}`);
      return { 
        success: true,
        message: `Vacancy assignment email sent to ${recruiterEmail}`
      };
    } catch (mailError) {
      console.error('Error sending email:', mailError);
      return { 
        success: false,
        message: `Failed to send email to ${recruiterEmail}: ${mailError.message}`
      };
    }
  } catch (error) {
    console.error('Error in sendVacancyAssignmentEmail:', error);
    return { 
      success: false,
      message: `Error processing email: ${error.message}`
    };
  }
};