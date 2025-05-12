/**
 * Mailgun Domain Diagnostic Script
 * 
 * This script checks the status of your Mailgun domain configuration
 * to help diagnose email delivery issues.
 * 
 * Usage: node scripts/mailgun-domain-check.cjs
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

// Initialize Mailgun client
console.log('\n==== MAILGUN DOMAIN DIAGNOSTICS ====');
console.log(`API Key: ${process.env.MAILGUN_API_KEY.substring(0, 5)}...`);
console.log(`Domain: ${process.env.MAILGUN_DOMAIN}`);

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

async function checkDomainStatus() {
  try {
    console.log('\nChecking domain status...');
    
    // Get domain information
    const domain = await new Promise((resolve, reject) => {
      mg.get(`/domains/${process.env.MAILGUN_DOMAIN}`, (err, body) => {
        if (err) reject(err);
        else resolve(body);
      });
    });
    
    console.log('\n=== DOMAIN INFORMATION ===');
    console.log(`Name: ${domain.domain.name}`);
    console.log(`Created At: ${domain.domain.created_at}`);
    console.log(`State: ${domain.domain.state}`);
    console.log(`SMTP Login: ${domain.domain.smtp_login}`);
    console.log(`Is Sandbox: ${domain.domain.name.includes('sandbox') ? 'YES' : 'NO'}`);
    
    // Check receiving records
    console.log('\n=== RECEIVING DNS RECORDS ===');
    domain.receiving_dns_records.forEach(record => {
      console.log(`- Type: ${record.record_type}`);
      console.log(`  Priority: ${record.priority}`);
      console.log(`  Value: ${record.value}`);
      console.log(`  Valid: ${record.valid === 'valid' ? 'YES' : 'NO'}`);
      console.log('');
    });
    
    // Check sending records
    console.log('=== SENDING DNS RECORDS ===');
    domain.sending_dns_records.forEach(record => {
      console.log(`- Type: ${record.record_type}`);
      console.log(`  Name: ${record.name}`);
      console.log(`  Value: ${record.value}`);
      console.log(`  Valid: ${record.valid === 'valid' ? 'YES' : 'NO'}`);
      console.log('');
    });
    
    // Check domain verification status overall
    const receivingValid = domain.receiving_dns_records.every(r => r.valid === 'valid');
    const sendingValid = domain.sending_dns_records.every(r => r.valid === 'valid');
    const isVerified = domain.domain.state === 'active';
    
    console.log('\n=== VERIFICATION STATUS ===');
    console.log(`Domain State: ${domain.domain.state}`);
    console.log(`All Receiving DNS Records Valid: ${receivingValid ? 'YES' : 'NO'}`);
    console.log(`All Sending DNS Records Valid: ${sendingValid ? 'YES' : 'NO'}`);
    console.log(`Domain Fully Verified: ${isVerified ? 'YES' : 'NO'}`);
    
    // Check if sandbox
    const isSandbox = domain.domain.name.includes('sandbox');
    if (isSandbox) {
      console.log('\n⚠️ SANDBOX DOMAIN DETECTED');
      console.log('Sandbox domains have the following limitations:');
      console.log('1. You can only send to authorized recipient emails');
      console.log('2. You must add recipient emails to your authorized list in Mailgun dashboard');
      console.log('3. Daily sending limits are heavily restricted');
      
      // Attempt to get authorized recipients for sandbox
      try {
        const authorizedRecipients = await new Promise((resolve, reject) => {
          mg.get(`/domains/${process.env.MAILGUN_DOMAIN}/authorized`, (err, body) => {
            if (err) reject(err);
            else resolve(body);
          });
        });
        
        console.log('\n=== AUTHORIZED RECIPIENTS ===');
        if (authorizedRecipients.items && authorizedRecipients.items.length > 0) {
          authorizedRecipients.items.forEach(recipient => {
            console.log(`- ${recipient.address} (${recipient.status})`);
          });
        } else {
          console.log('No authorized recipients found.');
          console.log('You must add recipients in your Mailgun dashboard before sending.');
        }
      } catch (err) {
        console.error('Unable to retrieve authorized recipients:', err.message);
      }
    }
    
    // Final diagnosis
    console.log('\n=== DIAGNOSIS ===');
    if (isSandbox) {
      console.log('PRIMARY ISSUE: Using a sandbox domain');
      console.log('RESOLUTION: Either:');
      console.log('1. Add your recipient emails to the authorized list in Mailgun dashboard, or');
      console.log('2. Purchase and verify a custom domain for production use');
    } else if (!isVerified) {
      console.log('PRIMARY ISSUE: Domain is not fully verified');
      console.log('RESOLUTION: Check your DNS records and fix any that are not valid');
    } else if (!receivingValid || !sendingValid) {
      console.log('PRIMARY ISSUE: Some DNS records are invalid');
      console.log('RESOLUTION: Update your DNS records according to Mailgun\'s instructions');
    } else {
      console.log('Your Mailgun domain appears to be properly configured.');
      console.log('Possible issues:');
      console.log('1. Emails are being marked as spam - check recipient spam folders');
      console.log('2. You have sending limits/restrictions on your account');
      console.log('3. Your sending reputation needs improvement');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR CHECKING DOMAIN:');
    console.error('- Status Code:', error.statusCode);
    console.error('- Error Message:', error.message);
    
    if (error.statusCode === 401) {
      console.error('\n🔑 AUTHENTICATION ERROR: The API key provided may be invalid or not authorized.');
    } else if (error.statusCode === 404) {
      console.error('\n⚠️ DOMAIN NOT FOUND: The domain you specified does not exist in your Mailgun account.');
    }
  }
}

// Run diagnostics
checkDomainStatus().catch(err => {
  console.error('\nUnexpected error during diagnosis:', err);
});