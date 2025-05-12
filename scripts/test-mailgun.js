/**
 * Test script for Mailgun integration
 * 
 * This script tests the Mailgun API integration by sending a test email
 * to verify that the configuration works correctly.
 * 
 * Run with: 
 *   node scripts/test-mailgun.js [recipient-email]
 * 
 * If no recipient email is provided, it will default to the MAILGUN_FROM_EMAIL
 */

import { config } from 'dotenv';
import mailgun from 'mailgun-js';

config();

// Function to display environment variables and API information
function displayMailgunInfo() {
  console.log('\n--------------------------------------');
  console.log('MAILGUN CONFIGURATION CHECK');
  console.log('--------------------------------------');
  
  // Check API key
  const hasApiKey = !!process.env.MAILGUN_API_KEY;
  console.log(`API Key: ${hasApiKey ? 
    ('✓ Present (begins with ' + process.env.MAILGUN_API_KEY.substring(0, 5) + '...)') : 
    '✗ Missing'}`);
  
  // Check domain
  const hasDomain = !!process.env.MAILGUN_DOMAIN;
  console.log(`Domain: ${hasDomain ? 
    ('✓ Set to ' + process.env.MAILGUN_DOMAIN) : 
    '✗ Missing'}`);
  
  // Check from email
  const hasFromEmail = !!process.env.MAILGUN_FROM_EMAIL;
  console.log(`From Email: ${hasFromEmail ? 
    ('✓ Set to ' + process.env.MAILGUN_FROM_EMAIL) : 
    '✗ Missing'}`);
    
  console.log('--------------------------------------\n');
  
  return hasApiKey && hasDomain && hasFromEmail;
}

// Display configuration information
const configValid = displayMailgunInfo();

// Exit if configuration is incomplete
if (!configValid) {
  console.error('Error: One or more required Mailgun configuration variables are missing');
  process.exit(1);
}

// Get the recipient email from command line arguments or default to the from email
const recipientEmail = process.argv[2] || process.env.MAILGUN_FROM_EMAIL;

// Initialize Mailgun
console.log('Initializing Mailgun client...');
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

console.log(`Sending test email to: ${recipientEmail}`);

// Create email data
const emailData = {
  from: `Expert Recruitments <${process.env.MAILGUN_FROM_EMAIL}>`,
  to: recipientEmail,
  subject: 'Expert Recruitments - Test Email',
  text: 'This is a test email from Expert Recruitments platform to verify Mailgun integration.',
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4060e0;">Expert Recruitments</h2>
      </div>
      <h2 style="color: #333; text-align: center;">Mailgun Integration Test</h2>
      <p>This is a test email sent from the Expert Recruitments platform to verify that Mailgun email integration is working correctly.</p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="color: #ff0077; margin-top: 0;">Email Details</h3>
        <p><strong>Recipient:</strong> ${recipientEmail}</p>
        <p><strong>Sender:</strong> ${process.env.MAILGUN_FROM_EMAIL}</p>
        <p><strong>Domain:</strong> ${process.env.MAILGUN_DOMAIN}</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Test ID:</strong> ${Math.random().toString(36).substring(2, 10)}</p>
      </div>
      
      <p>If you received this email, it means that the Mailgun integration is functioning correctly!</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.8em; color: #888; text-align: center;">
        <p>Expert Recruitments LLC</p>
        <p>© ${new Date().getFullYear()} Expert Recruitments. All rights reserved.</p>
      </div>
    </div>
  `
};

// Send the email with better error handling
try {
  const result = await new Promise((resolve, reject) => {
    console.log('Calling Mailgun API...');
    mg.messages().send(emailData, (error, body) => {
      if (error) {
        console.error('Mailgun API error details:');
        if (error.statusCode) {
          console.error(`- Status code: ${error.statusCode}`);
        }
        if (error.message) {
          console.error(`- Error message: ${error.message}`);
        }
        
        // Provide helpful guidance based on error codes
        if (error.statusCode === 401) {
          console.error('\nAuthentication Error (401): Your API key may be invalid or inactive.');
          console.error('Please verify your API key is correct and has proper permissions.');
        } else if (error.statusCode === 403) {
          console.error('\nForbidden Error (403): You do not have permission to send from this domain.');
          console.error('Make sure your domain is properly verified in your Mailgun account.');
        } else if (error.statusCode === 400) {
          console.error('\nBad Request Error (400): There is a problem with your request format.');
          console.error('Check the email addresses, formatting, or message content.');
        }
        
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
  
  console.log('\n✅ TEST EMAIL SENT SUCCESSFULLY!');
  console.log('Mailgun API response:', result);
  console.log('\nIf you do not receive the email:');
  console.log('1. Check your spam/junk folder');
  console.log('2. Verify your domain is properly set up in Mailgun');
  console.log('3. For sandbox domains, ensure recipient emails are verified');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error sending test email:', error.message || 'Unknown error');
  process.exit(1);
}