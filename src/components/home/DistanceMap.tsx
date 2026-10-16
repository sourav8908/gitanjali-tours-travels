import React, { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AlertCircle, ArrowDownUp, ChevronDown, Clock, MessageSquare, Minus, Plus, Repeat, Route, X } from 'lucide-react';
import { calculateRoute } from '../../utils/routing';
import { popularLocations, MAP_CENTER } from '../../data/locations';
import { DEFAULT_FARE_CATEGORY, DEFAULT_PRICING_MODE, enabledPricingModes, fareConfig, fareRates } from '../../data/fareRates';
import type { PricingMode, RouteCoordinate, RouteResult } from '../../types';
import { formatCurrency, formatDuration } from '../../utils/formatters';
import { pricingModeHint, pricingModeLabel, quoteFare, suggestedHours } from '../../utils/fares';
import { buildWhatsAppUrl } from '../../utils/enquiry';
import { SectionHeader } from '../ui/SectionHeader';

const MAX_STOPS = 6;
const NAVY = '#0B1F33';
const GOLD = '#D6A756';
const OCEAN = '#176B87';

/** Round map pin with a short label (S, 1, 2…, D). */
const labeledPin = (label: string, background: string, color = '#fff') =>
  L.divIcon({
    className: '',
    html: `<div style="background:${background};color:${color};width:28px;height:28px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font:700 12px 'Plus Jakarta Sans',sans-serif">${label}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

const findLocation = (name: string) => popularLocations.find((l) => l.name === name) ?? popularLocations[0];

const selectClass =
  'w-full px-3.5 py-2.5 bg-brand-surface border border-slate-300 rounded-brand text-sm font-medium text-brand-navy focus:outline-none focus:border-brand-ocean transition-colors';

interface CalculatedRoute {
  key: string;
  points: RouteCoordinate[];
  result: RouteResult;
}

/** One stop in the trip timeline: a marker dot, a label and a location dropdown. */
const TripPoint: React.FC<{
  id: string;
  label: string;
  marker: React.ReactNode;
  value: RouteCoordinate;
  onChange: (loc: RouteCoordinate) => void;
  onRemove?: () => void;
  isLast?: boolean;
}> = ({ id, label, marker, value, onChange, onRemove, isLast }) => (
  <li className="relative flex gap-3 pb-4">
    {!isLast && <span className="absolute left-[13px] top-8 bottom-0 w-0.5 bg-slate-200" aria-hidden="true" />}
    <span className="relative z-10 mt-6 shrink-0">{marker}</span>
    <div className="flex-1 min-w-0">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      <div className="flex items-center gap-1.5">
        <select id={id} value={value.name} onChange={(e) => onChange(findLocation(e.target.value))} className={selectClass}>
          {popularLocations.map((loc) => (
            <option key={loc.name} value={loc.name}>{loc.name}</option>
          ))}
        </select>
        {onRemove && (
          <button type="button" onClick={onRemove} className="p-2 rounded-brand text-slate-400 hover:text-red-600 hover:bg-red-50" aria-label={`Remove ${label}`}>
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  </li>
);

const dot = (label: string, bg: string, fg = 'text-white') => (
  <span className={`flex w-7 h-7 items-center justify-center rounded-full ${bg} ${fg} text-xs font-bold ring-4 ring-white`}>{label}</span>
);

export const DistanceMap: React.FC = () => {
  const [start, setStart] = useState<RouteCoordinate>(popularLocations[0]);
  const [stops, setStops] = useState<RouteCoordinate[]>([]);
  const [destination, setDestination] = useState<RouteCoordinate>(popularLocations[2] ?? popularLocations[1]);
  const [roundTrip, setRoundTrip] = useState(false);
  const [route, setRoute] = useState<CalculatedRoute | null>(null);
  const [mode, setMode] = useState<PricingMode>(DEFAULT_PRICING_MODE);
  // Hours chosen by the customer for a specific trip; ignored once the trip changes
  const [hoursChoice, setHoursChoice] = useState<{ key: string; hours: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_FARE_CATEGORY);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const points = useMemo(
    () => [start, ...stops, destination, ...(roundTrip ? [start] : [])],
    [start, stops, destination, roundTrip]
  );
  const requestKey = points.map((p) => p.name).join(' → ');
  const isCalculating = route?.key !== requestKey;
  const result = route?.result ?? null;

  const suggested = result ? suggestedHours(result.durationMinutes, stops.length, fareConfig.stopWaitMinutes) : 1;
  const hours = hoursChoice?.key === requestKey ? hoursChoice.hours : suggested;
  const setHours = (h: number) => setHoursChoice({ key: requestKey, hours: Math.min(72, Math.max(1, h)) });

  // Map setup
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const map = L.map(mapContainerRef.current, { center: MAP_CENTER, zoom: 8, scrollWheelZoom: false });
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

  // Fetch the route whenever the trip changes; ignore responses for stale trips
  useEffect(() => {
    let cancelled = false;
    calculateRoute(points).then((res) => {
      if (!cancelled) setRoute({ key: requestKey, points, result: res });
    });
    return () => {
      cancelled = true;
    };
  }, [points, requestKey]);

  // Draw the route and numbered pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layers = layerGroupRef.current;
    if (!map || !layers || !route) return;
    layers.clearLayers();

    const { points: pts, result: res } = route;
    const isRound = pts.length > 2 && pts[0].name === pts[pts.length - 1].name;
    // A round trip repeats the start at the end; pin it once
    const visible = isRound ? pts.slice(0, -1) : pts;
    visible.forEach((p, i) => {
      const isStart = i === 0;
      const isEnd = i === visible.length - 1 && i > 0;
      const icon = isStart
        ? labeledPin(isRound ? '↺' : 'S', NAVY)
        : isEnd
          ? labeledPin('D', OCEAN)
          : labeledPin(String(i), GOLD, NAVY);
      const title = isStart ? 'Start' : isEnd ? 'Destination' : `Stop ${i}`;
      layers.addLayer(
        L.marker([p.lat, p.lng], { icon }).bindPopup(
          `<div style="font-size:12px;font-family:sans-serif"><strong>${title}:</strong> ${escapeHtml(p.name)}</div>`
        )
      );
    });

    if (res.routeCoordinates.length > 1) {
      const line = L.polyline(res.routeCoordinates, {
        color: OCEAN,
        weight: 4,
        opacity: 0.85,
        lineJoin: 'round',
        dashArray: res.isApproximate ? '8 8' : undefined,
      });
      layers.addLayer(line);
      map.fitBounds(line.getBounds(), { padding: [40, 40] });
    }
  }, [route]);

  const reverseTrip = () => {
    setStart(destination);
    setDestination(start);
    setStops([...stops].reverse());
  };

  const quotes = result
    ? fareRates.map((rate) => ({ rate, quote: quoteFare(rate, mode, result.distanceKm, hours, fareConfig) }))
    : [];
  const selected = quotes.find((q) => q.rate.category === selectedCategory) ?? quotes[0];
  const usesHours = mode === 'perHour' || mode === 'package';

  return (
    <section id="calculator" className="py-20 bg-brand-surface border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader
          eyebrow="Trip Planner"
          title="Plan Your Route & Estimate the Fare"
          description="Choose where to start, add any stops on the way, pick your destination, and see the distance and an estimated fare for each vehicle."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-5 space-y-6">

            {/* Trip builder */}
            <div className="bg-white p-5 sm:p-6 rounded-brand-lg border border-slate-200 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                  <Route className="w-4 h-4 text-brand-ocean" /> Your trip
                </h3>
                <button type="button" onClick={reverseTrip}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-navy px-2 py-1 rounded-brand hover:bg-slate-100">
                  <ArrowDownUp className="w-3.5 h-3.5" /> Reverse
                </button>
              </div>

              <ol>
                <TripPoint id="trip-start" label="Start from" marker={dot('S', 'bg-brand-navy')} value={start} onChange={setStart} />
                {stops.map((stop, i) => (
                  <TripPoint
                    key={i}
                    id={`trip-stop-${i}`}
                    label={`Stop ${i + 1}`}
                    marker={dot(String(i + 1), 'bg-brand-gold', 'text-brand-navy')}
                    value={stop}
                    onChange={(loc) => setStops(stops.map((s, j) => (j === i ? loc : s)))}
                    onRemove={() => setStops(stops.filter((_, j) => j !== i))}
                  />
                ))}
                <li className="relative flex gap-3 pb-4">
                  <span className="absolute left-[13px] top-0 bottom-0 w-0.5 bg-slate-200" aria-hidden="true" />
                  <span className="w-7 shrink-0" />
                  <button
                    type="button"
                    onClick={() => setStops([...stops, popularLocations[Math.min(stops.length + 3, popularLocations.length - 1)]])}
                    disabled={stops.length >= MAX_STOPS}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-ocean border border-dashed border-brand-ocean/40 rounded-brand hover:bg-brand-ocean-light disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" /> {stops.length ? 'Add another stop' : 'Add a stop on the way'}
                  </button>
                </li>
                <TripPoint id="trip-destination" label="Final destination" marker={dot('D', 'bg-brand-ocean')} value={destination} onChange={setDestination} isLast />
              </ol>

              <label className="mt-2 flex items-center justify-between gap-3 p-3 rounded-brand bg-brand-surface border border-slate-200 cursor-pointer">
                <span className="flex items-center gap-2.5">
                  <Repeat className="w-4 h-4 text-brand-ocean" />
                  <span>
                    <span className="block text-sm font-semibold text-brand-navy">Return to start</span>
                    <span className="block text-xs text-slate-500">Round trip back to {start.name.split(' (')[0]}</span>
                  </span>
                </span>
                <input type="checkbox" checked={roundTrip} onChange={(e) => setRoundTrip(e.target.checked)}
                  className="w-5 h-5 accent-[#176B87]" />
              </label>
            </div>

            {/* Results */}
            {result && (
              <div className={`bg-white p-5 sm:p-6 rounded-brand-lg border border-slate-200 shadow-subtle space-y-5 transition-opacity ${isCalculating ? 'opacity-60' : ''}`}
                aria-live="polite" aria-busy={isCalculating}>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-brand-surface rounded-brand">
                    <span className="text-[11px] font-medium text-slate-500 block">Distance</span>
                    <span className="text-xl font-bold font-display text-brand-navy">{result.isApproximate && '~'}{result.distanceKm} km</span>
                  </div>
                  <div className="p-3 bg-brand-surface rounded-brand">
                    <span className="text-[11px] font-medium text-slate-500 block">Drive time</span>
                    <span className="text-xl font-bold font-display text-brand-navy">{formatDuration(result.durationMinutes)}</span>
                  </div>
                  <div className="p-3 bg-brand-surface rounded-brand">
                    <span className="text-[11px] font-medium text-slate-500 block">Stops</span>
                    <span className="text-xl font-bold font-display text-brand-navy">{stops.length}</span>
                  </div>
                </div>

                {result.legs.length > 1 && (
                  <details className="group rounded-brand border border-slate-200">
                    <summary className="flex items-center justify-between px-3 py-2.5 text-sm font-semibold text-brand-navy cursor-pointer list-none">
                      Route details · {result.legs.length} legs
                      <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                    </summary>
                    <ol className="px-3 pb-3 space-y-2">
                      {result.legs.map((leg, i) => (
                        <li key={i} className="flex items-start justify-between gap-3 text-xs">
                          <span className="text-slate-600">
                            <span className="font-semibold text-brand-navy">{i + 1}.</span> {leg.from.split(' (')[0]} → {leg.to.split(' (')[0]}
                          </span>
                          <span className="shrink-0 font-semibold text-slate-700">{leg.distanceKm} km · {formatDuration(leg.durationMinutes)}</span>
                        </li>
                      ))}
                    </ol>
                  </details>
                )}

                {result.isApproximate && (
                  <p className="text-xs text-slate-500">Live road routing is unavailable right now, so distances are approximate. Call or WhatsApp us for an exact quote.</p>
                )}

                {/* Pricing option */}
                {enabledPricingModes.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-brand-navy uppercase tracking-wider mb-2">How would you like to pay?</p>
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${enabledPricingModes.length}, minmax(0, 1fr))` }} role="radiogroup" aria-label="Pricing option">
                      {enabledPricingModes.map((m) => (
                        <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)}
                          className={`px-2 py-2.5 rounded-brand text-xs font-semibold border transition-colors ${
                            mode === m ? 'bg-brand-navy text-white border-brand-navy' : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}>
                          {m === 'package' ? 'Hours + km' : pricingModeLabel(m)}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">{pricingModeHint(mode)}</p>
                  </div>
                )}

                {usesHours && (
                  <div className="flex items-center justify-between gap-3 p-3 rounded-brand bg-brand-surface border border-slate-200">
                    <span className="flex items-start gap-2">
                      <Clock className="w-4 h-4 text-brand-ocean mt-0.5" />
                      <span>
                        <span className="block text-sm font-semibold text-brand-navy">Hours of hire</span>
                        <span className="block text-[11px] text-slate-500">
                          Suggested {suggested} hr: drive time{stops.length ? ` + ${fareConfig.stopWaitMinutes} min at each stop` : ''}
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <button type="button" onClick={() => setHours(hours - 1)} disabled={hours <= 1}
                        className="w-8 h-8 flex items-center justify-center rounded-brand border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40" aria-label="Fewer hours">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-14 text-center text-sm font-bold text-brand-navy" aria-live="polite">{hours} hr</span>
                      <button type="button" onClick={() => setHours(hours + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-brand border border-slate-300 bg-white hover:bg-slate-50" aria-label="More hours">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </div>
                )}

                {/* Vehicle quotes */}
                <div className="space-y-2" role="radiogroup" aria-label="Vehicle">
                  {quotes.map(({ rate, quote }) => {
                    const isSelected = selected?.rate.category === rate.category;
                    return (
                      <button key={rate.category} type="button" role="radio" aria-checked={isSelected}
                        onClick={() => setSelectedCategory(rate.category)}
                        className={`w-full text-left p-3 rounded-brand border transition-all flex items-center justify-between gap-3 ${
                          isSelected ? 'bg-brand-ocean/5 border-brand-ocean shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}>
                        <span className="min-w-0">
                          <span className="text-sm font-bold text-brand-navy block">{rate.modelExample}</span>
                          <span className="text-[11px] text-slate-500 block">{quote.breakdown}</span>
                        </span>
                        <span className="text-base font-bold text-brand-ocean shrink-0">{formatCurrency(quote.fare)}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-brand text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Estimate only:</strong> tolls, state permits and parking are extra on actual receipts. Your final quotation is confirmed at booking.</span>
                </div>

                {selected && (
                  <a
                    href={buildWhatsAppUrl({
                      pickup: start.name,
                      stops: stops.map((s) => s.name),
                      destination: destination.name,
                      roundTrip,
                      distanceKm: result.distanceKm,
                      vehicleName: selected.rate.modelExample,
                      pricing: `${pricingModeLabel(mode, selected.rate)}${usesHours ? ` · ${hours} hr` : ''}`,
                      estimatedFare: selected.quote.fare,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 bg-brand-gold hover:bg-brand-gold-dark text-brand-navy font-semibold text-sm rounded-brand shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Enquire this trip on WhatsApp</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 h-[380px] sm:h-[480px] lg:h-[calc(100vh-8rem)] lg:max-h-[720px] bg-white rounded-brand-lg border border-slate-200 overflow-hidden shadow-subtle relative">
            <div ref={mapContainerRef} className="w-full h-full" />
            <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-sm p-2.5 rounded-brand border border-slate-200 shadow-sm text-xs space-y-1 pointer-events-none">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-navy" /> Start</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-gold" /> Stops</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-brand-ocean" /> Destination</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
