import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingBar } from './components/layout/FloatingBar';
import { DemoEditsPill } from './components/layout/DemoEditsPill';
import { Hero } from './components/home/Hero';
import { BrandTrust } from './components/home/BrandTrust';
import { AboutSection } from './components/home/AboutSection';
import { Destinations } from './components/home/Destinations';
import { FleetShowcase } from './components/home/FleetShowcase';
import { TourPackages } from './components/home/TourPackages';
import { DistanceMap } from './components/home/DistanceMap';
import { PricingTable } from './components/home/PricingTable';
import { SpecialOffers } from './components/home/SpecialOffers';
import { Testimonials } from './components/home/Testimonials';
import { ContactSection } from './components/home/ContactSection';
import { VehicleModal } from './components/modals/VehicleModal';
import { TourModal } from './components/modals/TourModal';
import { LegalModal } from './components/modals/LegalModal';
import { PhotoCreditsModal } from './components/modals/PhotoCreditsModal';
import { TempleBorder } from './components/ui/TempleBorder';
import { isSectionOn } from './data/settings';
import type { Vehicle, TourPackage, LegalDocType } from './types';

export const App: React.FC = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [legalModalType, setLegalModalType] = useState<LegalDocType | null>(null);
  const [showCredits, setShowCredits] = useState(false);

  return (
    <div className="min-h-screen bg-brand-surface text-brand-text flex flex-col selection:bg-brand-gold selection:text-brand-navy pb-16 md:pb-0">

      <Navbar />

      <main className="flex-grow">
        <Hero />
        <TempleBorder />
        <BrandTrust />
        {isSectionOn('about') && <AboutSection />}
        {isSectionOn('destinations') && <Destinations />}
        {isSectionOn('vehicles') && <FleetShowcase onSelectVehicle={setSelectedVehicle} />}
        {isSectionOn('tours') && <TourPackages onSelectTour={setSelectedTour} />}
        {isSectionOn('calculator') && <DistanceMap />}
        {isSectionOn('pricing') && <PricingTable />}
        {isSectionOn('offers') && <SpecialOffers />}
        {isSectionOn('reviews') && <Testimonials />}
        <ContactSection />
      </main>

      <TempleBorder />
      <Footer onOpenLegal={setLegalModalType} onOpenCredits={() => setShowCredits(true)} />

      {/* Quick Action Floating Controls */}
      <FloatingBar />
      <DemoEditsPill />

      {/* Modals */}
      <VehicleModal vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
      <TourModal tour={selectedTour} onClose={() => setSelectedTour(null)} />
      <LegalModal type={legalModalType} onClose={() => setLegalModalType(null)} />
      <PhotoCreditsModal isOpen={showCredits} onClose={() => setShowCredits(false)} />

    </div>
  );
};

export default App;
