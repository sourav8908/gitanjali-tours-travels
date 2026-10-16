import { useEffect, useState } from 'react';

/**
 * Tracks which of the given section ids is currently in view, for highlighting
 * the matching navigation link. Returns null above the first section.
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const idsKey = sectionIds.join(',');

  useEffect(() => {
    const ids = idsKey.split(',');
    const visible = new Map<string, boolean>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
        // First section (in page order) that is inside the detection band wins
        setActiveId(ids.find((id) => visible.get(id)) ?? null);
      },
      // Detection band: a strip just below the fixed header
      { rootMargin: '-80px 0px -60% 0px' }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [idsKey]);

  return activeId;
}
