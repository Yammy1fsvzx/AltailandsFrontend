import { ContactInfo } from "@/types/contacts";
import { PaginatedResponse } from "@/types/catalog";
import { getApiBaseUrl } from './utils'; // Import the shared utility function

// Function to fetch contact information
export async function getContacts(): Promise<ContactInfo | null> {
  const baseUrl = getApiBaseUrl(); // Use the imported function
  // Ensure endpoint starts with /v1/
  const endpoint = `/v1/contacts/contacts/`;
  const url = `${baseUrl}${endpoint}`;
  const env = typeof window === 'undefined' ? 'SERVER' : 'CLIENT';
  console.log(`Fetching contacts from [${env}]: ${url}`);

  try {
    // Use cache: 'no-store' if contacts change often and need to be fresh on client
    // Or adjust revalidation if fetching server-side and passing down
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'force-cache', // Cache results aggressively as contacts likely don't change often
      // next: { revalidate: 86400 } // Or revalidate daily if using next options
    });

    if (!response.ok) {
      console.error(`API error fetching ${url}: ${response.status} ${response.statusText}`);
      return null; 
    }

    const data: PaginatedResponse<ContactInfo> = await response.json();
    
    // Return the first contact object from the results array, or null if empty
    return data.results && data.results.length > 0 ? data.results[0] : null;

  } catch (error) {
    console.error(`Network or other error fetching ${url}:`, error);
    return null; 
  }
} 