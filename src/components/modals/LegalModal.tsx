import React from 'react';
import { Modal } from '../ui/Modal';
import { companyInfo } from '../../data/companyInfo';
import type { LegalDocType } from '../../types';

interface LegalModalProps {
  type: LegalDocType | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isPrivacy = type === 'privacy';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';

  return (
    <Modal isOpen={!!type} onClose={onClose} title={title} maxWidth="max-w-2xl">
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        {isPrivacy ? (
          <>
            <p>
              At <strong>{companyInfo.name}</strong>, we respect your privacy. This policy outlines how we handle your travel enquiry information.
            </p>
            <h4 className="text-sm font-bold text-brand-navy pt-2">1. Information We Collect</h4>
            <p>
              When you submit a travel enquiry via WhatsApp, phone, or website contact forms, we receive your name, contact phone number, travel dates, pickup address, and destination.
            </p>
            <h4 className="text-sm font-bold text-brand-navy pt-2">2. How Information is Used</h4>
            <p>
              Your contact details are solely used to coordinate driver dispatch, share fare estimates, send vehicle allocation details, and provide customer support during your road journey. We do not sell or trade your personal information.
            </p>
            <h4 className="text-sm font-bold text-brand-navy pt-2">3. Data Security</h4>
            <p>
              We maintain standard physical and digital practices to safeguard your booking records. You may request deletion of your contact records by emailing {companyInfo.email}.
            </p>
          </>
        ) : (
          <>
            <p>
              These Terms & Conditions govern car rental and tour bookings made with <strong>{companyInfo.name}</strong> ({companyInfo.brandSignature}).
            </p>
            <h4 className="text-sm font-bold text-brand-navy pt-2">1. Rental Billing & Kilometers</h4>
            <p>
              Kilometers and hours are measured from the agreed pickup schedule or garage dispatch as communicated in your quotation. Outstation trips are subject to a minimum billing of 250 km/day (or 300 km/day for tourist vans).
            </p>
            <h4 className="text-sm font-bold text-brand-navy pt-2">2. Tolls, Taxes & Parking</h4>
            <p>
              All toll plaza charges, state entry border permits, and parking ticket fees are payable by the customer on actual receipt basis unless explicitly bundled into a fixed tour package.
            </p>
            <h4 className="text-sm font-bold text-brand-navy pt-2">3. Night Driving & Driver Allowance</h4>
            <p>
              Driver allowance covers meals and lodging for multi-day outstation itineraries. Night driving charges apply for journeys operated between 10:00 PM and 6:00 AM.
            </p>
            <h4 className="text-sm font-bold text-brand-navy pt-2">4. Booking Confirmations & Cancellations</h4>
            <p>
              Advance booking confirmation is recommended during peak holiday seasons. Cancellation requests made in advance are processed in accordance with the specific vehicle allocation terms.
            </p>
          </>
        )}

        <div className="pt-4 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-navy text-white text-xs font-semibold rounded-brand hover:bg-brand-navy-light transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
