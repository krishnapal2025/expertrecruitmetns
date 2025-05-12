/**
 * Full Vacancy Assignment Test
 * 
 * This script simulates the entire vacancy assignment flow including database interactions
 * to help diagnose any issues with the email sending process.
 */

require('dotenv').config();
const mailgun = require('mailgun-js');

// Command line arguments
const recipientEmail = process.argv[2] || process.env.MAILGUN_FROM_EMAIL;
const recipientName = process.argv[3] || 'Test Recruiter';

// Create a mock vacancy object that looks like what would come from the database
const mockVacancy = {
  id: 99999,
  title: 'Senior Software Engineer',
  jobTitle: 'Senior Software Engineer',
  company: 'Test Company Inc.',
  companyName: 'Test Company Inc.',
  location: 'Remote',
  industry: 'Technology',
  employmentType: 'Full-time',
  jobDescription: 'This is a test job description for the vacancy assignment email test.',
  requiredSkills: 'JavaScript, Node.js, React, TypeScript',
  experienceLevel: '3-5 years',
  salaryRange: '$100,000 - $130,000',
  contactName: 'HR Manager',
  contactEmail: process.env.MAILGUN_FROM_EMAIL,
  contactPhone: '+1234567890',
  applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
  assignedTo: recipientEmail,
  assignedToName: recipientName
};

// Mock origin URL like it would come from Express
const origin = 'https://expertrecruitments.replit.app';

// Initialize Mailgun client directly
console.log('\n==== INITIALIZING MAILGUN ====');
console.log('API Key:', process.env.MAILGUN_API_KEY ? `${process.env.MAILGUN_API_KEY.substring(0, 5)}...` : 'Not Set');
console.log('Domain:', process.env.MAILGUN_DOMAIN || 'Not Set');
console.log('From Email:', process.env.MAILGUN_FROM_EMAIL || 'Not Set');

// Check for required environment variables
if (!process.env.MAILGUN_API_KEY) {
  console.error('\n❌ ERROR: MAILGUN_API_KEY environment variable is not set');
  process.exit(1);
}

if (!process.env.MAILGUN_DOMAIN) {
  console.error('\n❌ ERROR: MAILGUN_DOMAIN environment variable is not set');
  process.exit(1);
}

if (!process.env.MAILGUN_FROM_EMAIL) {
  console.error('\n❌ ERROR: MAILGUN_FROM_EMAIL environment variable is not set');
  process.exit(1);
}

// Check if domain is a sandbox domain
const domain = process.env.MAILGUN_DOMAIN;
const isSandbox = domain.includes('sandbox');
if (isSandbox) {
  console.warn('\n⚠️ WARNING: Using a Mailgun sandbox domain');
  console.warn('Sandbox domains require recipient email verification before sending');
  console.warn(`Recipient email "${recipientEmail}" must be authorized in the Mailgun dashboard`);
}

// Initialize Mailgun client
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

console.log('\n==== SIMULATING VACANCY ASSIGNMENT ====');
console.log('Recipient:', recipientEmail);
console.log('Name:', recipientName);
console.log('Vacancy:', mockVacancy.jobTitle);
console.log('Company:', mockVacancy.companyName);
console.log('Origin URL:', origin);

// Create email content - exactly matching what's in the actual application
console.log('\n==== PREPARING EMAIL CONTENT ====');

// Create a view vacancy URL
const vacancyUrl = `${origin}/recruiter/vacancy/${mockVacancy.id}`;
console.log('Vacancy URL:', vacancyUrl);

// Format email data exactly as in mailgun-service.ts
const emailData = {
  from: process.env.MAILGUN_FROM_EMAIL,
  to: recipientEmail,
  subject: `New Vacancy Assignment: ${mockVacancy.jobTitle} at ${mockVacancy.companyName}`,
  text: `
    Hello ${recipientName},
    
    You have been assigned a new vacancy to handle:
    
    Company: ${mockVacancy.companyName}
    Position: ${mockVacancy.jobTitle}
    Location: ${mockVacancy.location}
    
    Job Description:
    ${mockVacancy.jobDescription}
    
    Required Skills:
    ${mockVacancy.requiredSkills}
    
    Experience Level:
    ${mockVacancy.experienceLevel}
    
    Salary Range:
    ${mockVacancy.salaryRange || 'Not specified'}
    
    Contact Person:
    ${mockVacancy.contactName}
    
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
      <p>Hello ${recipientName},</p>
      <p>You have been assigned a new vacancy to handle:</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #ff0077; margin-top: 0;">${mockVacancy.jobTitle}</h3>
        <p><strong>Company:</strong> ${mockVacancy.companyName}</p>
        <p><strong>Location:</strong> ${mockVacancy.location}</p>
        <p><strong>Industry:</strong> ${mockVacancy.industry}</p>
        <p><strong>Employment Type:</strong> ${mockVacancy.employmentType}</p>
        <p><strong>Salary Range:</strong> ${mockVacancy.salaryRange || 'Not specified'}</p>
      </div>
      
      <h4 style="color: #333;">Job Description:</h4>
      <p style="line-height: 1.6;">${mockVacancy.jobDescription}</p>
      
      <h4 style="color: #333;">Required Skills:</h4>
      <p style="line-height: 1.6;">${mockVacancy.requiredSkills}</p>
      
      <h4 style="color: #333;">Experience Level:</h4>
      <p style="line-height: 1.6;">${mockVacancy.experienceLevel}</p>

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

// Send the email
console.log('\n==== SENDING EMAIL VIA MAILGUN API ====');
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
      if (isSandbox) {
        console.error('For sandbox domains, the recipient email must be authorized in your Mailgun account.');
      }
    }
    
    console.error('\n== FULL EMAIL DATA ==');
    console.error(JSON.stringify(emailData, null, 2));
    
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
    
    if (isSandbox) {
      console.log('\n⚠️ NOTE: Since you are using a sandbox domain:');
      console.log(`Make sure "${recipientEmail}" has been authorized in your Mailgun dashboard.`);
      console.log('Sandbox domains can only send to pre-authorized recipients.');
    }
    
    process.exit(0);
  }
});