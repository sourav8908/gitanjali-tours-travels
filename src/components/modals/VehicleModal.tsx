import React from 'react';
import type { Vehicle } from '../../types';
import { Modal } from '../ui/Modal';
import { Users, Wind, Briefcase, Check, MessageSquare, Phone, Fuel } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/enquiry';
import { companyInfo } from '../../data/companyInfo';
import { asset } from '../../utils/asset';

interface VehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  return (
    <Modal isOpen={!!vehicle} onClose={onClose} title={vehicle.fullName} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Vehicle Image */}
        <div className="relative h-64 rounded-brand overflow-hidden bg-slate-100">
          <img
            src={asset(vehicle.image)}
            alt={vehicle.fullName}
            className="w-full h-full object-cover"
          />
          {vehicle.isSignature5602 && (
            <div className="absolute top-3 left-3 bg-brand-navy/90 text-brand-gold text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-brand border border-brand-gold/60 shadow-sm">
              5602 Signature Vehicle
            </div>
          )}
        </div>

        {/* Overview & Pricing */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-brand-ocean uppercase tracking-wider block">
              {vehicle.brand} • {vehicle.category}
            </span>
            <h4 className="text-xl font-bold font-display text-brand-navy">
              {vehicle.fullName}
            </h4>
          </div>

          <div className="bg-brand-surface px-4 py-2 rounded-brand border border-slate-200 text-right">
            <span className="text-[11px] text-slate-500 block">Tariff begins at</span>
            <span className="text-lg font-bold text-brand-navy">
              {vehicle.rentalStartingPrice} <span className="text-xs font-normal text-slate-500">/ {vehicle.pricingUnit}</span>
            </span>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-brand-surface rounded-brand border border-slate-200 text-center">
          <div>
            <Users className="w-5 h-5 text-brand-ocean mx-auto mb-1" />
            <span className="text-[11px] text-slate-500 block">Seating</span>
            <span className="text-xs font-bold text-brand-navy">{vehicle.seatingCapacity} Passengers</span>
          </div>

          <div>
            <Wind className="w-5 h-5 text-brand-ocean mx-auto mb-1" />
            <span className="text-[11px] text-slate-500 block">Climate</span>
            <span className="text-xs font-bold text-brand-navy">{vehicle.isAc ? 'Air Conditioned' : 'Standard'}</span>
          </div>

          <div>
            <Fuel className="w-5 h-5 text-brand-ocean mx-auto mb-1" />
            <span className="text-[11px] text-slate-500 block">Fuel Type</span>
            <span className="text-xs font-bold text-brand-navy truncate block">{vehicle.fuelType || 'Standard'}</span>
          </div>
        </div>

        {/* Luggage Capacity */}
        <div className="flex items-center gap-2 p-3 bg-brand-surface rounded-brand border border-slate-100 text-sm text-slate-700">
          <Briefcase className="w-4 h-4 text-brand-ocean shrink-0" />
          <span><strong>Luggage Allowance:</strong> {vehicle.luggageCapacity}</span>
        </div>

        {/* Best For Tag */}
        <div className="p-3 bg-blue-50/70 rounded-brand border border-blue-200/60 text-xs text-blue-900">
          <strong>Recommended For:</strong> {vehicle.bestFor}
        </div>

        {/* Description */}
        <div>
          <h5 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
            Overview
          </h5>
          <p className="text-sm text-slate-600 leading-relaxed">
            {vehicle.description}
          </p>
        </div>

        {/* Features Checklist */}
        <div>
          <h5 className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
            Included Comfort Features
          </h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {vehicle.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                <Check className="w-3.5 h-3.5 text-brand-ocean shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
          <a
            href={buildWhatsAppUrl({ vehicleName: vehicle.fullName })}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-brand-gold hover:bg-brand-gold-dark text-brand-navy font-semibold text-xs rounded-brand shadow-sm transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Book {vehicle.fullName} on WhatsApp</span>
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
