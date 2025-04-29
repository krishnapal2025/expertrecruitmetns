import React from "react";
import { Link } from "wouter";
import { useScrollToTop } from "@/hooks/use-scroll-top";

interface ScrollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * A custom Link component that scrolls to the top when clicked
 */
export function ScrollLink({ href, children, className, onClick }: ScrollLinkProps) {
  const scrollToTop = useScrollToTop();
  
  // Very simple implementation - just combine scrolling and onClick
  const handleNavigation = () => {
    // Scroll to top for regular links (not anchor links)
    if (!href.startsWith('#')) {
      scrollToTop();
    }
    
    // Call custom onClick if provided
    if (onClick) {
      onClick();
    }
  };

  return (
    <Link href={href}>
      <div className={className} onClick={handleNavigation}>
        {children}
      </div>
    </Link>
  );
}