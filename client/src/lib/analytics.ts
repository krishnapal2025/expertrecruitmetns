import ReactGA from 'react-ga4';

// Demo measurement ID (replace with actual ID in production)
const MEASUREMENT_ID = 'G-DEMO123456';

/**
 * Initialize Google Analytics
 */
export function initializeAnalytics() {
  // Use environment variable if available, otherwise use demo ID
  const analyticsId = import.meta.env.GOOGLE_ANALYTICS_ID || MEASUREMENT_ID;
  
  ReactGA.initialize(analyticsId);
}

/**
 * Track page views
 * @param path Path of the page
 * @param title Title of the page
 */
export function trackPageView(path: string, title?: string) {
  ReactGA.send({ 
    hitType: "pageview", 
    page: path,
    title: title
  });
}

/**
 * Track user events
 * @param category Event category
 * @param action Action performed
 * @param label Optional label
 */
export function trackEvent(category: string, action: string, label?: string) {
  ReactGA.event({
    category,
    action,
    label
  });
}

/**
 * Track user conversion (e.g., job application submitted)
 * @param action Conversion action
 * @param category Category
 */
export function trackConversion(action: string, category: string = 'Conversion') {
  ReactGA.event({
    category,
    action,
    nonInteraction: false
  });
}