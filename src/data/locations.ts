import type { RouteCoordinate } from '../types';

/**
 * =========================================================================
 * DISTANCE CALCULATOR — PICKUP & DESTINATION POINTS
 * =========================================================================
 * Locations offered in the route estimator dropdowns. The first entry is the
 * default pickup point and the third is the default destination.
 */

export const popularLocations: RouteCoordinate[] = [
  { name: 'Bhubaneswar City (Nayapalli / Master Canteen)', lat: 20.2961, lng: 85.8245, category: 'Odisha Core' },
  { name: 'Biju Patnaik Int\'l Airport (BBI), Bhubaneswar', lat: 20.2444, lng: 85.8178, category: 'Odisha Core' },
  { name: 'Puri Jagannath Dham & Sea Beach', lat: 19.8135, lng: 85.8312, category: 'Coastal' },
  { name: 'Konark Sun Temple & Chandrabhaga Beach', lat: 19.8876, lng: 86.0945, category: 'Heritage' },
  { name: 'Chilika Lake (Satapada Dolphin Point)', lat: 19.6738, lng: 85.4337, category: 'Coastal' },
  { name: 'Chilika Lake (Barkul OTDC Jetty / Kalijai)', lat: 19.6917, lng: 85.1950, category: 'Coastal' },
  { name: 'Cuttack Millennium City (High Court / Barabati)', lat: 20.4625, lng: 85.8828, category: 'Odisha Core' },
  { name: 'Dhauli Shanti Stupa (Peace Pagoda)', lat: 20.1925, lng: 85.8394, category: 'Heritage' },
  { name: 'Gopalpur-on-Sea (Ganjam Coast)', lat: 19.2600, lng: 84.9080, category: 'Coastal' },
  { name: 'Bhitarkanika National Park (Kendrapara)', lat: 20.7200, lng: 86.8700, category: 'Coastal' },
  { name: 'Similipal Tiger Reserve (Mayurbhanj)', lat: 21.9360, lng: 86.4260, category: 'Odisha Core' },
  { name: 'Kolkata, West Bengal (Interstate)', lat: 22.5726, lng: 88.3639, category: 'Outstation' },
  { name: 'Visakhapatnam, Andhra Pradesh (Interstate)', lat: 17.6868, lng: 83.2185, category: 'Outstation' },
  { name: 'Ranchi, Jharkhand (Interstate)', lat: 23.3441, lng: 85.3096, category: 'Outstation' }
];

/** Map centre used before a route is drawn (Bhubaneswar). */
export const MAP_CENTER: [number, number] = [20.2961, 85.8245];
