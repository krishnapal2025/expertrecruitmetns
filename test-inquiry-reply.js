// Test script to verify business inquiry replies are sent properly
import fetch from 'node-fetch';

async function testInquiryReply() {
  try {
    console.log('Testing business inquiry reply functionality...');
    
    // Variables for testing
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'adminpassword';
    const INQUIRY_ID = 4; // Use a valid business inquiry ID for testing
    
    // 1. Login as admin
    console.log('Logging in as admin...');
    const loginResponse = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: ADMIN_USERNAME, password: ADMIN_PASSWORD }),
      credentials: 'include'
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Admin login failed: ${loginResponse.statusText}`);
    }
    
    const loginData = await loginResponse.json();
    console.log(`Admin login successful: ${loginData.username} (${loginData.userType})`);
    
    // Get cookies from the login response
    const cookies = loginResponse.headers.get('set-cookie');
    
    // 2. Send reply to the business inquiry
    console.log(`Sending reply to business inquiry #${INQUIRY_ID}...`);
    const replyResponse = await fetch(`http://localhost:5000/api/staffing-inquiries/${INQUIRY_ID}/reply`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': cookies
      },
      body: JSON.stringify({
        subject: 'TEST: Response to your business inquiry',
        message: 'This is a test message to verify that business inquiry replies are sent to employer email addresses. Please confirm receipt.'
      }),
      credentials: 'include'
    });
    
    if (!replyResponse.ok) {
      throw new Error(`Inquiry reply failed: ${replyResponse.statusText}`);
    }
    
    const replyData = await replyResponse.json();
    console.log('Reply sent successfully!');
    
    // 3. Check if we got a preview URL (Ethereal Mail test account)
    if (replyData.previewUrl) {
      console.log('Email preview available at:', replyData.previewUrl);
      console.log('Please open this URL in your browser to confirm the email was composed correctly');
    }
    
    // 4. Verify the inquiry status was updated to 'contacted'
    console.log(`Checking inquiry #${INQUIRY_ID} status...`);
    const inquiryResponse = await fetch(`http://localhost:5000/api/staffing-inquiries/${INQUIRY_ID}`, {
      headers: { 'Cookie': cookies },
      credentials: 'include'
    });
    
    if (!inquiryResponse.ok) {
      throw new Error(`Failed to fetch inquiry: ${inquiryResponse.statusText}`);
    }
    
    const inquiryData = await inquiryResponse.json();
    console.log(`Inquiry status is now: ${inquiryData.status}`);
    
    // 5. Summary
    console.log('\nTest Summary:');
    console.log('- Admin login: SUCCESS');
    console.log('- Send reply: SUCCESS');
    console.log(`- Created notification: ${replyData.notificationCreated ? 'YES' : 'NO'}`);
    console.log(`- Email preview: ${replyData.previewUrl ? 'Available' : 'Not available'}`);
    console.log(`- Inquiry status updated to '${inquiryData.status}'`);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testInquiryReply();