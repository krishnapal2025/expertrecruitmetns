import React, { useState, useEffect, useRef } from 'react';

interface OptimizedHeroBackgroundProps {
  imageSrc: string;
  alt?: string;
  brightness?: number;
  overlayOpacity?: number;
  smallImageSrc?: string; // Optional small version of the image for mobile
  mediumImageSrc?: string; // Optional medium version for tablets
  priority?: boolean; // Whether this is a high-priority image
}

/**
 * A component for optimizing background image loading in hero sections
 * - Uses progressive loading with dominant color and blur-up technique
 * - Implements responsive image loading based on screen size
 * - Includes preloading with prioritization for critical images
 * - Incorporates lazy loading for below-the-fold content
 */
export const OptimizedHeroBackground: React.FC<OptimizedHeroBackgroundProps> = ({
  imageSrc,
  alt = "Background image",
  brightness = 0.85,
  overlayOpacity = 0.65,
  smallImageSrc,
  mediumImageSrc,
  priority = true, // Default to high priority for hero images
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate a dominant color placeholder based on the image
  // Using a light neutral gray as a default
  const dominantColor = '#f5f5f5';
  
  // Create a more sophisticated placeholder with color
  const colorPlaceholder = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Crect width='1' height='1' fill='${dominantColor.replace('#', '%23')}'/%3E%3C/svg%3E`;
  
  // Determine which image to load based on screen size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 640 && smallImageSrc) {
        setCurrentSrc(smallImageSrc);
      } else if (width <= 1024 && mediumImageSrc) {
        setCurrentSrc(mediumImageSrc);
      } else {
        setCurrentSrc(imageSrc);
      }
    };
    
    // Initial size determination
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [imageSrc, smallImageSrc, mediumImageSrc]);
  
  // Implement lazy loading with IntersectionObserver and immediate loading for priority images
  useEffect(() => {
    if (!currentSrc) return;
    
    // If this is a priority image, load it immediately
    if (priority) {
      const img = new Image();
      img.src = currentSrc;
      img.onload = () => {
        setImageLoaded(true);
      };
      
      // Add link preload hint for the browser
      const linkPreload = document.createElement('link');
      linkPreload.rel = 'preload';
      linkPreload.as = 'image';
      linkPreload.href = currentSrc;
      // Set as high priority using setAttribute (importance is not in the standard type)
      linkPreload.setAttribute('importance', 'high');
      document.head.appendChild(linkPreload);
      
      return () => {
        if (document.head.contains(linkPreload)) {
          document.head.removeChild(linkPreload);
        }
      };
    } 
    // Otherwise use IntersectionObserver for lazy loading
    else if (containerRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = new Image();
              img.src = currentSrc;
              img.onload = () => {
                setImageLoaded(true);
              };
              observer.disconnect();
            }
          });
        },
        { rootMargin: '200px' } // Start loading when within 200px of viewport
      );
      
      observer.observe(containerRef.current);
      
      return () => {
        observer.disconnect();
      };
    }
  }, [currentSrc, priority]);
  
  // Preload adjacent pages' hero images when hovering navigation
  useEffect(() => {
    const preloadAdjacentImages = () => {
      const navLinks = document.querySelectorAll('nav a');
      
      navLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
          // Extract path from href
          const href = link.getAttribute('href');
          if (href && href.startsWith('/')) {
            // Create a hidden link preload for common hero images
            // This is a simplified approach - in a real app, you'd map routes to images
            switch(href) {
              case '/about-us':
              case '/contact-us':
              case '/hire-talent':
              case '/job-board':
                const adjacentImageSrc = `../assets${href}-hero.jpg`;
                const hiddenPreload = document.createElement('link');
                hiddenPreload.rel = 'prefetch';
                hiddenPreload.as = 'image';
                hiddenPreload.href = adjacentImageSrc;
                hiddenPreload.setAttribute('importance', 'low');
                document.head.appendChild(hiddenPreload);
                
                // Clean up after a delay
                setTimeout(() => {
                  if (document.head.contains(hiddenPreload)) {
                    document.head.removeChild(hiddenPreload);
                  }
                }, 5000);
                break;
            }
          }
        });
      });
    };
    
    // Only run this optimization in production mode
    if (process.env.NODE_ENV === 'production') {
      preloadAdjacentImages();
    }
  }, []);
  
  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Black overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
      ></div>
      
      {/* Background image with blur-up effect */}
      <div 
        className={`absolute inset-0 bg-center bg-cover will-change-opacity transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          backgroundImage: `url(${currentSrc || imageSrc})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          height: '100%',
          width: '100%',
          filter: `brightness(${brightness})`,
        }}
        aria-label={alt}
        role="img"
      ></div>
      
      {/* Placeholder with dominant color and blur effect */}
      <div 
        className={`absolute inset-0 bg-center bg-cover will-change-opacity transition-opacity duration-700 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          backgroundImage: `url(${colorPlaceholder})`,
          backgroundColor: dominantColor,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          filter: 'blur(8px)',
        }}
      ></div>
    </div>
  );
};

export default OptimizedHeroBackground;