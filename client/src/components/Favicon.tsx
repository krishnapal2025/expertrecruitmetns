import { useEffect } from 'react';
import faviconPath from '../assets/favicon.png';

// This component dynamically sets the favicon
const Favicon = () => {
  useEffect(() => {
    const updateFavicon = () => {
      // Remove any existing favicons
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      existingFavicons.forEach(favicon => {
        document.head.removeChild(favicon);
      });

      // Create new favicon link
      const link = document.createElement('link');
      link.id = 'dynamic-favicon';
      link.rel = 'shortcut icon';
      link.href = faviconPath;
      document.head.appendChild(link);
    };

    // Update favicon when component mounts
    updateFavicon();
  }, []);

  return null; // This component doesn't render anything
};

export default Favicon;