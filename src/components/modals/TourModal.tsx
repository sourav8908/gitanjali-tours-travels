import React from 'react';
import type { TourPackage } from '../../types';
import { Modal } from '../ui/Modal';
import { Clock, MapPin, Check, MessageSquare, Phone, Compass } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/enquiry';
import { companyInfo } from '../../data/companyInfo';
import { asset } from '../../utils/asset';

interface TourModalProps {
  tour: TourPackage | null;
  onClose: () => void;
}

export const TourModal: React.FC<TourModalProps> = ({ tour, onClose }) => {
  if (!tour) return null;

  return (
    <Modal isOpen={!!tour} onClose={onClose} title={tour.title} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Tour Image */}
        <div className="relative h-64 rounded-brand overflow-hidden bg-slate-100">
          <img
            src={asset(tour.image)}
            alt={tour.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-brand-navy/90 text-brand-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-brand">
            {tour.region} • {tour.category}
          </div>
        </div>

        {/* Overview & Duration */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-brand-ocean font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{tour.duration}</span>
              <span>•</span>
              <Compass className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-slate-600">{tour.category}</span>
            </div>
            <h4 className="text-xl font-bold font-display text-brand-navy">
              {tour.title}
            </h4>
            <div className="flex items-center gap-1.5 text-xs text-brand-ocean font-semibold mt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{tour.route}</span>
            </div>
          </div>

          <div className="bg-brand-surface px-4 py-2 rounded-brand border border-slate-200 text-right">
            <span className="text-[11px] text-slate-500 block">Starting Tariff</span>
            <span className="text-lg font-bold text-brand-navy">
              {tour.startingPrice}
            </span>
            <span className="text-[10px] text-slate-400 block">{tour.priceNote}</span>
          </div>
        </div>

        {/* Description */}
        <div>
          <h5 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
            Trip Overview
          </h5>
          <p className="text-sm text-slate-600 leading-relaxed">
            {tour.description}
          </p>
        </div>

        {/* Itinerary Highlights */}
        <div>
          <h5 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
            Key Highlights
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {tour.highlights.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-3.5 h-3.5 text-brand-ocean shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Package Inclusions */}
        <div>
          <h5 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
            Package Inclusions
          </h5>
          <div className="space-y-1.5 p-3 bg-brand-surface rounded-brand border border-slate-200">
            {tour.inclusions.map((inc, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span>{inc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
          <a
            href={buildWhatsAppUrl({ tourName: tour.title })}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-brand-gold hover:bg-brand-gold-dark text-brand-navy font-semibold text-xs rounded-brand shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Enquire Package on WhatsApp</span>
          </a>

          <a
            href={`tel:${companyInfo.phone}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-navy hover:bg-slate-800 text-white font-semibold text-xs rounded-brand transition-colors"
          >
            <Phone className="w-4 h-4 text-brand-gold" />
            <span>Call Desk</span>
          </a>
        </div>

      </div>
    </Modal>
  );
};
