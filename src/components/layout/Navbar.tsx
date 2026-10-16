import React, { useState } from 'react';
import { Phone, MessageSquare, Menu, X } from 'lucide-react';
import { companyInfo } from '../../data/companyInfo';
import { navLinks } from '../../data/navigation';
import { getGeneralWhatsAppUrl, getPhoneUrl } from '../../utils/enquiry';
import { useScrolledPast } from '../../hooks/useScrolledPast';
import { useActiveSection } from '../../hooks/useActiveSection';
import { BrandBadge } from '../ui/BrandBadge';

const sectionIds = navLinks.map((link) => link.href.replace('#', ''));

export const Navbar: React.FC = () => {
  const isScrolled = useScrolledPast(20);
  const activeSection = useActiveSection(sectionIds);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => activeSection === href.replace('#', '');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || mobileMenuOpen
          ? 'bg-brand-navy/95 backdrop-blur-md shadow-md py-3'
          : 'bg-gradient-to-b from-brand-navy/90 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* Brand Logo & Name */}
          <a href="#" className="flex items-center gap-3 group min-w-0" aria-label={`${companyInfo.name} home`}>
            <BrandBadge />
            <div className="min-w-0">
              <span className="font-display font-bold text-base sm:text-xl text-white block leading-tight group-hover:text-brand-gold transition-colors">
                {companyInfo.name}
              </span>
              <span className="hidden sm:block text-[11px] uppercase tracking-widest text-brand-gold/90 font-medium">
                {companyInfo.hubLocation}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'true' : undefined}
                className={`text-sm font-medium transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-brand-gold after:transition-all ${
                  isActive(link.href)
                    ? 'text-brand-gold after:w-full'
                    : 'text-slate-200 hover:text-brand-gold after:w-0 hover:after:w-full'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={getPhoneUrl()}
              className="hidden 2xl:inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/15 rounded-brand transition-colors"
              title="Call for bookings"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>{companyInfo.phoneDisplay}</span>
            </a>

            <a
              href={getPhoneUrl()}
              className="2xl:hidden p-2 text-brand-gold hover:text-white transition-colors"
              aria-label={`Call ${companyInfo.phoneDisplay}`}
            >
              <Phone className="w-5 h-5" />
            </a>

            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-brand-navy bg-brand-gold hover:bg-brand-gold-dark rounded-brand shadow-sm transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="xl:hidden p-2 text-slate-200 hover:text-white"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="xl:hidden bg-brand-navy border-t border-white/10 px-4 pt-3 pb-6 animate-fadeIn">
          <nav className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-1" aria-label="Mobile">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(link.href) ? 'true' : undefined}
                className={`px-3 py-3 text-base font-medium rounded-brand transition-colors ${
                  isActive(link.href)
                    ? 'text-brand-gold bg-white/5'
                    : 'text-slate-200 hover:text-brand-gold hover:bg-white/5'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="max-w-7xl mx-auto mt-3 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2">
            <a
              href={getPhoneUrl()}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-white/10 rounded-brand border border-white/15"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              <span>Call {companyInfo.phoneDisplay}</span>
            </a>

            <a
              href={getGeneralWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-brand-navy bg-brand-gold hover:bg-brand-gold-dark rounded-brand"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Booking</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
