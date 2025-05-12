/**
 * Full Vacancy Assignment Email Test
 * 
 * This script tests the full vacancy assignment email flow,
 * calling the main email-service function with a mock vacancy.
 * 
 * Usage: node scripts/full-assignment-test.cjs <email> <name>
 * Example: node scripts/full-assignment-test.cjs john.doe@example.com "John Doe"
 */

require('dotenv').config();
const { sendVacancyAssignmentEmailWithMailgun } = require('../server/mailgun-service');

// Get command line arguments
const recipientEmail = process.argv[2];
const recipientName = process.argv[3] || 'Test Recruiter';

// Validate required argument
if (!recipientEmail) {
  console.error('ERROR: Recipient email is required.');
  console.log('Usage: node scripts/full-assignment-test.cjs <email> <name>');
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

console.log('\n==== FULL VACANCY ASSIGNMENT EMAIL TEST ====');
console.log(`API Key: ${process.env.MAILGUN_API_KEY.substring(0, 5)}...`);
console.log(`Domain: ${process.env.MAILGUN_DOMAIN}`);
console.log(`Recipient Email: ${recipientEmail}`);
console.log(`Recipient Name: ${recipientName}`);

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

// Test the full email assignment flow
async function runTest() {
  console.log('Testing the full vacancy assignment email flow...');
  
  try {
    // Call the main email function with our mock data
    const result = await sendVacancyAssignmentEmailWithMailgun(
      recipientEmail,
      recipientName,
      vacancy,
      'https://expertrecruitments.com'
    );
    
    console.log('\nEmail function result:', result);
    
    if (result.success) {
      console.log('\n✅ FULL EMAIL TEST SUCCESSFUL!');
      console.log('The email has been queued for delivery.');
    } else {
      console.error('\n❌ EMAIL TEST FAILED!');
      console.error('Error message:', result.message);
    }
  } catch (error) {
    console.error('\n❌ UNEXPECTED ERROR DURING TEST:');
    console.error(error);
  }
}

// Run the test
runTest().catch(err => {
  console.error('Fatal error running test:', err);
  process.exit(1);
});