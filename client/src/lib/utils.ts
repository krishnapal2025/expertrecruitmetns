import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Scrolls to the top of the page smoothly
 */
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

/**
 * Custom navigation function that scrolls to top after navigation
 * @param navigate - The navigation function from useLocation
 * @param path - The path to navigate to
 */
export function navigateAndScrollToTop(navigate: (path: string) => void, path: string) {
  scrollToTop();
  navigate(path);
}
