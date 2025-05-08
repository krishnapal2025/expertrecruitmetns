import { useEffect } from 'react';

// Import all hero images - full sizes for original quality
import aboutUsHero from "../assets/aerial-view-business-team.jpg";
import jobBoardHero from "../assets/job-board-hero.jpg";
import contactHero from "../assets/images/contact-hero-bg.jpg";
import hireTalentHero from "../assets/business-people-shaking-hands-meeting-room.jpg";
import servicesHero from "../assets/modern-equipped-computer-lab.jpg";

// Import optimized WebP versions for faster initial loading
import aboutUsHeroSmall from "../assets/optimized/aerial-view-business-team-sm.webp";
import aboutUsHeroMedium from "../assets/optimized/aerial-view-business-team-md.webp";
import jobBoardHeroSmall from "../assets/optimized/job-board-hero-sm.webp";
import jobBoardHeroMedium from "../assets/optimized/job-board-hero-md.webp";
import contactHeroSmall from "../assets/optimized/images/contact-hero-bg-sm.webp";
import contactHeroMedium from "../assets/optimized/images/contact-hero-bg-md.webp";
import hireTalentHeroSmall from "../assets/optimized/business-people-shaking-hands-meeting-room-sm.webp";
import hireTalentHeroMedium from "../assets/optimized/business-people-shaking-hands-meeting-room-md.webp";
import servicesHeroSmall from "../assets/optimized/modern-equipped-computer-lab-sm.webp";
import servicesHeroMedium from "../assets/optimized/modern-equipped-computer-lab-md.webp";

/**
 * A component that aggressively preloads all hero images to prevent gray backgrounds
 * when navigating between pages. This uses a combination of Image() objects and
 * link preload tags for maximum browser compatibility.
 */
export function PreloadHeroImages() {
  useEffect(() => {
    // Function to preload an image with logging
    const preloadImage = (src: string, name?: string) => {
      const img = new Image();
      const imageName = name || src.split('/').pop() || 'image';
      
      // Set up load and error handlers for debugging
      img.onload = () => console.log(`Preloaded image: ${imageName}`);
      img.onerror = () => console.error(`Failed to preload image: ${imageName}`);
      
      // Start loading the image
      img.src = src;
      return img;
    };

    // List of all hero images to preload
    const fullSizeImages = [
      { src: aboutUsHero, name: 'About Us Hero' },
      { src: jobBoardHero, name: 'Job Board Hero' },
      { src: contactHero, name: 'Contact Hero' },
      { src: hireTalentHero, name: 'Hire Talent Hero' },
      { src: servicesHero, name: 'Services Hero' }
    ];
    
    // List of optimized images to preload
    const optimizedImages = [
      // WebP small versions
      { src: aboutUsHeroSmall, name: 'About Us Hero (Small WebP)' },
      { src: jobBoardHeroSmall, name: 'Job Board Hero (Small WebP)' },
      { src: contactHeroSmall, name: 'Contact Hero (Small WebP)' },
      { src: hireTalentHeroSmall, name: 'Hire Talent Hero (Small WebP)' },
      { src: servicesHeroSmall, name: 'Services Hero (Small WebP)' },
      
      // WebP medium versions
      { src: aboutUsHeroMedium, name: 'About Us Hero (Medium WebP)' },
      { src: jobBoardHeroMedium, name: 'Job Board Hero (Medium WebP)' },
      { src: contactHeroMedium, name: 'Contact Hero (Medium WebP)' },
      { src: hireTalentHeroMedium, name: 'Hire Talent Hero (Medium WebP)' },
      { src: servicesHeroMedium, name: 'Services Hero (Medium WebP)' },
    ];

    // Preload all WebP optimized images first (they load faster)
    const optimizedImageElements = optimizedImages.map(img => 
      preloadImage(img.src, img.name)
    );
    
    // Then preload the full-size images
    const fullSizeImageElements = fullSizeImages.map(img => 
      preloadImage(img.src, img.name)
    );

    // Also add link preload tags for highest priority images
    const addPreloadLink = (href: string, imgType: string = 'image/webp', name?: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.type = imgType;
      link.href = href;
      link.setAttribute('fetchpriority', 'high');
      
      // Add data attribute for debugging
      if (name) {
        link.dataset.imageName = name;
      }
      
      document.head.appendChild(link);
      return link;
    };

    // Create preload links for the highest priority page backgrounds
    // (small WebP versions first, as they'll load the fastest)
    const preloadLinks = [
      // Small WebP versions (fastest loading)
      addPreloadLink(jobBoardHeroSmall, 'image/webp', 'Job Board Hero Small'),
      addPreloadLink(aboutUsHeroSmall, 'image/webp', 'About Us Hero Small'),
      addPreloadLink(contactHeroSmall, 'image/webp', 'Contact Hero Small'),
      addPreloadLink(hireTalentHeroSmall, 'image/webp', 'Hire Talent Hero Small'),
      addPreloadLink(servicesHeroSmall, 'image/webp', 'Services Hero Small'),
      
      // Medium WebP versions
      addPreloadLink(jobBoardHeroMedium, 'image/webp', 'Job Board Hero Medium'),
      addPreloadLink(aboutUsHeroMedium, 'image/webp', 'About Us Hero Medium'),
      addPreloadLink(contactHeroMedium, 'image/webp', 'Contact Hero Medium'),
      addPreloadLink(servicesHeroMedium, 'image/webp', 'Services Hero Medium'),
      addPreloadLink(hireTalentHeroMedium, 'image/webp', 'Hire Talent Hero Medium'),
      
      // Original versions (optional - sometimes unnecessary if WebP loads fast enough)
      addPreloadLink(jobBoardHero, 'image/jpeg', 'Job Board Hero Original'),
      addPreloadLink(aboutUsHero, 'image/jpeg', 'About Us Hero Original'),
      addPreloadLink(contactHero, 'image/jpeg', 'Contact Hero Original'),
      addPreloadLink(servicesHero, 'image/jpeg', 'Services Hero Original'),
      addPreloadLink(hireTalentHero, 'image/jpeg', 'Hire Talent Hero Original'),
    ];

    // Cleanup function to remove links on unmount
    return () => {
      preloadLinks.forEach(link => {
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