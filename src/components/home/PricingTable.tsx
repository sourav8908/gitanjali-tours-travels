import React, { useState } from 'react';
import { pricingData, pricingTabs } from '../../data/pricing';
import type { PricingCategoryKey } from '../../types';
import { Check, MessageSquare } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/enquiry';
import { SectionHeader } from '../ui/SectionHeader';
import { FilterPills } from '../ui/FilterPills';
import { Notice } from '../ui/Notice';

const tabOptions = pricingTabs.map((tab) => ({ value: tab.key, label: tab.label }));

// Literal class names so Tailwind generates them
const gridColumns: Record<number, string> = {
  1: 'max-w-md',
  2: 'md:grid-cols-2 max-w-4xl',
  3: 'md:grid-cols-2 lg:grid-cols-3',
  4: 'md:grid-cols-2 xl:grid-cols-4',
};

export const PricingTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PricingCategoryKey>(pricingTabs[0].key);

  const filteredPricing = pricingData.filter((p) => p.categoryKey === activeTab);

  return (
    <section id="pricing" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow="Transparent Tariffs in ₹ (INR)"
          title="Rental Tariffs & Tour Rates"
          description="Straightforward pricing for Odisha sightseeing, airport transfers, and outstation trips. Select a tariff plan below to view rates and inclusions."
          className="mb-8"
        />

        <div className="mb-8">
          <FilterPills options={tabOptions} active={activeTab} onChange={setActiveTab} />
        </div>

        <Notice title="Reference Tariff" editHint="Admin › Rates">
          The rates shown below are standard baseline tariffs. Seasonal variations or custom multi-day packages may apply.
        </Notice>

        {/* Pricing Cards Grid */}
        <div className={`grid grid-cols-1 gap-6 ${gridColumns[Math.min(filteredPricing.length, 4)] ?? gridColumns[3]}`}>
          {filteredPricing.map((item) => (
            <div
              key={item.id}
              className="bg-brand-surface border border-slate-200 rounded-brand-lg p-6 flex flex-col justify-between shadow-subtle hover:shadow-card transition-all duration-300"
            >
              <div>
                {/* Header */}
                <div className="pb-4 border-b border-slate-200 mb-4">
                  <span className="text-[11px] font-semibold text-brand-ocean uppercase tracking-wider block mb-1">
                    {item.categoryName}
                  </span>
                  <h3 className="text-lg font-bold font-display text-brand-navy">
                    {item.vehicleCategory}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Model: {item.vehicleModelExample}
                  </p>
                  
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-3xl font-display font-bold text-brand-navy">
                      {item.basePrice}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      / {item.unit}
                    </span>
                  </div>
                </div>

                {/* Additional Charges / Minimums */}
                <div className="p-3 bg-white rounded-brand border border-slate-200/80 mb-5">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Allowances & Notes
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.additionalCharges}
                  </p>
                </div>

                {/* Terms Checklist */}
                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Package Terms:
                  </p>
                  {item.terms.map((term, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                      <Check className="w-3.5 h-3.5 text-brand-ocean shrink-0 mt-0.5" />
                      <span>{term}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <a
                href={buildWhatsAppUrl({
                  vehicleName: `${item.vehicleCategory} (${item.vehicleModelExample})`,
                  message: `Enquiring about ${item.categoryName} tariff plan (${item.basePrice} / ${item.unit})`
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-brand-navy bg-brand-gold hover:bg-brand-gold-dark hover:text-white rounded-brand transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Enquire This Plan</span>
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
