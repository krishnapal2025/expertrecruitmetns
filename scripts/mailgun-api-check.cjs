/**
 * Mailgun API Status Check
 * 
 * This script checks the basic functionality of the Mailgun API key
 * and tests its permissions for sending emails.
 * 
 * Usage: node scripts/mailgun-api-check.cjs
 */

require('dotenv').config();
const mailgun = require('mailgun-js');

// Check for required environment variables
if (!process.env.MAILGUN_API_KEY) {
  console.error('ERROR: MAILGUN_API_KEY environment variable is not set');
  process.exit(1);
}

if (!process.env.MAILGUN_DOMAIN) {
  console.error('ERROR: MAILGUN_DOMAIN environment variable is not set');
  process.exit(1);
}

console.log('\n==== MAILGUN API STATUS CHECK ====');
console.log(`API Key: ${process.env.MAILGUN_API_KEY.substring(0, 5)}...`);
console.log(`Domain: ${process.env.MAILGUN_DOMAIN}`);

// The API key format should be a long string that looks like a base64 encoded string
// It should typically be at least 40 characters long
const apiKeyLength = process.env.MAILGUN_API_KEY?.length || 0;
console.log(`API Key Length: ${apiKeyLength} characters`);

if (apiKeyLength < 40) {
  console.log('⚠️ WARNING: API key appears to be too short to be valid');
  console.log('Mailgun API keys are typically at least 40 characters long');
}

// Check if this looks like a Private API key (for sending) or Public API key (for validations only)
const isPrivateKey = process.env.MAILGUN_API_KEY?.startsWith('key-');
console.log(`API Key Format: ${isPrivateKey ? 'Private API Key (key-...)' : 'May not be a standard Private API Key'}`);

if (!isPrivateKey) {
  console.log('⚠️ WARNING: API key does not start with "key-" as expected for Private API Keys');
  console.log('This might indicate this is a Public API Key (which cannot send emails)');
  console.log('Or it could be a non-standard format for a Private API Key');
}

// Initialize Mailgun client
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

// Test a simple sending operation
console.log('\nTesting send permission with a dry-run...');

const testData = {
  from: `Test <postmaster@${process.env.MAILGUN_DOMAIN}>`,
  to: 'test@example.com',
  subject: 'API Test',
  text: 'This is a test message.',
  'o:testmode': 'yes' // Use test mode - no actual email is sent
};

mg.messages().send(testData, (error, body) => {
  if (error) {
    console.error('\n❌ ERROR TESTING SEND PERMISSION:');
    console.error('- Status Code:', error.statusCode);
    console.error('- Error Message:', error.message);
    
    // Analyze error for more helpful information
    if (error.statusCode === 401) {
      console.log('\n🔑 AUTHENTICATION ERROR: The API key is invalid or unauthorized for sending.');
      console.log('This indicates the API key is incorrect or does not have sending permission.');
      console.log('\nPossible Solutions:');
      console.log('1. Check if you\'re using the correct Private API Key from Mailgun');
      console.log('2. Verify you\'re using the Private API Key (starts with "key-"), not the Public API Key');
      console.log('3. Make sure the API key is associated with the domain you\'re trying to use');
    } else if (error.statusCode === 400) {
      console.log('\n⚠️ BAD REQUEST: There was a problem with the email data format.');
    } else if (error.statusCode === 403) {
      console.log('\n⛔ FORBIDDEN: Your account is not allowed to send from this domain.');
      console.log('Verify that your domain is properly set up in your Mailgun account.');
    }
  } else {
    console.log('\n✅ SEND PERMISSION TEST SUCCESSFUL!');
    console.log('The API key has permission to send messages from this domain.');
    console.log('Test Mode Response:', body);
    
    // If the send test worked, but real emails aren't reaching recipients
    console.log('\nSince your API key can send test messages, but real emails aren\'t being received:');
    console.log('1. Check if your domain is in sandbox mode (requires recipient verification)');
    console.log('2. Check if the emails are going to spam folders');
    console.log('3. Verify that your domain\'s DNS records are properly configured');
    console.log('4. Check any sending limit restrictions on your account');
  }
});