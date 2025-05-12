/**
 * Database Vacancy Mailgun Test
 * 
 * This script tests sending a vacancy assignment email using actual database records 
 * to ensure the flow works from database to Mailgun.
 * 
 * Run with: node scripts/test-db-mailgun-vacancy.cjs <vacancy_id> <recruiter_email> <recruiter_name>
 */

require('dotenv').config();
const { Client } = require('pg');
const mailgun = require('mailgun-js');

// Validate arguments
const vacancyId = process.argv[2];
const recruiterEmail = process.argv[3] || process.env.MAILGUN_FROM_EMAIL;
const recruiterName = process.argv[4] || 'Test Recruiter';

if (!vacancyId) {
  console.error('ERROR: Vacancy ID is required');
  console.log('Usage: node scripts/test-db-mailgun-vacancy.cjs <vacancy_id> <recruiter_email> <recruiter_name>');
  process.exit(1);
}

// Check for required environment variables
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

if (!process.env.MAILGUN_API_KEY) {
  console.error('ERROR: MAILGUN_API_KEY environment variable is not set');
  process.exit(1);
}

if (!process.env.MAILGUN_DOMAIN) {
  console.error('ERROR: MAILGUN_DOMAIN environment variable is not set');
  process.exit(1);
}

if (!process.env.MAILGUN_FROM_EMAIL) {
  console.error('ERROR: MAILGUN_FROM_EMAIL environment variable is not set');
  process.exit(1);
}

async function main() {
  try {
    console.log('\n======== DATABASE VACANCY MAILGUN TEST ========');
    console.log(`Vacancy ID: ${vacancyId}`);
    console.log(`Recruiter Email: ${recruiterEmail}`);
    console.log(`Recruiter Name: ${recruiterName}`);
    console.log('==============================================');
    
    // Connect to the database
    console.log('\nConnecting to database...');
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    
    await client.connect();
    console.log('Database connected successfully');
    
    // Fetch the vacancy from the database
    console.log(`\nFetching vacancy with ID ${vacancyId}...`);
    const vacancyResult = await client.query('SELECT * FROM vacancies WHERE id = $1', [vacancyId]);
    
    if (!vacancyResult.rows.length) {
      console.error(`ERROR: No vacancy found with ID ${vacancyId}`);
      await client.end();
      process.exit(1);
    }
    
    const vacancy = vacancyResult.rows[0];
    console.log('Vacancy found:', vacancy);
    
    // Create email content
    console.log('\nPreparing email content...');
    const origin = 'https://expertrecruitments.replit.app';
    const vacancyUrl = `${origin}/recruiter/vacancy/${vacancy.id}`;
    
    // Initialize Mailgun
    console.log('\nInitializing Mailgun client...');
    console.log(`API Key: ${process.env.MAILGUN_API_KEY.substring(0, 5)}...`);
    console.log(`Domain: ${process.env.MAILGUN_DOMAIN}`);
    console.log(`From Email: ${process.env.MAILGUN_FROM_EMAIL}`);
    
    const mg = mailgun({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    });
    
    // Format email data
    const emailData = {
      from: process.env.MAILGUN_FROM_EMAIL,
      to: recruiterEmail,
      subject: `New Vacancy Assignment: ${vacancy.job_title || vacancy.title} at ${vacancy.company_name || vacancy.company}`,
      text: `
        Hello ${recruiterName},
        
        You have been assigned a new vacancy to handle:
        
        Company: ${vacancy.company_name || vacancy.company}
        Position: ${vacancy.job_title || vacancy.title}
        Location: ${vacancy.location}
        
        Job Description:
        ${vacancy.job_description || vacancy.description}
        
        Required Skills:
        ${vacancy.required_skills || vacancy.requirements}
        
        Experience Level:
        ${vacancy.experience_level || vacancy.experience}
        
        Salary Range:
        ${vacancy.salary_range || 'Not specified'}
        
        Contact Person:
        ${vacancy.contact_name}
        
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
            <h3 style="color: #ff0077; margin-top: 0;">${vacancy.job_title || vacancy.title}</h3>
            <p><strong>Company:</strong> ${vacancy.company_name || vacancy.company}</p>
            <p><strong>Location:</strong> ${vacancy.location}</p>
            <p><strong>Industry:</strong> ${vacancy.industry}</p>
            <p><strong>Employment Type:</strong> ${vacancy.employment_type}</p>
            <p><strong>Salary Range:</strong> ${vacancy.salary_range || 'Not specified'}</p>
          </div>
          
          <h4 style="color: #333;">Job Description:</h4>
          <p style="line-height: 1.6;">${vacancy.job_description || vacancy.description}</p>
          
          <h4 style="color: #333;">Required Skills:</h4>
          <p style="line-height: 1.6;">${vacancy.required_skills || vacancy.requirements}</p>
          
          <h4 style="color: #333;">Experience Level:</h4>
          <p style="line-height: 1.6;">${vacancy.experience_level || vacancy.experience}</p>

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
    
    // Log full email data for debugging
    console.log('\nFull Email Data:');
    console.log(JSON.stringify({
      from: emailData.from,
      to: emailData.to,
      subject: emailData.subject
    }, null, 2));
    
    // Send the email
    console.log('\nSending email via Mailgun API...');
    
    mg.messages().send(emailData, (error, body) => {
      if (error) {
        console.error('\n❌ ERROR SENDING EMAIL:');
        console.error('- Status Code:', error.statusCode);
        console.error('- Error Message:', error.message);
        
        if (error.statusCode === 401) {
          console.error('\n🔑 AUTHENTICATION ERROR: The API key provided may be invalid or not authorized.');
        } else if (error.statusCode === 400) {
          console.error('\n⚠️ BAD REQUEST: There was a problem with the email data format.');
        } else if (error.statusCode === 403) {
          console.error('\n⛔ FORBIDDEN: Your account is not allowed to send from this domain.');
          console.error('Verify that your domain is properly set up in Mailgun account.');
        }
        
        process.exit(1);
      } else {
        console.log('\n✅ VACANCY ASSIGNMENT EMAIL SENT SUCCESSFULLY!');
        console.log('Mailgun Response:');
        console.log(`- Message ID: ${body.id}`);
        console.log(`- Status: ${body.message}`);
        
        console.log('\nIf the user still does not receive this email, check:');
        console.log('1. Spam/junk folder');
        console.log('2. Domain verification status in Mailgun dashboard');
        console.log('3. Email deliverability settings');
        console.log('4. Email filters on the recipient side');
        
        if (process.env.MAILGUN_DOMAIN.includes('sandbox')) {
          console.log('\n⚠️ NOTE: Since you are using a sandbox domain:');
          console.log(`Make sure "${recruiterEmail}" has been authorized in your Mailgun dashboard.`);
          console.log('Sandbox domains can only send to pre-authorized recipients.');
        }
        
        process.exit(0);
      }
    });
    
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

main();