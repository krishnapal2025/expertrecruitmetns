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
  
  const handleClick = (e: React.MouseEvent) => {
    // Only apply scroll behavior if it's not an anchor link on the same page
    if (!href.startsWith('#')) {
      scrollToTop();
    }
    
    if (onClick) onClick();
  };

  return (
    <Link href={href}>
      <span className={className} onClick={handleClick}>
        {children}
      </span>
    </Link>
  );
}