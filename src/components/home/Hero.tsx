import React, { useEffect, useState } from 'react';
import { ArrowRight, Phone, ShieldCheck, MapPin, BadgeIndianRupee } from 'lucide-react';
import { companyInfo } from '../../data/companyInfo';
import { heroSlides } from '../../data/destinations';
import { KonarkWheel } from '../ui/KonarkWheel';
import { servicesHref } from '../../data/settings';
import { asset } from '../../utils/asset';

const SLIDE_INTERVAL_MS = 6000;

const trustPoints = [
  { icon: ShieldCheck, title: 'Clean AC Fleet', text: 'Sanitized before every trip' },
  { icon: MapPin, title: 'Doorstep Pickup', text: 'Airport, station & home' },
  { icon: BadgeIndianRupee, title: 'Transparent ₹ Tariff', text: 'Upfront per-km rates' },
];

// "Your Journey, Our Responsibility." → plain part + gold part after the first comma
const commaAt = companyInfo.tagline.indexOf(',');
const headlineStart = commaAt === -1 ? companyInfo.tagline : companyInfo.tagline.slice(0, commaAt + 1);
const headlineHighlight = commaAt === -1 ? '' : companyInfo.tagline.slice(commaAt + 1).trim();

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const Hero: React.FC = () => {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);
  const [loadedUpTo, setLoadedUpTo] = useState(1);
  const [isPaused, setIsPaused] = useState(prefersReducedMotion);

  const goTo = (index: number) => {
    setPrevious(active);
    setActive(index);
    // Load the next photo one slide ahead of time
    setLoadedUpTo((n) => Math.max(n, index + 1));
  };

  useEffect(() => {
    if (isPaused || heroSlides.length < 2) return;
    const timer = window.setTimeout(() => goTo((active + 1) % heroSlides.length), SLIDE_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  });

  // Pause while the tab is in the background
  useEffect(() => {
    const onVisibility = () => setIsPaused(document.hidden || prefersReducedMotion());
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const current = heroSlides[active];

  return (
    <section
      className="relative min-h-[100svh] flex items-center bg-brand-navy pt-28 pb-40 md:pb-28 overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Odisha destinations"
    >

      {/* Background slideshow */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, i) =>
          i <= loadedUpTo ? (
            <img
              key={slide.id}
              src={asset(slide.heroImage ?? slide.image)}
              alt=""
              loading={i === 0 ? 'eager' : 'lazy'}
              fetchPriority={i === 0 ? 'high' : 'low'}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
                i === active ? 'opacity-100' : 'opacity-0'
              } ${i === active || i === previous ? 'animate-kenBurns' : ''}`}
            />
          ) : null
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-brand-navy/20" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent" />
      </div>

      {/* Konark wheel watermark */}
      <KonarkWheel
        strokeWidth={0.6}
        className="hidden lg:block absolute -right-40 top-1/2 -translate-y-1/2 w-[640px] h-[640px] text-brand-gold/10 animate-spinSlow z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">

          {/* 5602 brand signature */}
          <div className="animate-fadeUp inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-brand-gold/40 mb-6 backdrop-blur-sm">
            <KonarkWheel className="w-4 h-4 text-brand-gold" strokeWidth={4} />
            <span className="text-xs font-semibold text-brand-gold tracking-wider uppercase">
              {companyInfo.brandSignature}
            </span>
          </div>

          <h1 className="animate-fadeUp [animation-delay:100ms] font-display font-bold text-white mb-6">
            <span className="block text-sm sm:text-base font-sans font-semibold tracking-[0.25em] uppercase text-slate-300 mb-4">
              {companyInfo.name}
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl leading-[1.1]">
              {headlineStart}{headlineHighlight && <> <span className="text-brand-gold italic">{headlineHighlight}</span></>}
            </span>
          </h1>

          <p className="animate-fadeUp [animation-delay:200ms] text-base sm:text-lg text-slate-200/90 leading-relaxed mb-10 max-w-xl">
            {companyInfo.supportingText}
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="animate-fadeUp [animation-delay:300ms] flex flex-col sm:flex-row gap-3 sm:gap-4 mb-14">
            <a
              href={servicesHref}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-sm font-semibold text-brand-navy bg-brand-gold hover:bg-brand-gold-dark rounded-brand shadow-lg shadow-black/20 transition-colors group"
            >
              <span>Explore Our Services</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/20 rounded-brand backdrop-blur-sm transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>Contact Us</span>
            </a>
          </div>

          {/* Trust Attributes */}
          <ul className="animate-fadeUp [animation-delay:400ms] hidden sm:grid grid-cols-3 gap-5 pt-8 border-t border-white/10">
            {trustPoints.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-400">{text}</p>
                </div>
              </li>
            ))}
          </ul>

        </div>
      </div>

      {/* Slide caption & controls */}
      <div
        className="absolute z-10 bottom-20 md:bottom-6 inset-x-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(prefersReducedMotion())}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end justify-between gap-6">
          <div key={current.id} className="animate-fadeUp min-w-0" aria-live="polite">
            <p className="text-[11px] uppercase tracking-[0.2em] text-brand-gold font-semibold">
              {current.tagline}
            </p>
            <p className="text-base sm:text-lg font-display font-semibold text-white truncate">
              {current.name}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0" role="group" aria-label="Choose slide">
            {heroSlides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => goTo(i)}
                aria-label={`Show ${slide.name}`}
                aria-current={i === active ? 'true' : undefined}
                className="group py-3"
              >
                <span
                  className={`block h-1 rounded-full transition-all duration-500 ${
                    i === active ? 'w-10 bg-brand-gold' : 'w-4 bg-white/35 group-hover:bg-white/70'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
