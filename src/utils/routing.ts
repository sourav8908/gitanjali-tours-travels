import type { RouteCoordinate, RouteResult } from '../types';
import { fareRates, LONG_TRIP_THRESHOLD_KM } from '../data/fareRates';

const OSRM_TIMEOUT_MS = 4000;
/** Straight-line to road distance multiplier for the Odisha highway network. */
const ROAD_FACTOR = 1.25;
/** Average highway speed (km/h) used when the router is unavailable. */
const FALLBACK_AVG_SPEED_KMH = 52;
const FALLBACK_MIN_DISTANCE_KM = 12;

/**
 * Calculates approximate road distance using the Haversine formula (km)
 */
export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * ROAD_FACTOR);
}

/**
 * Fetches driving route from OSRM public API with fallback to Haversine
 */
export async function calculateRoute(
  origin: RouteCoordinate,
  destination: RouteCoordinate
): Promise<RouteResult> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal: AbortSignal.timeout(OSRM_TIMEOUT_MS) });

    if (response.ok) {
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = Math.round(route.distance / 1000);
        const durationMinutes = Math.round(route.duration / 60);

        // Leaflet requires [lat, lng]
        const coordinates: [number, number][] = route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]]
        );

        return createRouteResult(origin.name, destination.name, distanceKm, durationMinutes, coordinates, false);
      }
    }
  } catch {
    // If external router is unavailable, fall back to highway calculations
  }

  // Graceful fallback
  const distanceKm = Math.max(
    FALLBACK_MIN_DISTANCE_KM,
    calculateHaversineDistance(origin.lat, origin.lng, destination.lat, destination.lng)
  );
  const durationMinutes = Math.round((distanceKm / FALLBACK_AVG_SPEED_KMH) * 60);

  // Interpolate intermediate line coordinates
  const steps = 12;
  const coordinates: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const factor = i / steps;
    coordinates.push([
      origin.lat + (destination.lat - origin.lat) * factor,
      origin.lng + (destination.lng - origin.lng) * factor
    ]);
  }

  return createRouteResult(origin.name, destination.name, distanceKm, durationMinutes, coordinates, true);
}

function createRouteResult(
  from: string,
  to: string,
  distanceKm: number,
  durationMinutes: number,
  routeCoordinates: [number, number][],
  isApproximate: boolean
): RouteResult {
  const isLongTrip = distanceKm > LONG_TRIP_THRESHOLD_KM;

  const estimatedFares = fareRates.map((rate) => ({
    category: rate.category,
    vehicleName: rate.vehicleName,
    modelExample: rate.modelExample,
    ratePerKm: rate.ratePerKm,
    baseKm: distanceKm,
    estimatedFare: Math.round(
      Math.max(distanceKm, rate.minBillableKm) * rate.ratePerKm +
        (isLongTrip ? rate.longTripAllowance : 0)
    )
  }));

  return {
    from,
    to,
    distanceKm,
    durationMinutes,
    routeCoordinates,
    estimatedFares,
    isApproximate
  };
}
