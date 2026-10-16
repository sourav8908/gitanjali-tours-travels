import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  suffix?: string;
  durationMs?: number;
}

/** Counts from 0 to `end` the first time the number scrolls into view. */
export const CountUp: React.FC<CountUpProps> = ({ end, suffix = '', durationMs = 1400 }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setValue(end);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(end * eased));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, durationMs]);

  return (
    <span ref={ref} aria-label={`${end}${suffix}`}>
      {value}
      {suffix}
    </span>
  );
};
