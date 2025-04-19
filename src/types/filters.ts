// Types related to filtering options

/**
 * Represents a Land Use Type (Вид разрешенного использования - ВРИ).
 */
export interface LandUseType {
  id: number;
  name: string;
  description?: string; // Optional description
}

/**
 * Represents a Feature or Communication.
 */
export interface Feature {
  id: number;
  name: string;
  type: 'communication' | 'infrastructure' | 'environment' | 'other'; // Example types
  // type_display?: string; // Optional display name for type from API
}

/**
 * Represents a Land Category (Категория земель).
 */
export interface LandCategory {
  id: number;
  name: string;
}

/**
 * Represents the range of prices and areas available.
 */
export interface PriceAreaRange {
  price_min: number | null;
  price_max: number | null;
  area_min: number | null;
  area_max: number | null;
}

export interface SortingOption {
  value: string;
  label: string;
} 