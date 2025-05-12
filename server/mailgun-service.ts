import mailgun from 'mailgun-js';
import { Vacancy } from '@shared/schema';

// Initialize the Mailgun client
export function initializeMailgun() {
  // Check if Mailgun API key is available
  if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
    console.warn('MAILGUN_API_KEY or MAILGUN_DOMAIN environment variables are not set. Email sending will be disabled.');
    return false;
  }

  console.log('Initializing Mailgun with:');
  console.log('- Domain:', process.env.MAILGUN_DOMAIN);
  console.log('- API Key:', process.env.MAILGUN_API_KEY.substring(0, 5) + '...[rest hidden]');
  console.log('- From Email:', process.env.MAILGUN_FROM_EMAIL || 'Not set');

  try {
    const mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    });
    console.log('Mailgun service initialized successfully');
    return mg;
  } catch (error) {
    console.error('Failed to initialize Mailgun service:', error);
    return false;
  }
}

// Create a singleton mail service instance
const mailgunClient = initializeMailgun();

/**
 * Mailgun implementation of vacancy assignment email
 * Uses Mailgun API to send actual emails to recruiters
 */
export async function sendVacancyAssignmentEmailWithMailgun(
  recruiterEmail: string,
  recruiterName: string,
  vacancy: Vacancy,
  origin: string
): Promise<{ success: boolean; message?: string }> {
  try {
    console.log("\n==== MAILGUN VACANCY EMAIL ASSIGNMENT ====");
    console.log(`Attempting to send email to ${recruiterEmail} for vacancy #${vacancy.id}`);
    
    // If Mailgun is not initialized, return early
    if (!mailgunClient) {
      console.log('Mailgun service not available, cannot send email');
      console.log('Mailgun environment check:');
      console.log('- MAILGUN_API_KEY exists:', !!process.env.MAILGUN_API_KEY);
      console.log('- MAILGUN_DOMAIN exists:', !!process.env.MAILGUN_DOMAIN);
      console.log('- MAILGUN_FROM_EMAIL exists:', !!process.env.MAILGUN_FROM_EMAIL);
      return { 
        success: false, 
        message: 'Email service not configured' 
      };
    }

    console.log('-----------------------------------');
    console.log(`SENDING EMAIL VIA MAILGUN`);
    console.log('-----------------------------------');
    console.log(`- To: ${recruiterEmail}`);
    console.log(`- Recipient Name: ${recruiterName}`);
    console.log(`- Vacancy ID: ${vacancy.id}`);
    console.log(`- Job Title: ${vacancy.jobTitle}`);
    console.log(`- Company: ${vacancy.companyName}`);
    
    // Create a view vacancy URL
    const vacancyUrl = `${origin}/recruiter/vacancy/${vacancy.id}`;
    console.log(`- Vacancy URL: ${vacancyUrl}`);
    
    // Create email content
    const fromEmail = process.env.MAILGUN_FROM_EMAIL || 'noreply@expertrecruitments.com';
    console.log(`- From Email: ${fromEmail}`);
    
    const emailData = {
      from: fromEmail,
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
    
    console.log('Attempting to send email via Mailgun API...');
    
    try {
      // Send the email using Mailgun
      await new Promise<void>((resolve, reject) => {
        if (!mailgunClient) {
          console.error('Mailgun client became null somehow!');
          reject(new Error('Mailgun client is not available'));
          return;
        }

        console.log('Calling Mailgun messages().send()...');
        mailgunClient.messages().send(emailData, (error, body) => {
          if (error) {
            console.error('Mailgun API returned an error:');
            console.error('- Status Code:', error.statusCode);
            console.error('- Error Message:', error.message);
            reject(error);
          } else {
            console.log('Mailgun API response:', body);
            resolve();
          }
        });
      });
      
      console.log('Vacancy assignment email sent successfully via Mailgun');
      return { 
        success: true,
        message: 'Email sent successfully' 
      };
    } catch (sendError) {
      console.error('Mailgun error:', sendError);
      return { 
        success: false,
        message: `Failed to send email via Mailgun: ${sendError.message || 'Unknown error'}` 
      };
    }
  } catch (error) {
    console.error('Error in sendVacancyAssignmentEmailWithMailgun:', error);
    return { 
      success: false,
      message: `Error preparing email: ${error.message || 'Unknown error'}` 
    };
  }
}