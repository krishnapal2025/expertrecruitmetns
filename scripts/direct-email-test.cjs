/**
 * Direct Email Test
 * 
 * This script sends a direct test email to any email address using Mailgun
 * without requiring a vacancy from the database.
 * 
 * Usage: node scripts/direct-email-test.cjs <email> [<name>]
 * 
 * Example:
 *   node scripts/direct-email-test.cjs john.doe@example.com "John Doe"
 */

require('dotenv').config();
const mailgun = require('mailgun-js');

// Get command line arguments
const recipientEmail = process.argv[2] || process.env.MAILGUN_FROM_EMAIL;
const recipientName = process.argv[3] || 'Test User';

// Validate email argument
if (!recipientEmail) {
  console.error('ERROR: Recipient email is required');
  console.log('Usage: node scripts/direct-email-test.cjs <email> [<name>]');
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

if (!process.env.MAILGUN_FROM_EMAIL) {
  console.error('ERROR: MAILGUN_FROM_EMAIL environment variable is not set');
  process.exit(1);
}

// Initialize Mailgun
console.log('\n==== DIRECT EMAIL TEST ====');
console.log(`API Key: ${process.env.MAILGUN_API_KEY.substring(0, 5)}...`);
console.log(`Domain: ${process.env.MAILGUN_DOMAIN}`);
console.log(`From Email: ${process.env.MAILGUN_FROM_EMAIL}`);
console.log(`Recipient: ${recipientEmail}`);
console.log(`Recipient Name: ${recipientName}`);

// Check if domain is a sandbox domain
const domain = process.env.MAILGUN_DOMAIN;
const isSandbox = domain.includes('sandbox');
if (isSandbox) {
  console.warn('\n⚠️ WARNING: Using a Mailgun sandbox domain');
  console.warn('Sandbox domains require recipient email verification before sending');
  console.warn(`Recipient email "${recipientEmail}" must be authorized in the Mailgun dashboard`);
}

// Create Mailgun client
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

// Create email content
const emailData = {
  from: process.env.MAILGUN_FROM_EMAIL,
  to: recipientEmail,
  subject: 'Expert Recruitments - Email Test',
  text: `
    Hello ${recipientName},

    This is a test email from Expert Recruitments to verify that our email delivery system is working correctly.

    Email details:
    - Sender: ${process.env.MAILGUN_FROM_EMAIL}
    - Recipient: ${recipientEmail}
    - Domain: ${process.env.MAILGUN_DOMAIN}
    - API Key: ${process.env.MAILGUN_API_KEY.substring(0, 5)}...
    - Timestamp: ${new Date().toISOString()}

    If you are receiving this message, it means our email configuration is working properly.

    Best regards,
    Expert Recruitments Team
  `,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #4060e0;">Expert Recruitments</h1>
      </div>

      <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-top: 0;">Email Test Successful!</h2>
        <p>Hello ${recipientName},</p>
        <p>This is a test email from Expert Recruitments to verify that our email delivery system is working correctly.</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h3 style="color: #333;">Email Details:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Sender:</strong> ${process.env.MAILGUN_FROM_EMAIL}</li>
          <li><strong>Recipient:</strong> ${recipientEmail}</li>
          <li><strong>Domain:</strong> ${process.env.MAILGUN_DOMAIN}</li>
          <li><strong>API Key:</strong> ${process.env.MAILGUN_API_KEY.substring(0, 5)}...</li>
          <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
        </ul>
      </div>

      <p>If you are receiving this message, it means our email configuration is working properly.</p>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.9em; color: #777; text-align: center;">
        <p>Best regards,<br>Expert Recruitments Team</p>
        <p style="font-size: 0.8em;">© ${new Date().getFullYear()} Expert Recruitments LLC. All rights reserved.</p>
      </div>
    </div>
  `
};

// Send the email
console.log('\nSending test email...');

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
    
    process.exit(1);
  } else {
    console.log('\n✅ TEST EMAIL SENT SUCCESSFULLY!');
    console.log('Mailgun API Response:', body);
    
    console.log('\nIf you do not receive the email, check:');
    console.log('1. Your spam/junk folder');
    console.log('2. Domain verification status in Mailgun dashboard');
    console.log('3. Email deliverability settings in Mailgun');
    
    process.exit(0);
  }
});