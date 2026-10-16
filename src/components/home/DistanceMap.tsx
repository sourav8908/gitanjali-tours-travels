import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { calculateRoute } from '../../utils/routing';
import { popularLocations, MAP_CENTER } from '../../data/locations';
import { DEFAULT_FARE_CATEGORY } from '../../data/fareRates';
import type { RouteCoordinate, RouteResult } from '../../types';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { buildWhatsAppUrl } from '../../utils/enquiry';
import { Navigation, Calculator, MessageSquare, AlertCircle, RefreshCw, ArrowUpDown } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';

// Custom SVG map pin icons
const createPinIcon = (color: string) =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 22px; height: 22px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <div style="width: 6px; height: 6px; background-color: white; border-radius: 50%;"></div>
          </div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });

const originIcon = createPinIcon('#0B1F33'); // Brand Navy (Bhubaneswar Hub)
const destIcon = createPinIcon('#176B87');   // Ocean Blue

const DEFAULT_ORIGIN = popularLocations[0];
const DEFAULT_DESTINATION = popularLocations[2];

interface CalculatedRoute {
  key: string;
  origin: RouteCoordinate;
  destination: RouteCoordinate;
  result: RouteResult;
}

const selectClass =
  'w-full px-3.5 py-3 bg-brand-surface border border-slate-300 rounded-brand text-sm font-medium text-brand-navy focus:outline-none focus:border-brand-ocean transition-colors';

export const DistanceMap: React.FC = () => {
  const [origin, setOrigin] = useState<RouteCoordinate>(DEFAULT_ORIGIN);
  const [destination, setDestination] = useState<RouteCoordinate>(DEFAULT_DESTINATION);
  const [requestId, setRequestId] = useState(0);
  const [route, setRoute] = useState<CalculatedRoute | null>(null);
  const [selectedVehicleFare, setSelectedVehicleFare] = useState<string>(DEFAULT_FARE_CATEGORY);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // A route is "calculating" until the result for the current selection arrives
  const requestKey = `${origin.name}|${destination.name}|${requestId}`;
  const isCalculating = route?.key !== requestKey;
  const routeResult = route?.result ?? null;

  // Initialize Leaflet Map centered on Odisha
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: MAP_CENTER,
      zoom: 8,
      scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    layerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  // Fetch the route whenever the selection changes; ignore responses for stale selections
  useEffect(() => {
    let cancelled = false;
    calculateRoute(origin, destination).then((result) => {
      if (!cancelled) setRoute({ key: requestKey, origin, destination, result });
    });
    return () => {
      cancelled = true;
    };
  }, [origin, destination, requestKey]);

  // Draw markers and polyline for the calculated route
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup || !route) return;

    layerGroup.clearLayers();

    layerGroup.addLayer(
      L.marker([route.origin.lat, route.origin.lng], { icon: originIcon })
        .bindPopup(`<div style="font-size: 12px; font-family: sans-serif;"><strong>Pickup Hub:</strong> ${route.origin.name}</div>`)
    );

    layerGroup.addLayer(
      L.marker([route.destination.lat, route.destination.lng], { icon: destIcon })
        .bindPopup(`<div style="font-size: 12px; font-family: sans-serif;"><strong>Destination:</strong> ${route.destination.name}</div>`)
    );

    if (route.result.routeCoordinates.length > 0) {
      const polyline = L.polyline(route.result.routeCoordinates, {
        color: '#176B87',
        weight: 4,
        opacity: 0.85,
        lineJoin: 'round',
        dashArray: route.result.isApproximate ? '8 8' : undefined,
      });
      layerGroup.addLayer(polyline);
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    }
  }, [route]);

  const findLocation = (name: string, fallback: RouteCoordinate) =>
    popularLocations.find((l) => l.name === name) ?? fallback;

  const swapLocations = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const selectedFareObj =
    routeResult?.estimatedFares.find((f) => f.category === selectedVehicleFare) ??
    routeResult?.estimatedFares[0];

  return (
    <section id="calculator" className="py-20 bg-brand-surface border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          eyebrow="Odisha & Highway Route Estimator"
          title="Distance & Fare Calculator"
          description="Check road distance, drive time, and an estimated fare between Bhubaneswar, Puri, Konark, Chilika Lake, Cuttack, and outstation cities."
        />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Controls & Estimate Breakdown */}
          <div className="lg:col-span-5 space-y-6">

            {/* Input Selection Box */}
            <div className="bg-white p-6 rounded-brand-lg border border-slate-200 shadow-subtle space-y-4">
              <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                <Navigation className="w-4 h-4 text-brand-ocean" />
                <span>Select Route Points</span>
              </h3>

              <div>
                <label htmlFor="route-origin" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Starting point
                </label>
                <select
                  id="route-origin"
                  value={origin.name}
                  onChange={(e) => setOrigin(findLocation(e.target.value, DEFAULT_ORIGIN))}
                  className={selectClass}
                >
                  {popularLocations.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center -my-1">
                <button
                  type="button"
                  onClick={swapLocations}
                  className="p-2 rounded-full border border-slate-200 bg-white text-brand-ocean hover:bg-brand-ocean-light transition-colors"
                  aria-label="Swap starting point and destination"
                >
                  <ArrowUpDown className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label htmlFor="route-destination" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Destination
                </label>
                <select
                  id="route-destination"
                  value={destination.name}
                  onChange={(e) => setDestination(findLocation(e.target.value, DEFAULT_DESTINATION))}
                  className={selectClass}
                >
                  {popularLocations.map((loc) => (
                    <option key={loc.name} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setRequestId((id) => id + 1)}
                disabled={isCalculating}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-brand-navy hover:bg-brand-navy-light disabled:opacity-70 text-white rounded-brand text-sm font-semibold transition-colors"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Calculating route…</span>
                  </>
                ) : (
                  <>
                    <Calculator className="w-4 h-4 text-brand-gold" />
                    <span>Recalculate Route</span>
                  </>
                )}
              </button>
            </div>

            {/* Distance & Time Results */}
            {routeResult && (
              <div
                className={`bg-white p-6 rounded-brand-lg border border-slate-200 shadow-subtle space-y-5 transition-opacity ${
                  isCalculating ? 'opacity-60' : ''
                }`}
                aria-live="polite"
              >

                {/* Metrics Row */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100 text-center">
                  <div className="p-3 bg-brand-surface rounded-brand">
                    <span className="text-xs font-medium text-slate-500 block">Total Distance</span>
                    <span className="text-2xl font-bold font-display text-brand-navy">
                      {routeResult.isApproximate && '~'}{routeResult.distanceKm} km
                    </span>
                  </div>

                  <div className="p-3 bg-brand-surface rounded-brand">
                    <span className="text-xs font-medium text-slate-500 block">Drive Time</span>
                    <span className="text-2xl font-bold font-display text-brand-navy">
                      {formatDuration(routeResult.durationMinutes)}
                    </span>
                  </div>
                </div>

                {routeResult.isApproximate && (
                  <p className="text-xs text-slate-500 -mt-2">
                    Live road routing is unavailable right now, so this is an approximate distance. Call or WhatsApp us for an exact quote.
                  </p>
                )}

                {/* Estimated Fare by Indian Vehicle Models */}
                <div>
                  <p className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">
                    Estimated Fare by Car Model
                  </p>

                  <div className="space-y-2" role="radiogroup" aria-label="Vehicle for fare estimate">
                    {routeResult.estimatedFares.map((fare) => {
                      const isSelected = selectedFareObj?.category === fare.category;
                      return (
                        <button
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          key={fare.category}
                          onClick={() => setSelectedVehicleFare(fare.category)}
                          className={`w-full text-left p-3 rounded-brand border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-brand-ocean/5 border-brand-ocean shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span>
                            <span className="text-sm font-bold text-brand-navy block">{fare.modelExample}</span>
                            <span className="text-xs text-slate-500">Base tariff ₹{fare.ratePerKm}/km</span>
                          </span>
                          <span className="text-base font-bold text-brand-ocean">
                            {formatCurrency(fare.estimatedFare)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Clear Disclaimer */}
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-brand text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Estimate only:</strong> highway tolls, state border permits, and parking are charged on actual receipts. Your final quotation is confirmed at booking.
                  </span>
                </div>

                {/* WhatsApp Action with Pre-filled Route details */}
                <a
                  href={buildWhatsAppUrl({
                    pickup: routeResult.from,
                    destination: routeResult.to,
                    distanceKm: routeResult.distanceKm,
                    estimatedFare: selectedFareObj?.estimatedFare,
                    vehicleName: selectedFareObj?.modelExample
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-brand-gold hover:bg-brand-gold-dark text-brand-navy font-semibold text-sm rounded-brand shadow-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquire This Route on WhatsApp</span>
                </a>

              </div>
            )}

          </div>

          {/* Right: Leaflet Interactive Map */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 h-[380px] sm:h-[480px] lg:h-[calc(100vh-8rem)] lg:max-h-[720px] bg-white rounded-brand-lg border border-slate-200 overflow-hidden shadow-subtle relative">
            <div ref={mapContainerRef} className="w-full h-full" />

            {/* Map Legend Overlay */}
            <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm p-2.5 rounded-brand border border-slate-200 shadow-sm text-xs space-y-1 pointer-events-none">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-navy inline-block" />
                <span>Pickup</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-ocean inline-block" />
                <span>Destination</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
