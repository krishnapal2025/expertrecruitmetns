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
      </div>
      
      <p>If you received this email, it means that the Mailgun integration is functioning correctly!</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 0.8em; color: #888; text-align: center;">
        <p>Expert Recruitments LLC</p>
        <p>© ${new Date().getFullYear()} Expert Recruitments. All rights reserved.</p>
      </div>
    </div>
  `
};

// Send the email
try {
  const result = await new Promise((resolve, reject) => {
    mg.messages().send(emailData, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
  
  console.log('Test email sent successfully!');
  console.log('Mailgun API response:', result);
  process.exit(0);
} catch (error) {
  console.error('Error sending test email:', error);
  process.exit(1);
}