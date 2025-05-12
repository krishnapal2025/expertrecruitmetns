/**
 * Test script for vacancy assignment email with updated format
 * 
 * This script tests the Mailgun email service with a mock vacancy object
 * to verify that the new email format is correctly implemented.
 * 
 * Usage: node scripts/test-vacancy-assignment-email.cjs <email> <name>
 * Example: node scripts/test-vacancy-assignment-email.cjs john.doe@example.com "John Doe"
 */

require('dotenv').config();
const mailgun = require('mailgun-js');

// Get command line arguments
const recipientEmail = process.argv[2];
const recipientName = process.argv[3] || 'Test Recruiter';

// Validate required argument
if (!recipientEmail) {
  console.error('ERROR: Recipient email is required.');
  console.log('Usage: node scripts/test-vacancy-assignment-email.cjs <email> <name>');
  process.exit(1);
}

// Check for required environment variables
if (!process.env.MAILGUN_API_KEY) {
  console.error('ERROR: MAILGUN_API_KEY environment variable is not set');
  process.exit(1);
}

if (!process.env.MAILGUN_DOMAIN) {
  console.error('ERROR: MAILGUN_DOMAIN environment variable is not set');
  process.exit(1);
}

// Initialize Mailgun client
console.log('\n==== TESTING VACANCY ASSIGNMENT EMAIL ====');
console.log(`API Key: ${process.env.MAILGUN_API_KEY.substring(0, 5)}...`);
console.log(`Domain: ${process.env.MAILGUN_DOMAIN}`);
console.log(`Recipient Email: ${recipientEmail}`);
console.log(`Recipient Name: ${recipientName}`);

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

// Create a mock vacancy object
const vacancy = {
  id: 12345,
  companyName: 'Tech Solutions Inc.',
  jobTitle: 'Senior Developer',
  location: 'Remote',
  industry: 'Technology',
  employmentType: 'Full-time',
  salaryRange: '$120,000 - $150,000',
  jobDescription: 'This is a mock job description for testing.',
  requiredSkills: 'JavaScript, React, Node.js',
  experienceLevel: '5+ years',
  contactName: 'HR Director'
};

// Create email content with the new format
const fromEmail = `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN}>`;
const emailData = {
  from: fromEmail,
  to: [`${recipientName} <${recipientEmail}>`],
  subject: `Hello ${recipientName}`,
  text: `Subject: Recruiter Role Assignment

Hi ${recipientName},

You have been assigned the role of Recruiter for our upcoming hiring process. Please begin coordinating with the team to source and screen candidates as needed.

Let me know if you need any assistance.

Best,
HR Manager`
};

// Send the email
console.log('\nSending test email with new format...');

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
    console.log('\n✅ TEST EMAIL SENT SUCCESSFULLY!');
    console.log('Mailgun API Response:', body);
    console.log('\nEmail Data Used:');
    console.log('- From:', emailData.from);
    console.log('- To:', emailData.to);
    console.log('- Subject:', emailData.subject);
    console.log('- Text:', emailData.text);
    
    console.log('\nIf you do not receive the email, check:');
    console.log('1. Your spam/junk folder');
    console.log('2. Domain verification status in Mailgun dashboard');
    console.log('3. Email deliverability settings in Mailgun');
    
    process.exit(0);
  }
});