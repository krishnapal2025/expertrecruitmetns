import { MailService } from '@sendgrid/mail';
import { Vacancy } from '@shared/schema';

// Initialize the SendGrid mail service
export function initializeSendGrid() {
  // Check if SendGrid API key is available
  if (!process.env.SENDGRID_API_KEY) {
    console.warn('SENDGRID_API_KEY environment variable is not set. Email sending will be disabled.');
    return false;
  }

  try {
    const mailService = new MailService();
    mailService.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('SendGrid mail service initialized successfully');
    return mailService;
  } catch (error) {
    console.error('Failed to initialize SendGrid mail service:', error);
    return false;
  }
}

// Create a singleton mail service instance
const mailService = initializeSendGrid();

/**
 * SendGrid implementation of vacancy assignment email
 * Uses SendGrid API to send actual emails to recruiters
 */
export async function sendVacancyAssignmentEmailWithSendGrid(
  recruiterEmail: string,
  recruiterName: string,
  vacancy: Vacancy,
  origin: string
): Promise<{ success: boolean; message?: string }> {
  try {
    // If SendGrid is not initialized, return early
    if (!mailService) {
      console.log('SendGrid mail service not available, cannot send email');
      return { 
        success: false, 
        message: 'Email service not configured' 
      };
    }

    console.log(`Sending vacancy assignment email to ${recruiterEmail} via SendGrid`);
    
    // Create a view vacancy URL
    const vacancyUrl = `${origin}/recruiter/vacancy/${vacancy.id}`;
    
    // Create email content
    const emailContent = {
      to: recruiterEmail,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@expertrecruitments.com', 
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

          <div style="text-align: center; margin: 30px 0;">
            <a href="${vacancyUrl}" style="background-color: #4060e0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">View Vacancy Details</a>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.8em; color: #888; text-align: center;">
            <p>Expert Recruitments LLC, Dubai, UAE</p>
            <p>© ${new Date().getFullYear()} Expert Recruitments. All rights reserved.</p>
          </div>
        </div>
      `
    };
    
    try {
      // Send the email using SendGrid
      await (mailService as MailService).send(emailContent);
      console.log('Vacancy assignment email sent successfully via SendGrid');
      return { 
        success: true,
        message: 'Email sent successfully' 
      };
    } catch (sendError) {
      console.error('SendGrid error:', sendError);
      return { 
        success: false,
        message: 'Failed to send email via SendGrid' 
      };
    }
  } catch (error) {
    console.error('Error in sendVacancyAssignmentEmailWithSendGrid:', error);
    return { 
      success: false,
      message: 'Error preparing email' 
    };
  }
}