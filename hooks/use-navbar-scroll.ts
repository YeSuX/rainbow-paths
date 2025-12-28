import { useState, useEffect } from "react";

/**
 * Hook to track scroll position and determine if navbar should show scrolled state
 * Manages scroll event listener and cleanup
 * 
 * @param threshold - Scroll threshold in pixels (default: 10)
 * @returns isScrolled state indicating whether scroll position exceeds threshold
 */
export function useNavbarScroll(threshold: number = 10): boolean {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
}

