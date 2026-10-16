import type { SpecialOffer } from '../types';

/**
 * =========================================================================
 * SPECIAL OFFERS & SEASONAL PROMOTIONS
 * =========================================================================
 * NOTE: The offers below are sample seasonal promotions for Odisha travel.
 * The business owner can edit promotional details, discounts, and validity periods here.
 */

export const offersData: SpecialOffer[] = [
  {
    id: 'offer-puri-round-trip',
    title: 'Puri & Konark Same-Day Round Trip Special',
    subtitle: 'Bhubaneswar ⇄ Dhauli ⇄ Konark ⇄ Puri',
    badge: 'Popular Route',
    discount: 'Bundled Day Tariff',
    description: 'Planning a same-day family trip to Puri Jagannath Dham and Konark Sun Temple? Enjoy all-inclusive fuel and toll package rates on Dzire and Ertiga.',
    validity: 'Available for weekday and weekend bookings from Bhubaneswar',
    terms: 'Valid on same-day return itineraries departing from and returning to Bhubaneswar within 12-14 hours.',
    isDemoData: true
  },
  {
    id: 'offer-early-bird',
    title: 'Advance Outstation Road Trip Benefit',
    subtitle: 'Plan Ahead for Holidays & Pilgrimages',
    badge: 'Advance Booking',
    discount: '5% OFF Base Vehicle Tariff',
    description: 'Book your outstation multi-day road trip to Chilika, Gopalpur, Koraput, Kolkata, or Visakhapatnam at least 7 days in advance to receive a concession on base per-km billing.',
    validity: 'Valid on outstation bookings of 300+ km',
    terms: 'Applicable on multi-day itineraries. Subject to vehicle availability during peak holiday seasons.',
    isDemoData: true
  },
  {
    id: 'offer-group-wedding',
    title: 'Odisha Wedding & Group Fleet Coordination',
    subtitle: 'Multi-Vehicle Booking Package',
    badge: 'Group Travel',
    discount: 'Custom Multi-Car Rates',
    description: 'Organizing travel for marriage parties, religious pilgrimages, or corporate group delegations requiring multiple Innova Crystas, Ertigas, or 17-seater Tempo Travellers.',
    validity: 'Contact booking desk for personalized multi-vehicle schedule',
    terms: 'Dedicated coordinator assigned for punctual guest transfers between airport, hotels, and wedding venues.',
    isDemoData: true
  }
];
