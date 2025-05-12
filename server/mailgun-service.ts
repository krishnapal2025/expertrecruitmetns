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
    
    // Check for blocked email addresses
    if (recruiterEmail.toLowerCase().includes('anilkumar.gvm9@gmail.com')) {
      console.log('Email rejected: This recipient email is blocked');
      return {
        success: false,
        message: 'This recipient email is not allowed'
      };
    }
    
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
    
    // Create email content using the specific format requested
    const fromEmail = `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN}>`;
    console.log(`- From Email: ${fromEmail}`);
    
    const emailData = {
      from: fromEmail,
      to: [`${recruiterName} <${recruiterEmail}>`],
      subject: `Hello ${recruiterName}`,
      text: `Subject: Recruiter Role Assignment

Hi ${recruiterName},

You have been assigned the role of Recruiter for our upcoming hiring process. Please begin coordinating with the team to source and screen candidates as needed.

Let me know if you need any assistance.

Best,
HR Manager`
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

        // Check if we're using a sandbox domain (common issue)
        const domain = process.env.MAILGUN_DOMAIN || '';
        const isSandbox = domain.includes('sandbox');
        if (isSandbox) {
          console.warn('WARNING: Using a Mailgun sandbox domain');
          console.warn('Sandbox domains require recipient email verification before sending');
          console.warn('Verify that recipient email is authorized for the sandbox account');
        }

        console.log('Calling Mailgun messages().send()...');
        mailgunClient.messages().send(emailData, (error, body) => {
          if (error) {
            console.error('Mailgun API returned an error:');
            console.error('- Status Code:', error.statusCode);
            console.error('- Error Message:', error.message);
            
            // Provide more helpful error details
            if (error.statusCode === 401) {
              console.error('- Authentication Issue: Your API key may be invalid');
            } else if (error.statusCode === 403) {
              console.error('- Authorization Issue: You may not be authorized for this domain');
              console.error('- If using sandbox domain, verify recipient email is authorized');
            }
            
            reject(error);
          } else {
            console.log('Mailgun API response:', body);
            console.log('Email submitted successfully to Mailgun queue');
            console.log('If you do not receive the email, check:');
            console.log('1. Your spam/junk folder');
            console.log('2. Domain verification status in Mailgun dashboard');
            console.log('3. Email deliverability settings in Mailgun');
            resolve();
          }
        });
      });
      
      console.log('Vacancy assignment email sent successfully via Mailgun');
      return { 
        success: true,
        message: 'Email sent successfully' 
      };
    } catch (sendError: any) {
      console.error('Mailgun error:', sendError);
      // Get detailed error information
      const statusCode = sendError.statusCode || 'unknown';
      const errorMessage = sendError.message || 'Unknown error';
      
      console.error(`Mailgun API error - Status: ${statusCode}, Message: ${errorMessage}`);
      
      // Check for specific error types and provide better diagnostics
      if (statusCode === 401) {
        console.error('❌ AUTHENTICATION ERROR: Mailgun API key is invalid or unauthorized');
      } else if (statusCode === 403) {
        console.error('❌ FORBIDDEN ERROR: Domain verification issue or sending restrictions');
        console.error('Check if your domain is properly verified in Mailgun account');
      } else if (statusCode === 400) {
        console.error('❌ BAD REQUEST: Problem with the email data format');
        console.error('Email data:', JSON.stringify(emailData, null, 2));
      }
      
      return { 
        success: false,
        message: `Failed to send email via Mailgun: ${errorMessage} (Status: ${statusCode})` 
      };
    }
  } catch (error: any) {
    console.error('Error in sendVacancyAssignmentEmailWithMailgun:', error);
    const errorMessage = error?.message || 'Unknown error';
    return { 
      success: false,
      message: `Error preparing email: ${errorMessage}` 
    };
  }
}