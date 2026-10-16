import React from 'react';
import { companyInfo } from '../../data/companyInfo';
import { footerNavLinks } from '../../data/navigation';
import { services } from '../../data/services';
import type { LegalDocType } from '../../types';
import { Phone, Mail, MapPin, MessageSquare, ArrowUp } from 'lucide-react';
import { getEmailUrl, getGeneralWhatsAppUrl, getPhoneUrl } from '../../utils/enquiry';
import { BrandBadge } from '../ui/BrandBadge';
import { FacebookIcon, InstagramIcon } from '../ui/SocialIcons';

interface FooterProps {
  onOpenLegal: (type: LegalDocType) => void;
  onOpenCredits: () => void;
}

// Only links the owner has filled in are shown
const socialLinks = [
  { label: 'Facebook', href: companyInfo.socialLinks.facebook, Icon: FacebookIcon },
  { label: 'Instagram', href: companyInfo.socialLinks.instagram, Icon: InstagramIcon },
].filter((link) => link.href);

const footerLinkClass = 'hover:text-brand-gold transition-colors';

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onOpenCredits }) => {
  return (
    <footer className="bg-brand-navy-dark text-slate-300 pt-16 pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <BrandBadge />
              <div>
                <span className="font-display font-bold text-lg text-white block">
                  {companyInfo.name}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-brand-gold font-medium block">
                  {companyInfo.brandSignature}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Bhubaneswar-based car rental and travel agency for Puri Jagannath Dham, Konark Sun Temple, Chilika Lake, airport transfers, and outstation road trips.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <a
                href={getGeneralWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-brand-gold text-sm font-semibold rounded-brand border border-white/10 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={getPhoneUrl()}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-brand border border-white/10 transition-colors"
              >
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>Call</span>
              </a>

              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-brand-gold transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <nav className="space-y-3" aria-label="Footer">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-sm">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className={footerLinkClass}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {services.map((service) => (
                <li key={service}>{service}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                <address className="not-italic">{companyInfo.address.full}</address>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={getPhoneUrl()} className="hover:text-white transition-colors">{companyInfo.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <a href={getEmailUrl()} className="hover:text-white transition-colors truncate">{companyInfo.email}</a>
              </li>
              <li className="text-xs text-slate-500">{companyInfo.businessHours}</li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center md:text-left">
          <div>
            <p>© {new Date().getFullYear()} <strong>{companyInfo.name}</strong>. All rights reserved.</p>
            <p className="text-brand-gold/80 mt-0.5">{companyInfo.brandSignature} • Odisha, India</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <button onClick={() => onOpenLegal('privacy')} className={footerLinkClass}>Privacy Policy</button>
            <span aria-hidden="true">•</span>
            <button onClick={() => onOpenLegal('terms')} className={footerLinkClass}>Terms & Conditions</button>
            <span aria-hidden="true">•</span>
            <button onClick={onOpenCredits} className={footerLinkClass}>Photo Credits</button>
            <span aria-hidden="true">•</span>
            <a href="#" className={`inline-flex items-center gap-1 ${footerLinkClass}`}>
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
