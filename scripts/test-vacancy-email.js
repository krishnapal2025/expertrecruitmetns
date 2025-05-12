/**
 * Test script for vacancy assignment email
 * 
 * This script tests the full vacancy assignment email process by directly calling
 * the email service functions with a mock vacancy.
 * 
 * Run with: 
 *   node scripts/test-vacancy-email.js [recipient-email]
 * 
 * If no recipient email is provided, it will default to the MAILGUN_FROM_EMAIL
 */

require('dotenv').config();
const mailgun = require('mailgun-js');

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

// Get the recipient email and name from command line or default
const recipientEmail = process.argv[2] || process.env.MAILGUN_FROM_EMAIL;
const recipientName = process.argv[3] || 'Test Recruiter';

// Create a mock vacancy for testing
const mockVacancy = {
  id: 99999,
  title: 'Test Software Engineer',
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
  applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  benefits: 'Health insurance, 401k, Remote work',
  requirements: 'Bachelor\'s degree in Computer Science or equivalent experience',
  createdAt: new Date(),
  updatedAt: new Date(),
  status: 'active',
  assignedTo: recipientEmail,
  assignedToName: recipientName
};

// Mock origin
const origin = 'https://expertrecruitments.replit.app';

console.log('====================================');
console.log('TESTING VACANCY ASSIGNMENT EMAIL');
console.log('====================================');
console.log('Recipient:', recipientEmail);
console.log('Recipient Name:', recipientName);
console.log('Vacancy:', mockVacancy.jobTitle);
console.log('Company:', mockVacancy.companyName);
console.log('Origin:', origin);

// Run the test by calling the email service directly
async function runTest() {
  try {
    console.log('\nCalling sendVacancyAssignmentEmail function...');
    const result = await sendVacancyAssignmentEmail(
      recipientEmail,
      recipientName,
      mockVacancy,
      origin
    );
    
    console.log('\n====================================');
    console.log('EMAIL SENDING RESULT');
    console.log('====================================');
    console.log('Success:', result.success);
    console.log('Message:', result.message || 'No message provided');
    
    if (result.success) {
      console.log('\n✅ Test completed successfully!');
      console.log('Check your email inbox or spam folder for the test email.');
    } else {
      console.log('\n❌ Test failed to send email.');
      console.log('Please check the error message above for details.');
    }
    
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ An error occurred during the test:');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
runTest();