import React from "react";
import { useLocation } from "wouter";
import { useScrollToTop } from "@/hooks/use-scroll-top";

interface ScrollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * A custom Link component that scrolls to the top when clicked
 * This implementation avoids using wouter's Link to prevent nesting issues
 */
export function ScrollLink({ href, children, className, onClick }: ScrollLinkProps) {
  const scrollToTop = useScrollToTop();
  const [, navigate] = useLocation();
  
  const handleClick = (e: React.MouseEvent) => {
    // Prevent default browser navigation
    e.preventDefault();
    
    // Scroll to top for regular links (not anchor links)
    if (!href.startsWith('#')) {
      scrollToTop();
    }
    
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }
    
    // Navigate programmatically using wouter
    navigate(href);
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      className={`${className} cursor-pointer`} 
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      {children}
    </div>
  );
}