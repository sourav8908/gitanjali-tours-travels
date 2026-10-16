import React from 'react';

interface TempleBorderProps {
  className?: string;
}

/**
 * Decorative strip of temple-spire triangles, inspired by the "phoda kumbha"
 * border woven into Odisha's Sambalpuri and Bomkai sarees.
 */
export const TempleBorder: React.FC<TempleBorderProps> = ({ className = '' }) => (
  <div aria-hidden="true" className={`temple-border h-3 w-full ${className}`} />
);
