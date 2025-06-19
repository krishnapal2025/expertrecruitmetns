/**
 * Comprehensive Sitemap Analysis Script
 * Analyzes all URLs in sitemap for SEO compliance and quality
 */

import https from 'https';
import http from 'http';

const baseUrl = process.argv[2] || 'http://localhost:5000';

// Extract URLs from sitemap
const sitemapUrls = [
  'https://expertrecruitments.com/',
  'https://expertrecruitments.com/about-us',
  'https://expertrecruitments.com/services',
  'https://expertrecruitments.com/sectors',
  'https://expertrecruitments.com/hire-talent',
  'https://expertrecruitments.com/contact-us',
  'https://expertrecruitments.com/job-board',
  'https://expertrecruitments.com/careers',
  'https://expertrecruitments.com/blogs',
  'https://expertrecruitments.com/job-seeker-register',
  'https://expertrecruitments.com/employer-register',
  'https://expertrecruitments.com/vacancy-form',
  'https://expertrecruitments.com/resources/create-resume',
  'https://expertrecruitments.com/resources/interview-prep',
  'https://expertrecruitments.com/resources/career-advice',
  'https://expertrecruitments.com/resources/salary-negotiation',
  'https://expertrecruitments.com/privacy-policy',
  'https://expertrecruitments.com/terms-conditions',
  'https://expertrecruitments.com/site-map'
];

async function testUrl(url) {
  const testUrl = url.replace('https://expertrecruitments.com', baseUrl);
  const protocol = testUrl.startsWith('https') ? https : http;
  
  return new Promise((resolve, reject) => {
    const req = protocol.get(testUrl, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          url: url,
          testUrl: testUrl,
          status: res.statusCode,
          headers: res.headers,
          body: data.substring(0, 5000) // First 5000 chars for analysis
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function extractCanonicalFromHtml(html) {
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  return canonicalMatch ? canonicalMatch[1] : null;
}

function extractTitleFromHtml(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : null;
}

function extractDescriptionFromHtml(html) {
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  return descMatch ? descMatch[1] : null;
}

function checkPageQuality(html, url) {
  const issues = [];
  
  // Check for error indicators
  if (html.includes('404') || html.includes('Page Not Found')) {
    issues.push('Potential 404 error page');
  }
  
  if (html.includes('Error') || html.includes('Something went wrong')) {
    issues.push('Contains error messages');
  }
  
  // Check content length
  const textContent = html.replace(/<[^>]*>/g, '').trim();
  if (textContent.length < 200) {
    issues.push('Thin content (less than 200 characters)');
  }
  
  // Check for React loading states
  if (html.includes('Loading...') || html.includes('Please wait')) {
    issues.push('Contains loading states (may be client-side rendered)');
  }
  
  // Check for missing key elements
  const title = extractTitleFromHtml(html);
  const description = extractDescriptionFromHtml(html);
  
  if (!title || title.length < 10) {
    issues.push('Missing or inadequate title tag');
  }
  
  if (!description || description.length < 50) {
    issues.push('Missing or inadequate meta description');
  }
  
  return issues;
}

function checkRobotsTxtConflict(url) {
  const path = new URL(url).pathname;
  
  // Check against robots.txt rules
  const disallowedPatterns = [
    '/admin',
    '/auth',
    '/post-job',
    '/profile',
    '/applications-manager'
  ];
  
  for (const pattern of disallowedPatterns) {
    if (path.startsWith(pattern)) {
      return `Blocked by robots.txt rule: Disallow: ${pattern}*`;
    }
  }
  
  return null;
}

async function analyzeSitemap() {
  console.log('🔍 Comprehensive Sitemap Analysis');
  console.log('Base URL:', baseUrl);
  console.log('=' + '='.repeat(80));
  
  const results = {
    total: sitemapUrls.length,
    passed: 0,
    failed: 0,
    issues: [],
    summary: {
      statusCodes: {},
      canonicalIssues: 0,
      robotsConflicts: 0,
      qualityIssues: 0,
      redirects: 0
    }
  };
  
  for (const url of sitemapUrls) {
    console.log(`\n📄 Testing: ${url}`);
    
    try {
      const response = await testUrl(url);
      const status = response.status;
      
      // Track status codes
      results.summary.statusCodes[status] = (results.summary.statusCodes[status] || 0) + 1;
      
      // Check status code
      if (status === 200) {
        console.log('✅ Status: 200 OK');
        results.passed++;
      } else if (status >= 300 && status < 400) {
        console.log(`⚠️  Status: ${status} (Redirect)`);
        results.summary.redirects++;
        results.issues.push(`${url}: Redirect (${status})`);
      } else {
        console.log(`❌ Status: ${status}`);
        results.failed++;
        results.issues.push(`${url}: HTTP ${status}`);
        continue;
      }
      
      // Check robots.txt conflicts
      const robotsConflict = checkRobotsTxtConflict(url);
      if (robotsConflict) {
        console.log(`❌ ${robotsConflict}`);
        results.summary.robotsConflicts++;
        results.issues.push(`${url}: ${robotsConflict}`);
      } else {
        console.log('✅ No robots.txt conflicts');
      }
      
      // Check canonical tags
      const htmlCanonical = extractCanonicalFromHtml(response.body);
      if (htmlCanonical) {
        if (htmlCanonical === url) {
          console.log('✅ Canonical tag: Correct');
        } else {
          console.log(`⚠️  Canonical tag: Points to ${htmlCanonical} instead of ${url}`);
          results.summary.canonicalIssues++;
          results.issues.push(`${url}: Canonical mismatch (${htmlCanonical})`);
        }
      } else {
        console.log('❌ Canonical tag: Missing');
        results.summary.canonicalIssues++;
        results.issues.push(`${url}: Missing canonical tag`);
      }
      
      // Check page quality
      const qualityIssues = checkPageQuality(response.body, url);
      if (qualityIssues.length > 0) {
        console.log(`⚠️  Quality issues: ${qualityIssues.join(', ')}`);
        results.summary.qualityIssues++;
        qualityIssues.forEach(issue => {
          results.issues.push(`${url}: ${issue}`);
        });
      } else {
        console.log('✅ Page quality: Good');
      }
      
      // Check server canonical header
      const serverCanonical = response.headers.link;
      if (serverCanonical && serverCanonical.includes('rel="canonical"')) {
        console.log('✅ Server canonical header: Present');
      } else {
        console.log('⚠️  Server canonical header: Missing');
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      results.failed++;
      results.issues.push(`${url}: ${error.message}`);
    }
  }
  
  // Generate summary report
  console.log('\n' + '='.repeat(80));
  console.log('📊 SITEMAP ANALYSIS SUMMARY');
  console.log('=' + '='.repeat(80));
  
  console.log(`\n📈 Overall Results:`);
  console.log(`   Total URLs: ${results.total}`);
  console.log(`   ✅ Passed: ${results.passed}`);
  console.log(`   ❌ Failed: ${results.failed}`);
  console.log(`   Success Rate: ${Math.round((results.passed / results.total) * 100)}%`);
  
  console.log(`\n🔢 Status Code Distribution:`);
  Object.entries(results.summary.statusCodes).forEach(([code, count]) => {
    const icon = code === '200' ? '✅' : code.startsWith('3') ? '⚠️ ' : '❌';
    console.log(`   ${icon} ${code}: ${count} URLs`);
  });
  
  console.log(`\n🚨 Issue Summary:`);
  console.log(`   Canonical Issues: ${results.summary.canonicalIssues}`);
  console.log(`   Robots.txt Conflicts: ${results.summary.robotsConflicts}`);
  console.log(`   Quality Issues: ${results.summary.qualityIssues}`);
  console.log(`   Redirects: ${results.summary.redirects}`);
  
  if (results.issues.length > 0) {
    console.log(`\n⚠️  Detailed Issues (${results.issues.length}):`);
    results.issues.forEach((issue, index) => {
      console.log(`   ${index + 1}. ${issue}`);
    });
  }
  
  console.log(`\n📋 Recommendations:`);
  
  if (results.summary.canonicalIssues > 0) {
    console.log('   • Fix canonical tag mismatches and missing canonical tags');
  }
  
  if (results.summary.robotsConflicts > 0) {
    console.log('   • Remove conflicting URLs from sitemap or update robots.txt');
  }
  
  if (results.summary.qualityIssues > 0) {
    console.log('   • Improve page content quality and meta tags');
  }
  
  if (results.summary.redirects > 0) {
    console.log('   • Update sitemap to use final destination URLs instead of redirects');
  }
  
  if (results.failed > 0) {
    console.log('   • Fix broken URLs returning error status codes');
  }
  
  const overallHealth = results.passed / results.total;
  if (overallHealth >= 0.9) {
    console.log('\n🎉 Sitemap Health: Excellent (90%+ URLs passing)');
  } else if (overallHealth >= 0.7) {
    console.log('\n👍 Sitemap Health: Good (70%+ URLs passing)');
  } else {
    console.log('\n⚠️  Sitemap Health: Needs Improvement (<70% URLs passing)');
  }
}

analyzeSitemap().catch(console.error);