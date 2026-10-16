import React from 'react';

interface KonarkWheelProps {
  className?: string;
  /** Use a thinner stroke for large decorative watermarks. */
  strokeWidth?: number;
}

// 8 major and 8 minor spokes, like the wheels of the Konark Sun Temple chariot
const majorSpokes = Array.from({ length: 8 }, (_, i) => i * 45);
const minorSpokes = majorSpokes.map((deg) => deg + 22.5);

/** Stylised Konark chakra, used as the site's Odisha motif. Inherits text colour. */
export const KonarkWheel: React.FC<KonarkWheelProps> = ({ className, strokeWidth = 2 }) => (
  <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true" className={className}>
    <circle cx="50" cy="50" r="46" />
    <circle cx="50" cy="50" r="39" />
    <circle cx="50" cy="50" r="9" />
    <circle cx="50" cy="50" r="3" fill="currentColor" />
    {majorSpokes.map((deg) => (
      <line key={deg} x1="50" y1="41" x2="50" y2="11" transform={`rotate(${deg} 50 50)`} strokeWidth={strokeWidth * 1.6} />
    ))}
    {minorSpokes.map((deg) => (
      <line key={deg} x1="50" y1="41" x2="50" y2="11" transform={`rotate(${deg} 50 50)`} />
    ))}
    {majorSpokes.map((deg) => (
      <circle key={`bead-${deg}`} cx="50" cy="25" r="2.5" transform={`rotate(${deg + 22.5} 50 50)`} fill="currentColor" stroke="none" />
    ))}
  </svg>
);
