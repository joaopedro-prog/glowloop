
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia(query);
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches);
      };

      // Initial check
      setMatches(mediaQuery.matches);

      // Add listener
      try {
        // Modern browsers
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } catch (e) {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    }
  }, [query]);

  return matches;
}
