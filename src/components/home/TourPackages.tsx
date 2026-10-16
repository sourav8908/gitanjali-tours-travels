import React, { useState } from 'react';
import { toursData } from '../../data/tours';
import type { TourPackage, TourCategory } from '../../types';
import { Clock, MapPin, MessageSquare } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/enquiry';
import { SectionHeader } from '../ui/SectionHeader';
import { FilterPills } from '../ui/FilterPills';
import { Notice } from '../ui/Notice';
import { Reveal } from '../ui/Reveal';
import { asset } from '../../utils/asset';

type CategoryFilter = TourCategory | 'All';

// Only categories that actually have tours, in data order
const categoryOptions = (['All', ...new Set(toursData.map((t) => t.category))] as CategoryFilter[])
  .map((cat) => ({ value: cat, label: cat }));

interface TourPackagesProps {
  onSelectTour: (tour: TourPackage) => void;
}

export const TourPackages: React.FC<TourPackagesProps> = ({ onSelectTour }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');

  const filteredTours = selectedCategory === 'All'
    ? toursData
    : toursData.filter((t) => t.category === selectedCategory);

  return (
    <section id="tours" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          eyebrow="Tour Packages"
          title="Curated Odisha Tours & Road Trips"
          description="The sacred Golden Triangle of Bhubaneswar, Konark and Puri, tranquil Chilika Lake, ancient Buddhist sites, and interstate journeys, each with a private car and driver."
          className="mb-8"
        />

        <div className="mb-8">
          <FilterPills options={categoryOptions} active={selectedCategory} onChange={setSelectedCategory} />
        </div>

        <Notice title="Customizable Itineraries" editHint="Admin › Tour Packages">
          Packages below are sample plans. We adjust timings, stops, and vehicle size to suit your family.
        </Notice>

        {filteredTours.length === 0 ? (
          <p className="py-16 text-center text-slate-500 border border-dashed border-slate-300 rounded-brand-lg">
            No packages in this category yet. Ask us for a custom itinerary on WhatsApp.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredTours.map((tour, i) => (
              <Reveal key={tour.id} delay={(i % 3) * 90}>
                <article className="h-full bg-white rounded-brand-lg border border-slate-200 overflow-hidden shadow-subtle hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col group">

                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <img
                      src={asset(tour.image)}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-navy/85 text-brand-gold backdrop-blur-sm">
                      {tour.category}
                    </span>
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white">
                      <Clock className="w-3.5 h-3.5 text-brand-gold" />
                      {tour.duration}
                    </span>
                  </div>

                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-display font-bold text-brand-navy leading-snug mb-2 group-hover:text-brand-ocean transition-colors">
                      {tour.title}
                    </h3>

                    <p className="flex items-start gap-1.5 text-sm text-brand-ocean font-medium mb-3">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{tour.route}</span>
                    </p>

                    <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-5">
                      {tour.description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-slate-500 block">Starting from</span>
                        <span className="text-xl font-bold text-brand-navy">{tour.startingPrice}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectTour(tour)}
                          className="px-3.5 py-2.5 text-sm font-semibold text-brand-navy bg-slate-100 hover:bg-slate-200 rounded-brand transition-colors"
                        >
                          Details
                        </button>
                        <a
                          href={buildWhatsAppUrl({ tourName: tour.title })}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-sm font-semibold text-white bg-brand-ocean hover:bg-brand-ocean-hover rounded-brand transition-colors"
                          aria-label={`Enquire about ${tour.title} on WhatsApp`}
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Enquire</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
