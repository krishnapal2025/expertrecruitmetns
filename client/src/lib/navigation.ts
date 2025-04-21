/**
 * Navigation utility functions
 */

/**
 * Navigate to a new URL and scroll to the top of the page
 * @param navigate The navigate function from wouter's useLocation
 * @param url The URL to navigate to
 */
export function navigateAndScrollTop(navigate: (to: string) => void, url: string) {
  // First navigate to the new URL
  navigate(url);
  
  // Then scroll to the top of the page
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}