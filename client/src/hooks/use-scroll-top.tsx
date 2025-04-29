import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Hook to scroll to the top of the page on route changes
 */
export const useScrollTop = () => {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
};

/**
 * Hook that provides a function to scroll to the top of the page
 * Can be used with click handlers
 */
export const useScrollToTop = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return scrollToTop;
};