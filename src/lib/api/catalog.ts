import { PaginatedResponse, PropertyType, LandPlot, GenericProperty, FilterParams, LandCategory, LandUseType, Feature } from '@/types/catalog';
import { getApiBaseUrl } from './utils'; // Import the utility function

// Remove top-level constants for API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_VERSION_PREFIX = '/api/v1';

// Modify fetchAPI to use getApiBaseUrl
export async function fetchAPI<T>(endpoint: string, params?: URLSearchParams, options: RequestInit = {}): Promise<T> {
    const baseUrl = getApiBaseUrl(); // Get base URL dynamically
    // Construct the full URL. Assuming endpoint starts with /v1/...
    let url = `${baseUrl}${endpoint}`;
    if (params) {
        url += `?${params.toString()}`;
    }

    const env = typeof window === 'undefined' ? 'SERVER' : 'CLIENT';
    console.log(`Fetching [${env}]: ${url}`);

    try {
        const response = await fetch(url, {
            // headers: { ... },
            next: { revalidate: 60 },
            ...options
        });

        if (!response.ok) {
            let errorBody = 'Could not read error body'; 
            try {
                errorBody = await response.text(); 
            } catch (e) {
                console.error("Error reading response text:", e);
            } 
            console.error(`API Error (${response.status}): ${response.statusText}`, errorBody);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json() as T;
    } catch (error) {
        console.error(`Network or fetch error for ${url}: ${error}`);
        throw error;
    }
}

/**
 * Fetches the list of property types (excluding land plots).
 * Handles both direct array response and paginated object response.
 */
export async function getPropertyTypes(): Promise<PropertyType[]> {
    try {
        // Assuming endpoint is /api/v1/catalog/property-types/
        const data = await fetchAPI<PropertyType[] | PaginatedResponse<PropertyType> | any>('/v1/catalog/property-types/');

        // Check if it looks like a paginated response object and has a results array
        if (data && typeof data === 'object' && Array.isArray(data.results)) {
            console.log('getPropertyTypes: Received paginated response, returning results array.');
            return data.results as PropertyType[];
        }
        // Check if it's directly an array
        else if (Array.isArray(data)) {
            console.log('getPropertyTypes: Received direct array response.');
            return data;
        }
        // If it's neither, something is wrong with the API response format
        else {
            console.warn("getPropertyTypes received unexpected data format:", data);
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch property types:", error);
        return []; // Return empty array on error
    }
}

/**
 * Converts filter params object into URLSearchParams, handling array values.
 */
function buildFilterParams(filters: FilterParams): URLSearchParams {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
        if (value === undefined || value === null || value === '') continue;

        if (Array.isArray(value)) {
            // Join array values with commas for backend
            if (value.length > 0) {
                params.set(key, value.join(','));
            }
        } else {
            params.set(key, String(value));
        }
    }
    return params;
}

/**
 * Fetches a paginated list of land plots with filtering and sorting.
 */
export async function getLandPlots(filters: FilterParams): Promise<PaginatedResponse<LandPlot>> {
    const params = buildFilterParams(filters);
    try {
        // Endpoint should start with a slash
        return await fetchAPI<PaginatedResponse<LandPlot>>('/v1/catalog/land-plots/', params);
    } catch (error) {
        console.error("Failed to fetch land plots:", error);
        // Return a default empty response on error
        return { count: 0, next: null, previous: null, results: [] };
    }
}

/**
 * Fetches a paginated list of generic properties with filtering and sorting.
 * Requires the property_type slug in filters.
 */
export async function getGenericProperties(filters: FilterParams): Promise<PaginatedResponse<GenericProperty>> {
    if (!filters.property_type) {
        console.error("getGenericProperties requires a 'property_type' slug in filters.");
        // Return empty response if required filter is missing
        return { count: 0, next: null, previous: null, results: [] };
    }
    const params = buildFilterParams(filters);
    try {
        // Endpoint should start with a slash
        return await fetchAPI<PaginatedResponse<GenericProperty>>('/v1/catalog/properties/', params);
    } catch (error) {
        console.error("Failed to fetch generic properties:", error);
        return { count: 0, next: null, previous: null, results: [] };
    }
}

// --- Filter Option Fetching Functions (Ensure endpoints are correct) --- //

export async function getLandCategories(): Promise<LandCategory[]> {
    try {
        // Assuming endpoint is /api/v1/catalog/land-categories/
        const data = await fetchAPI<LandCategory[] | any>('/v1/catalog/land-categories/'); 
         if (data && typeof data === 'object' && Array.isArray(data.results)) {
            return data.results;
        } else if (Array.isArray(data)) {
            return data;
        }
        console.warn('getLandCategories received unexpected format:', data);
        return [];
    } catch (error) {
        console.error("Failed to fetch land categories:", error);
        return [];
    }
}

export async function getLandUseTypes(): Promise<LandUseType[]> {
     try {
        // Assuming endpoint is /api/v1/catalog/land-use-types/
        const data = await fetchAPI<LandUseType[] | any>('/v1/catalog/land-use-types/');
         if (data && typeof data === 'object' && Array.isArray(data.results)) {
            return data.results;
        } else if (Array.isArray(data)) {
            return data;
        }
        console.warn('getLandUseTypes received unexpected format:', data);
        return [];
    } catch (error) {
        console.error("Failed to fetch land use types:", error);
        return [];
    }
}

export async function getFeatures(): Promise<Feature[]> {
     try {
        // Assuming endpoint is /api/v1/catalog/features/
        const data = await fetchAPI<Feature[] | any>('/v1/catalog/features/');
         if (data && typeof data === 'object' && Array.isArray(data.results)) {
            return data.results;
        } else if (Array.isArray(data)) {
            return data;
        }
        console.warn('getFeatures received unexpected format:', data);
        return [];
    } catch (error) {
        console.error("Failed to fetch features:", error);
        return [];
    }
} 