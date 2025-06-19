/**
 * Core Web Vitals Analysis Script
 * Analyzes website performance metrics for Google Core Web Vitals
 */

import { performance } from 'perf_hooks';
import https from 'https';
import http from 'http';

const baseUrl = process.argv[2] || 'http://localhost:5000';

// Key pages to test for Core Web Vitals
const testPages = [
  { path: '/', name: 'Homepage' },
  { path: '/about-us', name: 'About Us' },
  { path: '/services', name: 'Services' },
  { path: '/job-board', name: 'Job Board' },
  { path: '/contact-us', name: 'Contact Us' },
  { path: '/hire-talent', name: 'Hire Talent' }
];

async function measurePageLoad(url) {
  const startTime = performance.now();
  const protocol = url.startsWith('https') ? https : http;
  
  return new Promise((resolve, reject) => {
    const req = protocol.get(url, (res) => {
      let data = '';
      let firstByteTime = null;
      
      res.on('data', chunk => {
        if (!firstByteTime) {
          firstByteTime = performance.now() - startTime;
        }
        data += chunk;
      });
      
      res.on('end', () => {
        const totalTime = performance.now() - startTime;
        
        resolve({
          url: url,
          status: res.statusCode,
          ttfb: firstByteTime, // Time to First Byte
          loadTime: totalTime,
          contentSize: Buffer.byteLength(data, 'utf8'),
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function analyzePageContent(html, url) {
  const issues = [];
  const recommendations = [];
  
  // Check for large images without optimization
  const imageMatches = html.match(/<img[^>]*src=["']([^"']+)["'][^>]*>/gi) || [];
  let unoptimizedImages = 0;
  
  imageMatches.forEach(imgTag => {
    if (!imgTag.includes('webp') && !imgTag.includes('avif')) {
      unoptimizedImages++;
    }
    if (!imgTag.includes('loading="lazy"') && !imgTag.includes('loading="eager"')) {
      issues.push('Images missing loading attributes');
    }
  });
  
  if (unoptimizedImages > 0) {
    issues.push(`${unoptimizedImages} images not using modern formats (WebP/AVIF)`);
    recommendations.push('Convert images to WebP or AVIF format');
  }
  
  // Check for blocking resources
  const scriptTags = html.match(/<script[^>]*>/gi) || [];
  let blockingScripts = 0;
  
  scriptTags.forEach(script => {
    if (!script.includes('async') && !script.includes('defer') && script.includes('src=')) {
      blockingScripts++;
    }
  });
  
  if (blockingScripts > 0) {
    issues.push(`${blockingScripts} blocking JavaScript resources`);
    recommendations.push('Add async/defer attributes to non-critical scripts');
  }
  
  // Check for CSS optimization
  const styleTags = html.match(/<link[^>]*rel=["']stylesheet["'][^>]*>/gi) || [];
  if (styleTags.length > 5) {
    issues.push(`${styleTags.length} CSS files (consider bundling)`);
    recommendations.push('Bundle CSS files to reduce HTTP requests');
  }
  
  // Check for font loading optimization
  const fontLinks = html.match(/<link[^>]*href=["'][^"']*font[^"']*["'][^>]*>/gi) || [];
  let unoptimizedFonts = 0;
  
  fontLinks.forEach(font => {
    if (!font.includes('font-display')) {
      unoptimizedFonts++;
    }
  });
  
  if (unoptimizedFonts > 0) {
    issues.push(`${unoptimizedFonts} fonts without font-display optimization`);
    recommendations.push('Add font-display: swap to font declarations');
  }
  
  // Check for preload hints
  const preloadLinks = html.match(/<link[^>]*rel=["']preload["'][^>]*>/gi) || [];
  if (preloadLinks.length === 0) {
    recommendations.push('Consider preloading critical resources');
  }
  
  // Check content size
  const contentSize = Buffer.byteLength(html, 'utf8');
  if (contentSize > 500000) { // 500KB
    issues.push(`Large HTML size: ${Math.round(contentSize / 1024)}KB`);
    recommendations.push('Optimize HTML size and consider code splitting');
  }
  
  return { issues, recommendations };
}

function assessCoreWebVitals(metrics) {
  const assessment = {
    lcp: 'unknown', // Largest Contentful Paint
    fid: 'unknown', // First Input Delay  
    cls: 'unknown', // Cumulative Layout Shift
    ttfb: 'unknown', // Time to First Byte
    overall: 'unknown'
  };
  
  // TTFB Assessment (Time to First Byte)
  if (metrics.ttfb < 200) {
    assessment.ttfb = 'good';
  } else if (metrics.ttfb < 500) {
    assessment.ttfb = 'needs-improvement';
  } else {
    assessment.ttfb = 'poor';
  }
  
  // Load Time as proxy for LCP
  if (metrics.loadTime < 1000) {
    assessment.lcp = 'good';
  } else if (metrics.loadTime < 2500) {
    assessment.lcp = 'needs-improvement';
  } else {
    assessment.lcp = 'poor';
  }
  
  // Overall assessment
  const scores = [assessment.ttfb, assessment.lcp];
  const goodCount = scores.filter(s => s === 'good').length;
  const poorCount = scores.filter(s => s === 'poor').length;
  
  if (poorCount === 0 && goodCount >= 1) {
    assessment.overall = 'good';
  } else if (poorCount <= 1) {
    assessment.overall = 'needs-improvement';
  } else {
    assessment.overall = 'poor';
  }
  
  return assessment;
}

async function analyzeCoreWebVitals() {
  console.log('⚡ Core Web Vitals Analysis');
  console.log('Base URL:', baseUrl);
  console.log('=' + '='.repeat(70));
  
  const results = {
    pages: [],
    summary: {
      avgTtfb: 0,
      avgLoadTime: 0,
      totalIssues: 0,
      recommendations: new Set()
    }
  };
  
  for (const page of testPages) {
    const fullUrl = baseUrl + page.path;
    console.log(`\n📄 Testing: ${page.name} (${page.path})`);
    
    try {
      // Measure multiple attempts for accuracy
      const attempts = 3;
      let metrics = { ttfb: 0, loadTime: 0, contentSize: 0 };
      let response = null;
      
      for (let i = 0; i < attempts; i++) {
        const attempt = await measurePageLoad(fullUrl);
        metrics.ttfb += attempt.ttfb;
        metrics.loadTime += attempt.loadTime;
        metrics.contentSize += attempt.contentSize;
        
        if (i === 0) response = attempt; // Use first response for content analysis
      }
      
      // Average the metrics
      metrics.ttfb = Math.round(metrics.ttfb / attempts);
      metrics.loadTime = Math.round(metrics.loadTime / attempts);
      metrics.contentSize = Math.round(metrics.contentSize / attempts);
      
      console.log(`⏱️  TTFB: ${metrics.ttfb}ms`);
      console.log(`📊 Load Time: ${metrics.loadTime}ms`);
      console.log(`📦 Content Size: ${Math.round(metrics.contentSize / 1024)}KB`);
      
      // Analyze content for optimization opportunities
      const contentAnalysis = analyzePageContent(response.body, fullUrl);
      
      // Assess Core Web Vitals
      const vitalsAssessment = assessCoreWebVitals(metrics);
      
      console.log(`🎯 TTFB Assessment: ${vitalsAssessment.ttfb.toUpperCase()}`);
      console.log(`🎯 Load Time Assessment: ${vitalsAssessment.lcp.toUpperCase()}`);
      
      if (contentAnalysis.issues.length > 0) {
        console.log(`⚠️  Issues: ${contentAnalysis.issues.join(', ')}`);
      }
      
      // Store results
      results.pages.push({
        name: page.name,
        path: page.path,
        metrics,
        vitalsAssessment,
        issues: contentAnalysis.issues,
        recommendations: contentAnalysis.recommendations
      });
      
      results.summary.avgTtfb += metrics.ttfb;
      results.summary.avgLoadTime += metrics.loadTime;
      results.summary.totalIssues += contentAnalysis.issues.length;
      
      contentAnalysis.recommendations.forEach(rec => {
        results.summary.recommendations.add(rec);
      });
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  // Calculate averages
  results.summary.avgTtfb = Math.round(results.summary.avgTtfb / results.pages.length);
  results.summary.avgLoadTime = Math.round(results.summary.avgLoadTime / results.pages.length);
  
  // Generate summary report
  console.log('\n' + '='.repeat(70));
  console.log('📊 CORE WEB VITALS SUMMARY');
  console.log('=' + '='.repeat(70));
  
  console.log(`\n⚡ Performance Overview:`);
  console.log(`   Average TTFB: ${results.summary.avgTtfb}ms`);
  console.log(`   Average Load Time: ${results.summary.avgLoadTime}ms`);
  console.log(`   Total Issues Found: ${results.summary.totalIssues}`);
  
  console.log(`\n🎯 Core Web Vitals Assessment:`);
  
  // TTFB Ranges
  if (results.summary.avgTtfb < 200) {
    console.log(`   ✅ Time to First Byte: GOOD (${results.summary.avgTtfb}ms < 200ms)`);
  } else if (results.summary.avgTtfb < 500) {
    console.log(`   ⚠️  Time to First Byte: NEEDS IMPROVEMENT (${results.summary.avgTtfb}ms)`);
  } else {
    console.log(`   ❌ Time to First Byte: POOR (${results.summary.avgTtfb}ms > 500ms)`);
  }
  
  // Load Time as LCP proxy
  if (results.summary.avgLoadTime < 1000) {
    console.log(`   ✅ Page Load Time: GOOD (${results.summary.avgLoadTime}ms < 1000ms)`);
  } else if (results.summary.avgLoadTime < 2500) {
    console.log(`   ⚠️  Page Load Time: NEEDS IMPROVEMENT (${results.summary.avgLoadTime}ms)`);
  } else {
    console.log(`   ❌ Page Load Time: POOR (${results.summary.avgLoadTime}ms > 2500ms)`);
  }
  
  console.log(`\n🔧 Priority Recommendations:`);
  const recommendations = Array.from(results.summary.recommendations);
  if (recommendations.length > 0) {
    recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
  } else {
    console.log('   🎉 No major optimization recommendations found!');
  }
  
  console.log(`\n📋 Detailed Page Performance:`);
  results.pages.forEach((page, index) => {
    console.log(`   ${index + 1}. ${page.name}:`);
    console.log(`      TTFB: ${page.metrics.ttfb}ms (${page.vitalsAssessment.ttfb})`);
    console.log(`      Load: ${page.metrics.loadTime}ms (${page.vitalsAssessment.lcp})`);
    console.log(`      Size: ${Math.round(page.metrics.contentSize / 1024)}KB`);
    if (page.issues.length > 0) {
      console.log(`      Issues: ${page.issues.length}`);
    }
  });
  
  console.log(`\n🚀 Next Steps:`);
  console.log('   1. Test in production with real Core Web Vitals tools');
  console.log('   2. Use Google PageSpeed Insights for comprehensive analysis');
  console.log('   3. Monitor field data in Google Search Console');
  console.log('   4. Consider implementing the priority recommendations above');
  
  // Overall health assessment
  const avgScore = (results.summary.avgTtfb < 200 ? 1 : 0) + (results.summary.avgLoadTime < 1000 ? 1 : 0);
  
  if (avgScore === 2) {
    console.log('\n🏆 Overall Assessment: EXCELLENT Core Web Vitals');
  } else if (avgScore === 1) {
    console.log('\n👍 Overall Assessment: GOOD Core Web Vitals (room for improvement)');
  } else {
    console.log('\n⚠️  Overall Assessment: NEEDS OPTIMIZATION for Core Web Vitals');
  }
}

analyzeCoreWebVitals().catch(console.error);