import React, { useState } from 'react';
import { vehiclesData } from '../../data/vehicles';
import type { Vehicle, VehicleCategory } from '../../types';
import { Users, Snowflake, MessageSquare, Fuel, SearchX } from 'lucide-react';
import { buildWhatsAppUrl } from '../../utils/enquiry';
import { SectionHeader } from '../ui/SectionHeader';
import { FilterPills } from '../ui/FilterPills';
import { Notice } from '../ui/Notice';
import { Reveal } from '../ui/Reveal';
import { asset } from '../../utils/asset';

type CategoryFilter = VehicleCategory | 'All';

// Only categories that actually have vehicles, in data order
const categoryOptions = (['All', ...new Set(vehiclesData.map((v) => v.category))] as CategoryFilter[])
  .map((cat) => ({ value: cat, label: cat }));

const seatOptions = [
  { value: 0, label: 'Any seats' },
  { value: 5, label: '5+ seats' },
  { value: 7, label: '7+ seats' },
  { value: 10, label: '10+ seats' },
];

const budgetOptions = [
  { value: 'any', label: 'Any budget', test: () => true },
  { value: 'low', label: 'Up to ₹15/km', test: (rate: number) => rate <= 15 },
  { value: 'mid', label: '₹16–20/km', test: (rate: number) => rate > 15 && rate <= 20 },
  { value: 'high', label: 'Above ₹20/km', test: (rate: number) => rate > 20 },
];

/** "₹19" → 19 */
const ratePerKm = (vehicle: Vehicle) => Number(vehicle.rentalStartingPrice.replace(/[^\d.]/g, '')) || 0;

const selectClass =
  'px-3.5 py-2 bg-white border border-slate-200 rounded-brand text-sm font-medium text-brand-navy focus:outline-none focus:border-brand-ocean';

interface FleetShowcaseProps {
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export const FleetShowcase: React.FC<FleetShowcaseProps> = ({ onSelectVehicle }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [minSeats, setMinSeats] = useState(0);
  const [budget, setBudget] = useState('any');

  const budgetTest = budgetOptions.find((b) => b.value === budget)?.test ?? (() => true);
  const filteredVehicles = vehiclesData.filter(
    (v) =>
      (selectedCategory === 'All' || v.category === selectedCategory) &&
      v.seatingCapacity >= minSeats &&
      budgetTest(ratePerKm(v))
  );

  const resetFilters = () => {
    setSelectedCategory('All');
    setMinSeats(0);
    setBudget('any');
  };

  return (
    <section id="vehicles" className="py-20 bg-brand-surface border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          eyebrow="Our Fleet"
          title="Comfortable Cars for Every Journey"
          description="From sedans for city rides and airport transfers to 7-seater Innova Crystas and Tempo Travellers for family pilgrimages and group tours."
        />

        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <FilterPills
            options={categoryOptions}
            active={selectedCategory}
            onChange={setSelectedCategory}
            variant="white"
          />
          <div className="flex gap-3">
            <label className="sr-only" htmlFor="fleet-seats">Seating capacity</label>
            <select id="fleet-seats" value={minSeats} onChange={(e) => setMinSeats(Number(e.target.value))} className={selectClass}>
              {seatOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <label className="sr-only" htmlFor="fleet-budget">Price range</label>
            <select id="fleet-budget" value={budget} onChange={(e) => setBudget(e.target.value)} className={selectClass}>
              {budgetOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <Notice title="Indicative Tariffs" tone="info" editHint="src/data/vehicles.ts">
          Starting rates are for reference. Your exact vehicle and fare are confirmed when you enquire.
        </Notice>

        {filteredVehicles.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-brand-lg border border-dashed border-slate-300">
            <SearchX className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-base font-semibold text-brand-navy">No vehicles match these filters</p>
            <p className="text-sm text-slate-500 mt-1">Try a different seat count or budget, or ask us on WhatsApp.</p>
            <button onClick={resetFilters} className="mt-5 px-5 py-2.5 text-sm font-semibold text-white bg-brand-navy hover:bg-brand-navy-light rounded-brand transition-colors">
              Show all vehicles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredVehicles.map((vehicle, i) => (
              <Reveal key={vehicle.id} delay={(i % 3) * 90}>
                <article className="h-full bg-white rounded-brand-lg border border-slate-200 overflow-hidden shadow-subtle hover:shadow-hover hover:-translate-y-1 transition-all duration-300 flex flex-col group">

                  {/* Vehicle photo */}
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={asset(vehicle.image)}
                      alt={vehicle.fullName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {vehicle.isSignature5602 && (
                      <div className="absolute top-3 left-3 bg-brand-navy/90 backdrop-blur-sm border border-brand-gold/60 text-brand-gold text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                        5602 Signature
                      </div>
                    )}

                    <div className={`absolute top-3 right-3 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${
                      vehicle.isAvailable ? 'bg-white/90 text-green-800' : 'bg-white/90 text-slate-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${vehicle.isAvailable ? 'bg-green-500' : 'bg-slate-400'}`} />
                      {vehicle.isAvailable ? 'Available' : 'On request'}
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[11px] font-bold text-brand-ocean uppercase tracking-wider block">
                          {vehicle.brand} · {vehicle.category}
                        </span>
                        <h3 className="text-xl font-bold text-brand-navy font-display leading-snug">
                          {vehicle.model}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-slate-500 block">from</span>
                        <span className="text-xl font-bold text-brand-navy">{vehicle.rentalStartingPrice}</span>
                        <span className="text-xs text-slate-500">/{vehicle.pricingUnit.replace('per ', '')}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {vehicle.description}
                    </p>

                    <ul className="flex flex-wrap gap-2 mb-5 text-xs font-medium text-slate-700">
                      <li className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-surface rounded-full">
                        <Users className="w-3.5 h-3.5 text-brand-ocean" />
                        {vehicle.seatingCapacity} seats
                      </li>
                      <li className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-surface rounded-full">
                        <Snowflake className="w-3.5 h-3.5 text-brand-ocean" />
                        {vehicle.isAc ? 'AC' : 'Non-AC'}
                      </li>
                      {vehicle.fuelType && (
                        <li className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-surface rounded-full">
                          <Fuel className="w-3.5 h-3.5 text-brand-ocean" />
                          {vehicle.fuelType}
                        </li>
                      )}
                    </ul>

                    <div className="mt-auto flex items-center gap-2">
                      <button
                        onClick={() => onSelectVehicle(vehicle)}
                        className="flex-1 px-3 py-2.5 text-sm font-semibold text-brand-navy bg-slate-100 hover:bg-slate-200 rounded-brand transition-colors"
                      >
                        View Details
                      </button>
                      <a
                        href={buildWhatsAppUrl({ vehicleName: vehicle.fullName })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold text-white bg-brand-ocean hover:bg-brand-ocean-hover rounded-brand transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Enquire</span>
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
