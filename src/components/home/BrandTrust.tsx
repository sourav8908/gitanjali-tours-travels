import React from 'react';
import { companyInfo } from '../../data/companyInfo';
import { vehiclesData } from '../../data/vehicles';
import { toursData } from '../../data/tours';
import { destinations } from '../../data/destinations';
import { popularLocations } from '../../data/locations';
import { Car, Map, Landmark, Clock } from 'lucide-react';
import { KonarkWheel } from '../ui/KonarkWheel';
import { CountUp } from '../ui/CountUp';

// Every figure is counted from the site's own data, so it stays accurate as content changes
const stats = [
  { icon: Car, value: vehiclesData.length, suffix: '', label: 'Vehicle types', note: 'Sedan to 17-seater' },
  { icon: Map, value: toursData.length, suffix: '', label: 'Tour packages', note: 'Odisha & outstation' },
  { icon: Landmark, value: destinations.length, suffix: '+', label: 'Landmarks covered', note: 'Temples, beaches, lakes' },
  { icon: Clock, value: 24, suffix: '/7', label: 'Outstation support', note: `${popularLocations.length} routes priced online` },
].filter((stat) => stat.value > 0);

export const BrandTrust: React.FC = () => {
  return (
    <section className="bg-brand-navy-light py-16 text-white relative overflow-hidden">
      <KonarkWheel
        strokeWidth={0.8}
        className="absolute -left-24 top-1/2 -translate-y-1/2 w-80 h-80 text-brand-gold/[0.07] pointer-events-none"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Brand statement */}
          <div className="max-w-md text-center lg:text-left">
            <p className="text-xs font-semibold text-brand-gold tracking-widest uppercase mb-2">
              Odisha Travel & Transportation
            </p>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
              {companyInfo.brandSignature}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Based in Bhubaneswar, {companyInfo.name} delivers comfortable car hire, temple circuit tours, and outstation travel built around safety, punctuality, and upfront pricing.
            </p>
          </div>

          {/* Glass stat tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full lg:w-auto">
            {stats.map(({ icon: Icon, value, suffix, label, note }) => (
              <div
                key={label}
                className="lg:w-40 p-5 rounded-brand-lg text-center bg-white/[0.04] border border-white/10 backdrop-blur-sm hover:border-brand-gold/40 transition-colors"
              >
                <Icon className="w-5 h-5 text-brand-gold mx-auto mb-3" />
                <p className="text-3xl font-display font-bold text-white">
                  <CountUp end={value} suffix={suffix} />
                </p>
                <p className="text-sm font-semibold text-white mt-1">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{note}</p>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
