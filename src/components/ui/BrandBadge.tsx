import React from 'react';
import { companyInfo } from '../../data/companyInfo';

/** Square "5602" brand mark used in the header and footer. */
export const BrandBadge: React.FC = () => (
  <div className="w-11 h-11 shrink-0 rounded-brand bg-gradient-to-br from-brand-ocean to-brand-navy-light border border-brand-gold/40 flex items-center justify-center text-brand-gold font-display font-bold text-[15px] tracking-tight shadow-sm">
    {companyInfo.vehicleNumber}
  </div>
);
