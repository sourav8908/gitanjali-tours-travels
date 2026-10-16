import React from 'react';
import { Phone, MessageSquare, ArrowUp } from 'lucide-react';
import { companyInfo } from '../../data/companyInfo';
import { getGeneralWhatsAppUrl, getPhoneUrl } from '../../utils/enquiry';
import { useScrolledPast } from '../../hooks/useScrolledPast';

export const FloatingBar: React.FC = () => {
  const showScrollTop = useScrolledPast(400);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll to top floating pill (Desktop & Tablet) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-8 right-6 z-30 p-3 bg-brand-navy hover:bg-slate-800 text-white rounded-full shadow-lg border border-slate-700 transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5 text-brand-gold" />
        </button>
      )}

      {/* Mobile Bottom Quick Action Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-brand-navy/95 backdrop-blur-md border-t border-slate-800 p-2.5 flex items-center gap-2 shadow-2xl">
        <a
          href={getPhoneUrl()}
          aria-label={`Call ${companyInfo.phoneDisplay}`}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-slate-800 text-white text-xs font-semibold rounded-brand border border-slate-700"
        >
          <Phone className="w-4 h-4 text-brand-gold" />
          <span>Call Desk</span>
        </a>

        <a
          href={getGeneralWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 bg-brand-gold hover:bg-brand-gold-dark text-brand-navy text-xs font-bold rounded-brand shadow-sm"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>
      </div>
    </>
  );
};
