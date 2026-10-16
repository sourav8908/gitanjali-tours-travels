import type { RouteCoordinate, RouteLeg, RouteResult } from '../types';

const OSRM_TIMEOUT_MS = 6000;
/** Straight-line to road distance multiplier for the Odisha highway network. */
const ROAD_FACTOR = 1.25;
/** Average highway speed (km/h) used when the router is unavailable. */
const FALLBACK_AVG_SPEED_KMH = 52;
const FALLBACK_MIN_LEG_KM = 5;

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

const summarise = (legs: RouteLeg[], routeCoordinates: [number, number][], isApproximate: boolean): RouteResult => ({
  legs,
  distanceKm: legs.reduce((sum, l) => sum + l.distanceKm, 0),
  durationMinutes: legs.reduce((sum, l) => sum + l.durationMinutes, 0),
  routeCoordinates,
  isApproximate,
});

/**
 * Driving route through every point in order (start, stops…, destination,
 * and back to start for a round trip), from the public OSRM router, with a
 * straight-line fallback when it's unavailable.
 */
export async function calculateRoute(points: RouteCoordinate[]): Promise<RouteResult> {
  try {
    const coords = points.map((p) => `${p.lng},${p.lat}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal: AbortSignal.timeout(OSRM_TIMEOUT_MS) });

    if (response.ok) {
      const data = await response.json();
      const route = data.routes?.[0];
      if (route?.legs?.length === points.length - 1) {
        const legs: RouteLeg[] = route.legs.map((leg: { distance: number; duration: number }, i: number) => ({
          from: points[i].name,
          to: points[i + 1].name,
          distanceKm: Math.round(leg.distance / 1000),
          durationMinutes: Math.round(leg.duration / 60),
        }));
        // Leaflet requires [lat, lng]
        const coordinates: [number, number][] = route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]]
        );
        return summarise(legs, coordinates, false);
      }
    }
  } catch {
    // If the external router is unavailable, fall back to highway estimates
  }

  const legs: RouteLeg[] = points.slice(1).map((to, i) => {
    const from = points[i];
    const same = from.lat === to.lat && from.lng === to.lng;
    const distanceKm = same ? 0 : Math.max(FALLBACK_MIN_LEG_KM, calculateHaversineDistance(from.lat, from.lng, to.lat, to.lng));
    return { from: from.name, to: to.name, distanceKm, durationMinutes: Math.round((distanceKm / FALLBACK_AVG_SPEED_KMH) * 60) };
  });
  // Straight segments between points
  const coordinates: [number, number][] = points.map((p) => [p.lat, p.lng]);
  return summarise(legs, coordinates, true);
}
