import React from 'react';
import { MapPin, MessageSquare } from 'lucide-react';
import { destinations } from '../../data/destinations';
import { buildWhatsAppUrl } from '../../utils/enquiry';
import { SectionHeader } from '../ui/SectionHeader';
import { Reveal } from '../ui/Reveal';
import { asset } from '../../utils/asset';

// After the large first card and its two neighbours, cards run in rows of three
const lastRowHasTwo = (destinations.length - 3) % 3 === 2;

const cardSpan = (i: number) => {
  if (i === 0) return 'sm:col-span-2 lg:row-span-2';
  if (lastRowHasTwo && i === destinations.length - 1) return 'lg:col-span-2';
  return '';
};

export const Destinations: React.FC = () => {
  return (
    <section id="destinations" className="py-20 bg-brand-ivory">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          eyebrow="Discover Odisha"
          title="Popular Destinations We Drive You To"
          description="From the Sun Temple at Konark to the dolphins of Chilika: sacred temples, golden beaches, and living heritage, all within a comfortable drive of Bhubaneswar."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:auto-rows-[260px]">
          {destinations.map((place, i) => (
            <Reveal
              key={place.id}
              delay={(i % 3) * 100}
              className={cardSpan(i)}
            >
              <article className="group relative h-72 sm:h-80 lg:h-full rounded-brand-lg overflow-hidden shadow-card">
                <img
                  src={asset(place.image)}
                  alt={place.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${
                    i === 0
                      ? 'from-brand-navy/95 via-brand-navy/40 via-35% to-transparent to-65%'
                      : 'from-brand-navy via-brand-navy/75 via-45% to-transparent'
                  }`}
                />

                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold text-brand-navy">
                  <MapPin className="w-3 h-3 text-brand-sandstone" />
                  {place.distanceFromHub}
                </span>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-brand-gold font-semibold mb-1">
                    {place.tagline}
                  </p>
                  <h3 className={`font-display font-bold text-white ${i === 0 ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
                    {place.name}
                  </h3>
                  <p className={`text-sm text-slate-200/90 mt-2 leading-relaxed ${i === 0 ? 'max-w-md' : 'line-clamp-2'}`}>
                    {place.description}
                  </p>
                  <a
                    href={buildWhatsAppUrl({ destination: place.name })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-white transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Plan a trip here</span>
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
};
