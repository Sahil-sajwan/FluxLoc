import * as h3 from 'h3-js';

// Default H3 resolution 8 (approx ~0.7 km^2 area per hexagon, ~460m edge length)
const DEFAULT_RESOLUTION = 8;

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Convert Latitude and Longitude to H3 Index string
 */
export const latLngToH3Index = (lat: number, lng: number, resolution: number = DEFAULT_RESOLUTION): string => {
  return h3.latLngToCell(lat, lng, resolution);
};

/**
 * Get neighboring H3 hexes within k-ring distance
 * kRing=1 gives immediate neighbors, kRing=7 roughly covers ~10km radius for resolution 8
 */
export const getNearbyH3Cells = (h3Index: string, kRingDistance: number = 7): string[] => {
  return h3.gridDisk(h3Index, kRingDistance);
};

/**
 * Get center Lat/Lng from H3 index
 */
export const h3ToLatLng = (h3Index: string): LatLng => {
  const [lat, lng] = h3.cellToLatLng(h3Index);
  return { lat, lng };
};
