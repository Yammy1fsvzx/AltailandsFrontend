/**
 * Represents a media file associated with a news article or other content.
 */
export interface MediaFile {
  id: number;
  file_url: string; // URL of the file
  type: 'image' | 'video' | 'document' | 'other'; // Possible media types
  type_display: string; // Display name for the type (e.g., "Изображение")
  is_main: boolean; // Indicates if this is the primary media file (e.g., for preview)
  order: number; // Display order
  description: string | null; // Optional description
  uploaded_at: string; // ISO 8601 date string
}

/**
 * Represents a news category.
 */
export interface Category {
  id: number;
  name: string;
  slug: string;
}

/**
 * Represents a news article.
 */
export interface NewsArticle {
  id: number;
  category?: Category | null; // Category might be null or optional
  category_name?: string; // Keep category_name if API still provides it directly
  title: string;
  slug?: string; // Slug might be optional
  short_description?: string | null; // Allow null
  content: string; // HTML content
  media_files: MediaFile[]; // <-- ADD new media_files array
  created_at: string; // ISO 8601 date string
  updated_at: string; // ISO 8601 date string
  is_published?: boolean; // Make optional if not always present
  views_count?: number; // Make optional
  // Optional fields from the API spec, uncomment if needed
  // seo_title?: string | null;
  // seo_description?: string | null;
  // og_image?: string | null;
} 