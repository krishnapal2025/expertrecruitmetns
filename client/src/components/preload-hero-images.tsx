import { useEffect } from 'react';

// Import all hero images
import aboutUsHero from "../assets/aerial-view-business-team.jpg";
import jobBoardHero from "../assets/job-board-hero.jpg";
import contactHero from "../assets/images/contact-hero-bg.jpg";
import hireTalentHero from "../assets/city-financial-district-glows-blue-twilight-generated-by-ai.jpg";
import servicesHero from "../assets/business-people-shaking-hands-meeting-room.jpg";

/**
 * A component that preloads all hero images to prevent gray backgrounds
 * when navigating between pages.
 */
export function PreloadHeroImages() {
  useEffect(() => {
    // Function to preload an image
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    // List of all hero images to preload
    const heroImages = [
      aboutUsHero,
      jobBoardHero,
      contactHero,
      hireTalentHero,
      servicesHero
    ];

    // Preload all hero images
    heroImages.forEach(imageSrc => {
      preloadImage(imageSrc);
    });

    // Also add link preload tags for highest priority images
    const addPreloadLink = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = href;
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);
      
      return link;
    };

    // Create preload links (limit to a few of the most important pages)
    const links = [
      aboutUsHero,
      jobBoardHero,
      contactHero
    ].map(imageSrc => addPreloadLink(imageSrc));

    // Cleanup function to remove links on unmount
    return () => {
      links.forEach(link => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      });
    };
  }, []);

  // This component doesn't render anything
  return null;
}

export default PreloadHeroImages;