// import { LandPlot, Listing, PaginatedListingResponse } from "@/types/listings"; // Убираем импорт
import { getApiBaseUrl } from './utils'; // Import the utility function

// Remove top-level constants for API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_VERSION_PREFIX = "/api/v1";

interface FetchListingsParams {
  page?: number;
  limit?: number;
  ordering?: string;
  [key: string]: any; // Allow other params
}

// Use 'any' for now as original types were commented out
interface FetchListingsResponse {
  listings: any[];
  count: number;
}

// Modify fetchListingsAPI helper
async function fetchListingsAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const baseUrl = getApiBaseUrl(); // Get base URL dynamically
    // Construct the full URL. Assuming endpoint starts with /v1/...
    const url = `${baseUrl}${endpoint}`;
    const env = typeof window === 'undefined' ? 'SERVER' : 'CLIENT';
    console.log(`Fetching listings from [${env}]: ${url}`);

    try {
        const response = await fetch(url, {
            next: { revalidate: 60 }, // Revalidate every minute
            ...options,
        });
        if (!response.ok) {
             console.error(`Listings API Error (${response.status}): ${response.statusText}`);
             try { const errorBody = await response.text(); console.error("Error body:", errorBody); } catch (e) {}
             throw new Error(`Listings API Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Network or fetch error for ${url}: ${error}`);
        throw error;
    }
}

/**
 * Fetches a list of land plot listings based on parameters.
 * Now uses the modified fetchListingsAPI helper.
 */
export async function fetchLandPlotListings({
  page = 1,
  limit = 9,
  ordering = '-created_at',
  ...otherFilters // Capture any other filter params
}: FetchListingsParams): Promise<FetchListingsResponse> {

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(), // Assuming backend uses 'limit'
    ordering: ordering,
  });

  // Add other filters to queryParams
  Object.entries(otherFilters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.set(key, String(value));
    }
  });

  // Correct endpoint starts with /v1/...
  const endpoint = `/v1/listings/land-plots/?${queryParams.toString()}`;

  try {
    // Use the helper function instead of direct fetch
    const data = await fetchListingsAPI<any>(endpoint); // Use any if PaginatedResponse type is complex

    if (data && Array.isArray(data.results) && typeof data.count === 'number') {
      return { listings: data.results, count: data.count };
    } else {
      console.warn('Unexpected API response format for land plots:', data);
      if (Array.isArray(data)) {
         return { listings: data, count: data.length };
      }
      return { listings: [], count: 0 };
    }
  } catch (error) {
    // Error is already logged in fetchListingsAPI
    // console.error('An unexpected error occurred while fetching land plots:', error);
    return { listings: [], count: 0 }; // Return empty state on network/parsing error
  }
}

// Functions below (fetchRecommendedListings, fetchListingById) should now work correctly
// as they use the updated fetchListingsAPI. Ensure their endpoints start with /v1/...

// Example: Ensure endpoint starts with /v1/...
export async function fetchRecommendedListings(): Promise<any[]> {
    try {
        const data = await fetchListingsAPI<any[] | { results: any[] }>('/v1/listings/recommended/');
         // Обработка как массива, так и объекта пагинации
        if (Array.isArray(data)) {
            return data;
        } else if (data && Array.isArray(data.results)) {
            return data.results;
        } else {
            console.warn("Received unexpected format for recommended listings:", data);
            return [];
        }
    } catch (error) {
        console.error("Failed to fetch recommended listings:", error);
        return []; // Return empty array on error
    }
}

// Функция для получения одного объявления по ID
export async function fetchListingById(id: number | string): Promise<any | null> {
    try {
        // Ensure endpoint starts with /v1/...
        return await fetchListingsAPI<any>(`/v1/listings/${id}/`);
    } catch (error) {
         // Ошибки (включая 404) будут залогированы в fetchListingsAPI
         console.error(`Failed to fetch listing with ID ${id}:`, error);
         return null; // Return null on any error (including 404)
    }
}

// You can add fetchComplexes function here later if needed 