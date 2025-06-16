/**
 * SEO Header Testing Script
 * Tests canonical tags, meta tags, and server headers for Google Search Console compliance
 * 
 * Usage: node scripts/test-seo-headers.js [base-url]
 * Example: node scripts/test-seo-headers.js https://expertrecruitments.com
 */

import https from 'https';
import http from 'http';

const baseUrl = process.argv[2] || 'https://expertrecruitments.com';

// Test pages with their expected canonical URLs
const testPages = [
  { path: '/', canonical: 'https://expertrecruitments.com/' },
  { path: '/about-us', canonical: 'https://expertrecruitments.com/about-us' },
  { path: '/services', canonical: 'https://expertrecruitments.com/services' },
  { path: '/contact-us', canonical: 'https://expertrecruitments.com/contact-us' },
  { path: '/job-board', canonical: 'https://expertrecruitments.com/job-board' },
  { path: '/hire-talent', canonical: 'https://expertrecruitments.com/hire-talent' },
  { path: '/blogs', canonical: 'https://expertrecruitments.com/blogs' },
  { path: '/site-map', canonical: 'https://expertrecruitments.com/site-map' },
  { path: '/sitemap.xml', canonical: 'https://expertrecruitments.com/sitemap.xml' },
  { path: '/robots.txt', canonical: 'https://expertrecruitments.com/robots.txt' }
];

async function testUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const req = protocol.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data.substring(0, 2000) // First 2000 chars for meta tag checking
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

async function runSeoTests() {
  console.log('🔍 Testing SEO Headers and Canonical Tags');
  console.log('Base URL:', baseUrl);
  console.log('=' + '='.repeat(60));
  
  let passedTests = 0;
  let totalTests = 0;
  
  for (const testPage of testPages) {
    const fullUrl = baseUrl + testPage.path;
    console.log(`\n📄 Testing: ${testPage.path}`);
    
    try {
      const response = await testUrl(fullUrl);
      totalTests++;
      
      // Check HTTP status
      if (response.status === 200) {
        console.log('✅ HTTP Status: 200 OK');
      } else {
        console.log(`❌ HTTP Status: ${response.status}`);
        continue;
      }
      
      // Check server canonical header
      const serverCanonical = response.headers.link;
      if (serverCanonical && serverCanonical.includes('rel="canonical"')) {
        console.log('✅ Server Canonical Header: Present');
        const headerCanonical = serverCanonical.match(/<([^>]+)>; rel="canonical"/);
        if (headerCanonical && headerCanonical[1] === testPage.canonical) {
          console.log('✅ Server Canonical URL: Correct');
          passedTests++;
        } else {
          console.log(`❌ Server Canonical URL: Expected ${testPage.canonical}, got ${headerCanonical ? headerCanonical[1] : 'none'}`);
        }
      } else {
        console.log('⚠️  Server Canonical Header: Missing');
      }
      
      // Check HTML canonical tag (for HTML pages)
      if (testPage.path.endsWith('.xml') || testPage.path.endsWith('.txt')) {
        console.log('ℹ️  HTML checks skipped for non-HTML file');
        continue;
      }
      
      const htmlCanonical = extractCanonicalFromHtml(response.body);
      if (htmlCanonical) {
        if (htmlCanonical === testPage.canonical) {
          console.log('✅ HTML Canonical Tag: Correct');
          passedTests++;
        } else {
          console.log(`❌ HTML Canonical Tag: Expected ${testPage.canonical}, got ${htmlCanonical}`);
        }
      } else {
        console.log('❌ HTML Canonical Tag: Missing');
      }
      
      // Check for title tag
      const title = extractTitleFromHtml(response.body);
      if (title) {
        console.log(`✅ Title Tag: "${title}"`);
        passedTests++;
      } else {
        console.log('❌ Title Tag: Missing');
      }
      
      // Check for meta description
      const description = extractDescriptionFromHtml(response.body);
      if (description) {
        console.log(`✅ Meta Description: "${description.substring(0, 80)}${description.length > 80 ? '...' : ''}"`);
        passedTests++;
      } else {
        console.log('❌ Meta Description: Missing');
      }
      
      // Check for robots header
      const robotsHeader = response.headers['x-robots-tag'];
      if (robotsHeader && robotsHeader.includes('index, follow')) {
        console.log('✅ X-Robots-Tag: index, follow');
        passedTests++;
      } else {
        console.log('⚠️  X-Robots-Tag: Missing or incorrect');
      }
      
    } catch (error) {
      console.log(`❌ Error testing ${fullUrl}:`, error.message);
      totalTests++;
    }
  }
  
  console.log('\n' + '='.repeat(70));
  console.log(`📊 SEO Test Results: ${passedTests}/${totalTests * 4} checks passed`);
  
  if (passedTests >= totalTests * 3) {
    console.log('🎉 SEO implementation looks good! Most canonical tags are working correctly.');
  } else if (passedTests >= totalTests * 2) {
    console.log('⚠️  SEO implementation needs some improvements.');
  } else {
    console.log('❌ SEO implementation has significant issues that need attention.');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Submit updated sitemap to Google Search Console');
  console.log('2. Request re-indexing for pages with canonical tag conflicts');
  console.log('3. Monitor Search Console for canonical tag conflict resolution');
  console.log('4. Test www to non-www redirects via SiteGround');
}

// Special test for sitemap.xml validation
async function testSitemapXml() {
  console.log('\n🗺️  Testing Sitemap.xml Structure');
  
  try {
    const response = await testUrl(baseUrl + '/sitemap.xml');
    
    if (response.status === 200) {
      console.log('✅ Sitemap accessible');
      
      // Check content type
      if (response.headers['content-type'] && response.headers['content-type'].includes('xml')) {
        console.log('✅ Correct XML content type');
      } else {
        console.log('❌ Incorrect content type:', response.headers['content-type']);
      }
      
      // Basic XML validation
      if (response.body.includes('<?xml') && response.body.includes('<urlset')) {
        console.log('✅ Valid XML structure');
      } else {
        console.log('❌ Invalid XML structure');
      }
      
      // Count URLs
      const urlCount = (response.body.match(/<url>/g) || []).length;
      console.log(`📊 Sitemap contains ${urlCount} URLs`);
      
    } else {
      console.log('❌ Sitemap not accessible:', response.status);
    }
  } catch (error) {
    console.log('❌ Error testing sitemap:', error.message);
  }
}

// Run all tests
async function main() {
  await runSeoTests();
  await testSitemapXml();
  
  console.log('\n🔗 Useful Links:');
  console.log('- Google Search Console: https://search.google.com/search-console');
  console.log('- Sitemap URL: ' + baseUrl + '/sitemap.xml');
  console.log('- Robots.txt URL: ' + baseUrl + '/robots.txt');
}

main().catch(console.error);