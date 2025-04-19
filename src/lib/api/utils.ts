/**
 * Determines the correct API base URL based on the execution environment (server or client).
 * Reads NEXT_PUBLIC_API_URL for client-side and INTERNAL_API_URL for server-side.
 * Removes trailing slashes from the URLs.
 */
export function getApiBaseUrl(): string {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    const internalUrl = process.env.INTERNAL_API_URL;
    if (!internalUrl) {
      console.warn("INTERNAL_API_URL is not defined! Falling back to default.");
      return 'http://nginx/api'; // Default internal URL (without trailing slash)
    }
    return internalUrl.replace(/\/$/, ''); // Remove trailing slash
  } else {
    const publicUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!publicUrl) {
      console.warn("NEXT_PUBLIC_API_URL is not defined! Falling back to relative path.");
      return '/api'; // Fallback to relative path (without trailing slash)
    }
    return publicUrl.replace(/\/$/, ''); // Remove trailing slash
  }
}

/**
 * Converts backend image URLs (potentially http://localhost/media/... or http://nginx/media/...)
 * into the canonical absolute URL using the internal hostname (http://nginx/media/...)
 * suitable for the Next.js Image component and configured remotePatterns.
 */
export function getPublicImageUrl(url: string | undefined | null): string | null {
  if (!url) return null;

  const internalMediaBase = 'http://nginx'; // Target base URL for Next.js optimizer
  let relativePath: string | null = null;

  // Define potential source URL structures
  const sourceHostHttp = 'http://localhost'; // Source URL base on client-side fetch
  const sourceHostNginx = 'http://nginx';    // Source URL base on server-side fetch

  try {
    // --- Step 1: Extract relativePath (/media/...) from known formats ---
    if (url.startsWith(sourceHostNginx + '/media/')) {
      // Input: http://nginx/media/...
      relativePath = url.substring(sourceHostNginx.length); // -> /media/...
    } else if (url.startsWith(sourceHostHttp + '/media/')) {
      // Input: http://localhost/media/...
      relativePath = url.substring(sourceHostHttp.length); // -> /media/...
    } else if (url.startsWith('/media/')) {
       // Input: /media/...
      relativePath = url;
    } else {
      // Handle unexpected formats or potentially external URLs
      if (url.startsWith('http')) {
        console.warn(`URL does not match expected media patterns, returning as is (ensure host is in remotePatterns if external): ${url}`);
        return url; // Pass through for remotePatterns check
      } else {
         console.warn(`Unexpected relative image URL format, trying to use as is: ${url}`);
         // Attempt to prepend the internal base, might fail if path is not root-relative
         return url.startsWith('/') ? `${internalMediaBase}${url}` : `${internalMediaBase}/${url}`;
      }
    }

    // --- Step 2: Construct the canonical absolute URL using the internal base ---
    if (relativePath) {
      return `${internalMediaBase}${relativePath}`; // Always return http://nginx/media/...
    } else {
        // This case should theoretically not be reached if logic above is sound
        console.error(`Failed to extract relative path from URL: ${url}`);
        return null;
    }

  } catch (e) {
    console.error(`Error processing image URL ${url}:`, e);
    return null;
  }
}

/**
 * Determines the correct public base URL for assets (like documents in <a> tags)
 * that need to be accessible directly by the browser.
 */
function getPublicMediaBaseUrl(): string {
  // Client-side always needs the public URL
  if (typeof window !== 'undefined') {
    // Try specific env var first
    const publicMediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;
    if (publicMediaUrl) {
      return publicMediaUrl.replace(/\/$/, '');
    }
    // Derive from API URL
    const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (publicApiUrl) {
      if (publicApiUrl.startsWith('http')) {
        return publicApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, ''); // e.g., http://localhost
      } else {
        // Relative API URL - difficult to guess absolute path reliably
        // We'll assume it should be relative from the current origin
        console.warn("NEXT_PUBLIC_API_URL is relative. Constructing asset URL relative to origin.");
        return ''; // Return empty string, relative path will be used from origin
      }
    }
    // Fallback if no env vars
    console.warn("Cannot determine public media base URL. Assuming relative path from origin.");
    return ''; // Use relative path from origin
  }

  // Server-side: We still need the PUBLIC url for the browser to use later!
  // This is the tricky part. We must rely on environment variables set at build/run time.
  const publicMediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL;
  if (publicMediaUrl) {
    return publicMediaUrl.replace(/\/$/, '');
  }
  const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (publicApiUrl && publicApiUrl.startsWith('http')) {
     return publicApiUrl.replace(/\/api\/?$/, '').replace(/\/$/, ''); // e.g., http://localhost
  }

  // LAST RESORT FALLBACK (Might be incorrect if behind specific proxy/domain)
  console.warn("Could not determine public media base URL on server from env vars. Falling back to http://localhost. Set NEXT_PUBLIC_MEDIA_URL or NEXT_PUBLIC_API_URL.");
  return 'http://localhost';
}

/**
 * Converts backend asset URLs (potentially http://localhost/media/... or http://nginx/media/...)
 * into a PUBLICLY ACCESSIBLE absolute URL (e.g., http://localhost/media/...)
 * suitable for direct use in browser links (<a> tags).
 */
export function getPublicAssetUrl(url: string | undefined | null): string | null {
  if (!url) return null;

  let relativePath: string | null = null;

  // Define potential source URL structures
  const sourceHostHttp = 'http://localhost';
  const sourceHostNginx = 'http://nginx';

  try {
    // --- Step 1: Extract relativePath (/media/...) ---
    if (url.startsWith(sourceHostNginx + '/media/')) {
      relativePath = url.substring(sourceHostNginx.length); // /media/...
    } else if (url.startsWith(sourceHostHttp + '/media/')) {
      relativePath = url.substring(sourceHostHttp.length); // /media/...
    } else if (url.startsWith('/media/')) {
      relativePath = url;
    } else {
      // If it doesn't start with known media patterns, return as is
      console.warn(`URL does not match expected media patterns, returning as is: ${url}`);
      return url;
    }

    // --- Step 2: Construct the PUBLIC absolute URL ---
    if (relativePath) {
      const publicBase = getPublicMediaBaseUrl(); // Gets http://localhost or similar
      // If publicBase is empty (meaning use relative from origin), just return the relativePath
      return publicBase ? `${publicBase}${relativePath}` : relativePath;
    } else {
      console.error(`Failed to extract relative path from URL: ${url}`);
      return null;
    }

  } catch (e) {
    console.error(`Error processing asset URL ${url}:`, e);
    return null;
  }
}

// Optionally, you could create a universal fetch function here
// export async function fetchApiUtil(endpoint: string, options: RequestInit = {}) { ... } 