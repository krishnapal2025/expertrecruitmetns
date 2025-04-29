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
 * A simple wrapper around normal navigation that scrolls to top as well
 */
export function ScrollLink({ href, children, className, onClick }: ScrollLinkProps) {
  const scrollToTop = useScrollToTop();
  const [, setLocation] = useLocation();
  
  // Create a safe navigation function that doesn't rely on event objects
  const safeNavigate = () => {
    try {
      // Regular navigation
      if (!href.startsWith('#')) {
        // Scroll first
        window.scrollTo(0, 0);
        
        // Then navigate
        setTimeout(() => {
          setLocation(href);
        }, 0);
      } else {
        // Handle anchor links normally
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };
  
  // Create a safe click handler that doesn't rely on event objects
  const handleSafeClick = () => {
    try {
      // Try to call the onclick handler if provided
      if (typeof onClick === 'function') {
        // Call it in a way that catches errors
        try {
          onClick();
        } catch (e) {
          console.error("onClick handler error:", e);
        }
      }
      
      // Then navigate safely
      safeNavigate();
    } catch (error) {
      console.error("Click handler error:", error);
    }
  };

  return (
    <div 
      className={`${className || ''} cursor-pointer`}
      onClick={handleSafeClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleSafeClick();
        }
      }}
    >
      {children}
    </div>
  );
}