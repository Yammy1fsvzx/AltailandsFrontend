// Base type for location reused in both listing types
export interface Location {
  id: number;
  region: string;
  locality: string;
  address_line: string;
  latitude: string; // Note: API returns strings, might need parseFloat
  longitude: string; // Note: API returns strings, might need parseFloat
}

// Type for media files (images, documents)
export interface MediaFile {
  id?: number; // Assuming ID might be present
  url: string; // Preferred field, but keeping file_url for compatibility
  file_url?: string; // Add file_url based on API response
  description?: string;
  type?: string; // e.g., 'image', 'document'
  type_display?: string; // e.g., 'Image', 'PDF'
  is_main?: boolean; // Add is_main based on API response
  order?: number;    // Add order based on API response
}

// --- Land Plot Specific Types ---
export interface LandUseType {
  id: number;
  name: string;
  description?: string;
}

export interface LandCategory {
  id: number;
  name: string;
}

export interface Feature {
  id: number;
  name: string;
  type: string;
  type_display: string;
}

// --- Land Plot Detail Response --- 
export interface LandPlotDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  land_type: string; // e.g., 'standard'
  land_type_display: string; // e.g., 'Стандартный участок'
  location: Location;
  cadastral_numbers?: string;
  land_use_types: LandUseType[];
  land_category: LandCategory;
  features: Feature[];
  area: string; // Note: API returns string, might need parseFloat
  price: string; // Note: API returns string, might need parseFloat
  price_per_are?: string; // Note: API returns string, might need parseFloat
  plot_status: string; // e.g., 'available'
  plot_status_display: string; // e.g., 'Доступен'
  listing_status: string; // e.g., 'published'
  listing_status_display: string; // e.g., 'Опубликовано'
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  media_files: MediaFile[];
  // Add other potential fields if they exist in the detail view
}

// --- Property Specific Types ---
export interface PropertyTypeSummary {
  id: number;
  name: string;
  slug: string;
  // Schemas might not be needed in detail view, but keeping as placeholders
  attribute_schema?: Record<string, any>; 
  available_filters?: any[];
}

// --- Generic Property Detail Response --- 
export interface PropertyDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  property_type: PropertyTypeSummary;
  parent?: any; // Type based on actual parent structure if needed
  children_count?: number;
  location: Location;
  price: string; // Note: API returns string, might need parseFloat
  listing_status: string;
  listing_status_display: string;
  attributes: Record<string, string | number | boolean | null>; // Dynamic attributes
  created_at: string;
  updated_at: string;
  view_count?: number;
  media_files: MediaFile[];
  // Add other potential fields if they exist in the detail view
}

// --- Unified Type (Optional but helpful) ---
// Can use discriminated union based on a common field if available,
// or just a broad type for props if handling differences in the component
export type ListingDetail = LandPlotDetail | PropertyDetail;

// Helper type guard (example)
export function isLandPlotDetail(listing: ListingDetail): listing is LandPlotDetail {
  return (listing as LandPlotDetail).land_type !== undefined;
}

// --- NEW: Define structure for available filters --- //
export interface AvailableFilter {
    param: string;  // e.g., "attr_area_sqm", "attr_has_balcony"
    label: string;  // e.g., "Площадь (кв.м.)", "Балкон/Лоджия"
    type: 'range' | 'boolean' | 'select' | 'multiselect' | 'text'; // Add other types as needed
    // Optional: Add choices for select/multiselect if provided by API
    choices?: Array<{ value: string | number; label: string }>;
}

export interface PropertyType {
  id: number;
  name: string;
  slug: string;
  attribute_schema: Record<string, any> | null; // JSON Schema for attributes
  available_filters?: AvailableFilter[]; // Add the new optional field
  // Add other property type fields if available
}

// Base interface for common listing properties
interface BaseListing {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  location: Location;
  price: string; // Keep as string from API, format later
  listing_status: 'published' | 'hidden' | 'sold' | 'reserved'; // Add other statuses if needed
  media_files: MediaFile[];
  created_at: string;
  updated_at: string;
  view_count: number;
}

export interface LandPlot extends BaseListing {
  area: string; // In 'sotka'
  price_per_are: string;
  features: Feature[];
  land_category?: LandCategory | null; // Optional? Check API response
  land_use_types?: LandUseType[] | null; // Optional? Check API response
  plot_status?: 'available' | 'sold' | 'reserved'; // Add other statuses if needed
  // Specific LandPlot fields here
}

export interface GenericProperty extends BaseListing {
  property_type: PropertyType;
  attributes: Record<string, any>; // Dynamic attributes based on property_type.attribute_schema
  // Specific GenericProperty fields here (if any beyond attributes)
}

// Union type for any listing
export type Listing = LandPlot | GenericProperty;

// Type for the paginated API response
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Type for filter parameters (will expand later)
export interface FilterParams {
  page?: number;
  ordering?: string;
  [key: string]: any; // Allow for dynamic filter keys
}

// Type for sorting options
export interface SortingOption {
    value: string;
    label: string;
} 