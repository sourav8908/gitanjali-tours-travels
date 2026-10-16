import React from 'react';
import { companyInfo } from '../../data/companyInfo';
import { CheckCircle2, UserCheck, Shield, HeartHandshake } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { asset } from '../../utils/asset';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white text-brand-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow="Odisha Travel & Car Hire"
          title="Your Trusted Travel Companion Across Odisha & Beyond"
          className="mb-12"
        />

        {/* Editorial Split Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Odisha photo collage */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-4">
            <figure className="col-span-2 relative rounded-brand-lg overflow-hidden shadow-card">
              <img
                src={asset('/images/odisha/rath-yatra-puri.webp')}
                alt="Chariots of Lord Jagannath at the Rath Yatra festival in Puri"
                className="w-full h-64 sm:h-72 object-cover"
                loading="lazy"
              />
              <figcaption className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-transparent pt-12 px-5 pb-4">
                <p className="text-[11px] font-semibold text-brand-gold uppercase tracking-wider">Rath Yatra · Puri</p>
                <p className="text-sm font-medium text-white">Connecting Bhubaneswar, Puri, Konark & beyond</p>
              </figcaption>
            </figure>
            <img
              src={asset('/images/odisha/konark-wheel.webp')}
              alt="Carved stone wheel of the Konark Sun Temple"
              className="w-full h-36 sm:h-44 object-cover rounded-brand-lg shadow-card"
              loading="lazy"
            />
            <img
              src={asset('/images/odisha/ratnagiri.webp')}
              alt="Ancient votive stupas at Ratnagiri Buddhist site"
              className="w-full h-36 sm:h-44 object-cover rounded-brand-lg shadow-card"
              loading="lazy"
            />
          </div>

          {/* Right: Narrative Story & Key Operational Values */}
          <div className="lg:col-span-7 space-y-6">
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4">
              <p className="text-base sm:text-lg text-brand-navy font-medium leading-relaxed">
                Headquartered in Bhubaneswar, <strong className="text-brand-navy">{companyInfo.name}</strong> provides reliable car rental services, airport transfers, family vacation packages, and outstation road trips across Odisha and neighbouring states.
              </p>
              
              <p className="text-sm sm:text-base text-slate-600">
                Whether you need a swift airport pickup from Biju Patnaik International Airport (BBI), a sacred pilgrimage tour to Puri Jagannath Dham, a scenic drive along the Puri-Konark Marine Drive, or a comfortable multi-day interstate journey to Kolkata, Vizag, or Ranchi, we ensure your trip is punctual, comfortable, and stress-free.
              </p>
            </div>

            {/* Value Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              
              <div className="flex items-start gap-3 p-3.5 rounded-brand bg-brand-surface border border-slate-200">
                <UserCheck className="w-5 h-5 text-brand-ocean shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">Experienced Drivers</h4>
                  <p className="text-sm text-slate-600 mt-1">Courteous, commercial drivers skilled with Odisha state highways & temple routes.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-brand bg-brand-surface border border-slate-200">
                <Shield className="w-5 h-5 text-brand-ocean shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">Vehicle Cleanliness</h4>
                  <p className="text-sm text-slate-600 mt-1">Deep cleaned interiors, chilled air conditioning, and sanitized seats for every trip.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-brand bg-brand-surface border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-brand-ocean shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">Transparent ₹ Billing</h4>
                  <p className="text-sm text-slate-600 mt-1">Upfront kilometer rates and genuine toll/parking billing with zero hidden surcharges.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-brand bg-brand-surface border border-slate-200">
                <HeartHandshake className="w-5 h-5 text-brand-ocean shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider">Custom Itineraries</h4>
                  <p className="text-sm text-slate-600 mt-1">Tailored travel schedules designed around your family and business commitments.</p>
                </div>
              </div>

            </div>

            {/* Owner-facing hint, development builds only */}
            {import.meta.env.DEV && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-brand text-[11px] text-amber-900 flex items-center gap-2">
              <span className="font-semibold uppercase tracking-wider text-amber-800 shrink-0">Note for Agency:</span>
              <span>All company details and contact information can be updated in <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-amber-950">src/data/companyInfo.ts</code>.</span>
            </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
