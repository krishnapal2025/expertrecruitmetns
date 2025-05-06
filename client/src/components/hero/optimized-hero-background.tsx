import React, { useState, useEffect } from 'react';

interface OptimizedHeroBackgroundProps {
  imageSrc: string;
  alt?: string;
  brightness?: number;
  overlayOpacity?: number;
}

/**
 * A component for optimizing background image loading in hero sections
 * - Uses progressive loading with low-quality placeholder 
 * - Includes preloading for faster image display
 * - Incorporates blur-up technique for smooth transitions
 */
export const OptimizedHeroBackground: React.FC<OptimizedHeroBackgroundProps> = ({
  imageSrc,
  alt = "Background image",
  brightness = 0.85,
  overlayOpacity = 0.65,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Generate a tiny blurred placeholder (20px wide)
  // This would normally be generated server-side, but we'll use a CSS approximation
  const blurPlaceholder = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27 width%3D%2720%27 height%3D%2720%27 viewBox%3D%270 0 20 20%27%3E%3Crect width%3D%2720%27 height%3D%2720%27 fill%3D%27%23f1f1f1%27%2F%3E%3C%2Fsvg%3E';
  
  // Preload the image
  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageLoaded(true);
    };
    
    // Add link preload hint for the browser
    const linkPreload = document.createElement('link');
    linkPreload.rel = 'preload';
    linkPreload.as = 'image';
    linkPreload.href = imageSrc;
    document.head.appendChild(linkPreload);
    
    return () => {
      // Clean up the preload hint when component unmounts
      document.head.removeChild(linkPreload);
    };
  }, [imageSrc]);
  
  return (
    <>
      {/* Black overlay */}
      <div 
        className="absolute inset-0 z-10"
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
      ></div>
      
      {/* Background image with blur-up effect */}
      <div 
        className={`absolute inset-0 bg-center bg-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ 
          backgroundImage: `url(${imageSrc})`,
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
      
      {/* Placeholder that shows until image loads */}
      <div 
        className={`absolute inset-0 bg-center bg-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          backgroundImage: `url(${blurPlaceholder})`,
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          filter: 'blur(8px)',
        }}
      ></div>
    </>
  );
};

export default OptimizedHeroBackground;