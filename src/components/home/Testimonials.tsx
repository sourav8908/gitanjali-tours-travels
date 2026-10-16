import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star, ExternalLink } from 'lucide-react';
import { visibleTestimonials } from '../../data/testimonials';
import { companyInfo } from '../../data/companyInfo';
import { SectionHeader } from '../ui/SectionHeader';

const AUTO_ADVANCE_MS = 5000;

const Stars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-brand-gold fill-brand-gold' : 'text-slate-300'}`}
        aria-hidden="true"
      />
    ))}
  </div>
);

/** Scrolls the carousel one card, wrapping around at either end. */
function scrollByCard(track: HTMLDivElement | null, direction: 1 | -1) {
  const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    const step = card.offsetWidth + 24; // card width + gap
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    const atStart = track.scrollLeft <= 4;
    if (direction === 1 && atEnd) track.scrollTo({ left: 0, behavior: 'smooth' });
    else if (direction === -1 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
    else track.scrollBy({ left: direction * step, behavior: 'smooth' });
}

export const Testimonials: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => scrollByCard(trackRef.current, 1), AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  if (visibleTestimonials.length === 0) return null;

  const average =
    visibleTestimonials.reduce((sum, t) => sum + t.rating, 0) / visibleTestimonials.length;

  return (
    <section id="reviews" className="py-20 bg-brand-ivory border-t border-slate-200/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          eyebrow="Traveller Stories"
          title="What Our Customers Say"
          description={`Rated ${average.toFixed(1)} out of 5 by travellers who have journeyed with us across Odisha.`}
          action={
            <div className="flex items-center gap-2">
              {companyInfo.googleReviewsUrl && (
                <a
                  href={companyInfo.googleReviewsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-brand-navy bg-white border border-slate-200 hover:border-slate-300 rounded-brand transition-colors mr-2"
                >
                  <span>All Google Reviews</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                onClick={() => scrollByCard(trackRef.current, -1)}
                className="p-3 rounded-full bg-white border border-slate-200 text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollByCard(trackRef.current, 1)}
                className="p-3 rounded-full bg-white border border-slate-200 text-brand-navy hover:bg-brand-navy hover:text-white transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          }
        />

        <div
          ref={trackRef}
          className="no-scrollbar flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          aria-label="Customer reviews"
        >
          {visibleTestimonials.map((review) => (
            <figure
              key={review.id}
              className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] bg-white rounded-brand-lg border border-slate-200 p-6 sm:p-7 shadow-subtle flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <Stars rating={review.rating} />
                {review.isDemoData ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    Sample
                  </span>
                ) : (
                  <Quote className="w-6 h-6 text-brand-gold/40" aria-hidden="true" />
                )}
              </div>

              <blockquote className="text-sm sm:text-base text-slate-700 leading-relaxed flex-1">
                “{review.quote}”
              </blockquote>

              <figcaption className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-brand-navy text-brand-gold font-display font-bold flex items-center justify-center shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-brand-navy truncate">{review.name}</p>
                  <p className="text-xs text-slate-500 truncate">
                    {review.trip} · {review.location}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  );
};
