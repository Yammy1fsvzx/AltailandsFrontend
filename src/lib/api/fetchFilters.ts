import { LandUseType, Feature, LandCategory, PriceAreaRange } from "@/types/filters";
import { getApiBaseUrl } from './utils'; // Import the utility function

// Remove top-level constants for API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_VERSION_PREFIX = "/api/v1";
const REVALIDATE_TIME = 3600; // Revalidate filter options every hour

/**
 * Helper function to fetch data with error handling and revalidation.
 * Uses getApiBaseUrl for dynamic URL resolution.
 */
async function fetchData<T>(endpoint: string, defaultValue: T): Promise<T> {
  const baseUrl = getApiBaseUrl(); // Get base URL dynamically
  // Construct the full URL. Assuming endpoint starts with /v1/...
  const url = `${baseUrl}${endpoint}`;
  const env = typeof window === 'undefined' ? 'SERVER' : 'CLIENT';
  console.log(`Fetching filter data from [${env}]: ${url}`);

  try {
    const response = await fetch(url, { next: { revalidate: REVALIDATE_TIME } });
    if (!response.ok) {
      console.error(`Error fetching ${endpoint}: ${response.status} ${response.statusText}`);
      try { // Attempt to log error body
          const errorBody = await response.json();
          console.error(`Error body for ${endpoint}:`, JSON.stringify(errorBody, null, 2));
      } catch (e) { /* Ignore if body isn't JSON */ }
      return defaultValue;
    }
    const data = await response.json();
    // Basic check if the expected data structure is returned
    if (Array.isArray(defaultValue) && !Array.isArray(data)) {
       console.error(`Unexpected data structure from ${endpoint}. Expected array, got:`, typeof data);
       return defaultValue;
    }
     if (!Array.isArray(defaultValue) && (typeof data !== 'object' || data === null || Array.isArray(data)) ) {
       console.error(`Unexpected data structure from ${endpoint}. Expected object, got:`, typeof data);
       return defaultValue;
    }
    return data as T;
  } catch (error) {
    console.error(`Failed to fetch ${endpoint}:`, error);
    return defaultValue;
  }
}

/**
 * Fetches available land use types (VRI) from the API.
 */
export async function fetchLandUseTypes(): Promise<LandUseType[]> {
  // Corrected endpoint should start with /v1/...
  return fetchData<LandUseType[]>('/v1/listings/land-use-types/', []);
}

/**
 * Fetches available features/communications from the API.
 */
export async function fetchFeatures(): Promise<Feature[]> {
  // Corrected endpoint should start with /v1/...
  return fetchData<Feature[]>('/v1/listings/features/', []);
}

/**
 * Fetches available land categories from the API.
 */
export async function fetchLandCategories(): Promise<LandCategory[]> {
  // Corrected endpoint should start with /v1/...
  return fetchData<LandCategory[]>('/v1/listings/land-categories/', []);
}

/**
 * Fetches the min/max price and area for land plots.
 * NOTE: API endpoint for ranges not found. Returning default values.
 */
export async function fetchPriceAreaRange(): Promise<PriceAreaRange> {
  console.warn("API endpoint for price/area ranges not found. Using default values.");
  const defaultRange: PriceAreaRange = {
    price_min: 0,
    price_max: 50000000, 
    area_min: 0,
    area_max: 1000, 
  };
  // Simply return defaults without fetching
  return Promise.resolve(defaultRange);
} 