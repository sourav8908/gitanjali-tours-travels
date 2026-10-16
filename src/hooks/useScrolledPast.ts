import { useEffect, useState } from 'react';

/**
 * Returns true once the page has been scrolled further than `threshold` pixels.
 */
export function useScrolledPast(threshold: number): boolean {
  const [isPast, setIsPast] = useState(() => window.scrollY > threshold);

  useEffect(() => {
    const handleScroll = () => setIsPast(window.scrollY > threshold);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isPast;
}
