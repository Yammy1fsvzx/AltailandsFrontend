import { ListingDetail, LandPlotDetail, PropertyDetail } from "@/types/catalog";
import { getApiBaseUrl } from './utils';

// Function to fetch details for a single listing
export async function getListingDetails(
  categorySlug: string,
  listingId: string
): Promise<ListingDetail | null> {
  const baseUrl = getApiBaseUrl(); // Use the imported or defined function
  let endpoint: string;

  // Determine the correct endpoint based on category slug
  // Ensure these endpoints start with /v1/...
  if (categorySlug === 'land-plots') {
    endpoint = `/v1/catalog/land-plots/${listingId}/`;
  } else {
    // Assume other slugs map to the generic properties endpoint
    endpoint = `/v1/catalog/properties/${listingId}/`;
  }

  // Construct the URL correctly: baseUrl already contains /api
  const url = `${baseUrl}${endpoint}`;
  const env = typeof window === 'undefined' ? 'SERVER' : 'CLIENT';
  console.log(`Fetching listing details from [${env}]: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Listing not found at ${url}`);
        return null; // Return null for 404 Not Found
      } else {
        // Log other errors
        console.error(`API error fetching ${url}: ${response.status} ${response.statusText}`);
        // Consider throwing an error or returning null based on desired behavior
        // throw new Error(`Failed to fetch listing details: ${response.statusText}`);
        return null; // Return null for other errors for now
      }
    }

    const data: ListingDetail = await response.json();
    return data;

  } catch (error) {
    console.error(`Network or other error fetching ${url}:`, error);
    return null; // Return null on network or parsing errors
  }
} 