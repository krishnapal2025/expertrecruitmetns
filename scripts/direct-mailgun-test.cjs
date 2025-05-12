/**
 * Direct test for Mailgun API
 * 
 * This script tests sending email through Mailgun without any abstraction.
 * It directly creates a Mailgun client and sends an email.
 */

require('dotenv').config();
const mailgun = require('mailgun-js');

// Check for required environment variables
if (!process.env.MAILGUN_API_KEY) {
  console.error('Error: MAILGUN_API_KEY environment variable is not set');
  process.exit(1);
}

if (!process.env.MAILGUN_DOMAIN) {
  console.error('Error: MAILGUN_DOMAIN environment variable is not set');
  process.exit(1);
}

if (!process.env.MAILGUN_FROM_EMAIL) {
  console.error('Error: MAILGUN_FROM_EMAIL environment variable is not set');
  process.exit(1);
}

// Get the recipient email from command line arguments or default to the from email
const recipientEmail = process.argv[2] || process.env.MAILGUN_FROM_EMAIL;
const recipientName = process.argv[3] || 'Test Recipient';

console.log('\n==== MAILGUN DIRECT TEST ====');
console.log('API Key:', process.env.MAILGUN_API_KEY.substring(0, 5) + '...');
console.log('Domain:', process.env.MAILGUN_DOMAIN);
console.log('From Email:', process.env.MAILGUN_FROM_EMAIL);
console.log('Recipient:', recipientEmail);
console.log('Recipient Name:', recipientName);

// Initialize Mailgun client
console.log('\nInitializing Mailgun client...');
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

// Create email data
const emailData = {
  from: `Expert Recruitments <${process.env.MAILGUN_FROM_EMAIL}>`,
  to: recipientEmail,
  subject: 'Direct Mailgun Test - Vacancy Notification',
  text: `
    Hello ${recipientName},
    
    This is a test email from Expert Recruitments to verify direct Mailgun integration.
    
    This email is sent directly using the Mailgun API to test email delivery.
    
    Time: ${new Date().toISOString()}
    
    Regards,
    Expert Recruitments Team
  `,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4060e0;">Expert Recruitments</h2>
      </div>
      <h2 style="color: #333; text-align: center;">Direct Mailgun Test - Vacancy Notification</h2>
      <p>Hello ${recipientName},</p>
      <p>This is a test email from Expert Recruitments to verify direct Mailgun integration.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #ff0077; margin-top: 0;">Test Details</h3>
        <p><strong>Recipient:</strong> ${recipientEmail}</p>
        <p><strong>Domain:</strong> ${process.env.MAILGUN_DOMAIN}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Test ID:</strong> ${Math.random().toString(36).substring(2, 10)}</p>
      </div>
      
      <p>This email is sent directly using the Mailgun API to test email delivery.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.8em; color: #888; text-align: center;">
        <p>Expert Recruitments LLC</p>
        <p>© ${new Date().getFullYear()} Expert Recruitments. All rights reserved.</p>
      </div>
    </div>
  `
};

// Send the test email
console.log('\nSending test email...');
mg.messages().send(emailData, (error, body) => {
  if (error) {
    console.error('\n❌ ERROR SENDING EMAIL:');
    console.error('- Status Code:', error.statusCode);
    console.error('- Error Message:', error.message);
    
    if (error.statusCode === 401) {
      console.error('\n🔑 AUTHENTICATION ERROR: The API key provided may be invalid or not authorized.');
      console.error('Please check that:');
      console.error('1. The API key is correct and active');
      console.error('2. The domain is verified in your Mailgun account');
      console.error('3. The API key has permissions to send from this domain');
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
    console.log(`\nMessage ID: ${body.id}`);
    console.log(`Message: ${body.message}`);
    console.log('\nIf you do not receive the email, check:');
    console.log('1. Your spam/junk folder');
    console.log('2. Domain verification status in Mailgun dashboard');
    console.log('3. Email deliverability settings in Mailgun');
    process.exit(0);
  }
});