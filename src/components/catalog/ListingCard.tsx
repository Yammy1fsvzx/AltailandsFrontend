import Link from 'next/link';
import Image from 'next/image';
import { Listing, LandPlot, GenericProperty, Location } from '@/types/catalog'; // Import Location type
import { getPublicImageUrl } from '@/lib/api/utils'; // <-- ВОЗВРАЩАЕМ ИМПОРТ

// --- Helper Functions (consider moving to utils file) ---

// Type guard to check if it's a LandPlot
function isLandPlot(listing: Listing): listing is LandPlot {
  // Use a property unique to LandPlot or check property_type absence
  // Checking for 'area' is a reasonable assumption based on the types provided
  return listing.hasOwnProperty('area'); 
}

// Check if the listing was created within the last 7 days
function isNew(createdAt: string): boolean {
  if (!createdAt) return false;
  try {
    const createdDate = new Date(createdAt);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return createdDate > sevenDaysAgo;
  } catch (e) {
    console.error("Error parsing date for isNew check:", e);
    return false;
  }
}

// Format price with Russian locale and currency symbol
function formatPrice(price: string | number | null | undefined): string {
    if (price === null || price === undefined) return 'Цена не указана';
    // Attempt to convert string price to number, handle potential errors
    const numPrice = typeof price === 'string' ? parseFloat(price.replace(/\s/g, '').replace(',', '.')) : price;
    if (isNaN(numPrice)) return 'Цена не указана'; // Return if conversion failed
    // Use Intl.NumberFormat for robust formatting
    try {
      return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(numPrice);
    } catch (e) {
        console.error("Error formatting price:", e);
        return `${numPrice.toLocaleString('ru-RU')} ₽`; // Fallback basic formatting
    }
}

// Format location string from the Location object
function formatLocation(location: Location | null | undefined): string {
    if (!location) return 'Местоположение не указано';
    // Combine fields intelligently, using available fields
    const parts = [
        location.locality, 
        // location.district, // Removed district as it doesn't exist in the type
        location.region 
    ].filter(Boolean); // Filter out null/undefined/empty strings
    return parts.join(', ') || 'Местоположение не указано';
}

// --- Listing Card Component ---

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const isLand = isLandPlot(listing);
  // Determine the correct link based on type
  const linkHref = isLand
    ? `/catalog/land-plots/${listing.slug}`
    : `/catalog/${(listing as GenericProperty).property_type.slug}/${listing.slug}`;

  // Find the main image or use the first one as fallback
  const mainImage = listing.media_files?.find(file => file.is_main) || listing.media_files?.[0];
  // Get the raw URL from the backend (http://localhost/media/... or http://nginx/media/...)
  const rawImageUrl = mainImage?.file_url;
  // Convert to the canonical URL for Image component (always http://nginx/media/...)
  const imageUrl = getPublicImageUrl(rawImageUrl) || '/images/placeholder.jpg'; // <-- ВЫЗЫВАЕМ ФУНКЦИЮ

  const showNewLabel = isNew(listing.created_at);

  return (
    <Link 
      href={linkHref} 
      className="group overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-white border border-gray-200 flex flex-col"
    >
      <div className="relative">
        {/* Image Container */}
        <div className="aspect-[16/10] relative overflow-hidden"> 
           {/* ---- USE NEXT/IMAGE AGAIN ---- */}
           <Image
             src={imageUrl} // <-- ПЕРЕДАЕМ ОБРАБОТАННЫЙ URL
             alt={listing.title}
             fill
             sizes="(max-width: 640px) 100vw, 50vw" 
             className="object-cover transition-transform duration-300 group-hover:scale-105"
             onError={(e) => { 
               console.error("Image Load Error for:", imageUrl, e);
               (e.target as HTMLImageElement).src = '/images/placeholder.jpg'; 
             }}
             // unoptimized={false} // Default is false, so optimization is ON
          />
           {/* ---- END NEXT/IMAGE ---- */}
        </div>
        {/* New Label */} 
        {showNewLabel && (
          <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm z-10">
            Новый
          </div>
        )}
      </div>
      
      {/* Content Area */} 
      <div className="p-4 flex flex-col flex-grow"> 
        {/* Title */} 
        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 truncate group-hover:text-emerald-700 transition-colors" title={listing.title}>
          {listing.title}
        </h3>
        {/* Location */} 
        <p className="text-xs md:text-sm text-gray-500 mb-3 truncate" title={formatLocation(listing.location)}>
          {formatLocation(listing.location)} 
        </p>
        
        {/* Price */} 
        <div className="text-lg md:text-xl font-bold text-gray-900 mb-auto pb-3"> {/* Push area below */} 
          {formatPrice(listing.price)} 
        </div>

        {/* Area and Price per Are (Conditional) */} 
        <div className="text-xs md:text-sm text-gray-600 border-t border-gray-100 pt-3 mt-3">
          {isLand ? (
              <div className="flex justify-between items-center">
                <span>{listing.area} соток</span>
                {listing.price_per_are && ( // Check if price_per_are exists
                  <span className="font-medium text-emerald-700">{formatPrice(listing.price_per_are)}/сотка</span> 
                )}
              </div>
            ) : (
              // Placeholder or specific info for other types
              <div className="flex justify-between items-center">
                 <span>{(listing as GenericProperty).property_type.name}</span> 
                 <span className="text-gray-400 italic">Подробнее</span>
              </div>
            )
          }
        </div>
      </div>
    </Link>
  );
} 