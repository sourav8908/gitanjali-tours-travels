import React from 'react';
import { offersData } from '../../data/offers';
import { Tag, Calendar, MessageSquare } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/enquiry';
import { SectionHeader } from '../ui/SectionHeader';
import { Notice } from '../ui/Notice';

export const SpecialOffers: React.FC = () => {
  return (
    <section id="offers" className="py-20 bg-brand-surface border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow="Seasonal Promotions"
          title="Special Travel Offers & Group Benefits"
          description="Explore seasonal travel savings, early bird booking benefits, and custom rates for group events."
        />

        <Notice title="Promotional Notice" tone="info" editHint="Admin › Offers">
          Promotional packages are subject to advance booking terms.
        </Notice>

        {/* Offers Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offersData.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-brand-lg border border-slate-200 p-6 flex flex-col justify-between shadow-subtle hover:shadow-card transition-all duration-300"
            >
              <div>
                {/* Badge & Discount */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-brand bg-brand-ocean/10 text-brand-ocean text-[11px] font-bold uppercase tracking-wider">
                    <Tag className="w-3 h-3" />
                    {offer.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-display text-brand-navy mb-1">
                  {offer.title}
                </h3>
                {offer.subtitle && (
                  <p className="text-xs text-slate-500 mb-1">{offer.subtitle}</p>
                )}
                <p className="text-xs font-semibold text-brand-ocean mb-3">
                  {offer.discount}
                </p>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {offer.description}
                </p>

                {/* Validity Field */}
                <div className="p-3 bg-brand-surface rounded-brand border border-slate-100 mb-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-sm text-slate-700 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-brand-ocean shrink-0" />
                    <span className="text-[11px]">{offer.validity}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    <strong>Terms:</strong> {offer.terms}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <a
                href={buildWhatsAppUrl({
                  offerName: offer.title,
                  message: `Enquiring about the offer: ${offer.title} (${offer.discount})`
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-brand-ocean hover:bg-brand-ocean-hover rounded-brand transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Claim Offer on WhatsApp</span>
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
