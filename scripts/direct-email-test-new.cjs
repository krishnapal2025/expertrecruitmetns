/**
 * Recruiter Role Assignment Direct Email Test
 * 
 * This script tests sending an email with the requested exact format
 * directly using Mailgun API without requiring any imports from the server.
 * 
 * Usage: node scripts/direct-email-test-new.cjs <recipient_email> <recipient_name>
 */

require('dotenv').config();
const mailgun = require('mailgun-js');

// Get command line arguments
const recipientEmail = process.argv[2];
const recipientName = process.argv[3] || 'Recruiter';

// Validate email argument
if (!recipientEmail) {
  console.error('ERROR: Recipient email is required');
  console.log('Usage: node scripts/direct-email-test-new.cjs <recipient_email> <recipient_name>');
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

// Initialize Mailgun
console.log('\n==== RECRUITER ROLE ASSIGNMENT EMAIL TEST ====');
console.log(`API Key: ${process.env.MAILGUN_API_KEY.substring(0, 5)}...`);
console.log(`Domain: ${process.env.MAILGUN_DOMAIN}`);
console.log(`Recipient: ${recipientEmail} (${recipientName})`);

// Create Mailgun client
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

// Create email content with the exact format requested
const emailData = {
  from: `Mailgun Sandbox <postmaster@${process.env.MAILGUN_DOMAIN}>`,
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
console.log('\nSending recruiter role assignment email...');

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
    console.log('\n✅ RECRUITER ROLE ASSIGNMENT EMAIL SENT SUCCESSFULLY!');
    console.log('Mailgun API Response:', body);
    
    console.log('\nExact Email Format Used:');
    console.log('- From:', emailData.from);
    console.log('- To:', emailData.to);
    console.log('- Subject:', emailData.subject);
    console.log('- Text:');
    console.log(emailData.text);
    
    console.log('\nIf you do not receive the email, check:');
    console.log('1. Your spam/junk folder');
    console.log('2. Domain verification status in Mailgun dashboard');
    console.log('3. Email deliverability settings in Mailgun');
    
    process.exit(0);
  }
});