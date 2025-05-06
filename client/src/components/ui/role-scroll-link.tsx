import React from "react";
import { useLocation } from "wouter";
import { useScrollToTop } from "@/hooks/use-scroll-top";
import { useRoleRedirect } from "@/hooks/use-role-redirect";
import { useAuth } from "@/hooks/use-auth";

interface RoleScrollLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  requiredUserType?: 'employer' | 'jobseeker';
  redirectPath?: string;
  onClick?: () => void;
}

/**
 * Enhanced ScrollLink component that handles role-specific redirections
 * - If requiredUserType is specified, it will redirect users based on their role
 * - If requiredUserType is not specified, it behaves like a regular ScrollLink
 */
export function RoleScrollLink({ 
  href, 
  children, 
  className, 
  requiredUserType, 
  redirectPath, 
  onClick 
}: RoleScrollLinkProps) {
  const scrollToTop = useScrollToTop();
  const [, setLocation] = useLocation();
  const { currentUser } = useAuth();
  const { createRoleSpecificURLHandler } = useRoleRedirect();
  
  // If no required user type is specified, treat it as a regular link
  if (!requiredUserType) {
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
  
  // For role-specific links, use our role redirect handler
  const roleHandler = createRoleSpecificURLHandler(
    requiredUserType,
    href,
    redirectPath
  );
  
  return (
    <div 
      className={`${className || ''} cursor-pointer`}
      onClick={roleHandler}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          roleHandler(e as unknown as React.MouseEvent<HTMLElement>);
        }
      }}
    >
      {children}
    </div>
  );
}