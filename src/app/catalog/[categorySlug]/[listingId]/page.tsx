import React from 'react';
import { notFound } from 'next/navigation';
// Import the client component we created
import ListingView from '@/components/catalog/listing/ListingView'; 
// Import the new API function
import { getListingDetails } from '@/lib/api/listings'; 
// Import the type for the listing data
import { ListingDetail } from '@/types/catalog'; 

interface ListingPageProps {
  params: Promise<{
    categorySlug: string;
    listingId: string;
  }>;
}

// TODO: Add metadata generation based on listing data
// export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> { ... }

async function ListingPage({ params }: ListingPageProps) {
  // Await the params Promise to resolve
  const resolvedParams = await params;

  // REMOVE the immediate destructuring
  // const { categorySlug, listingId } = params; // No longer needed here
  
  // Remove minimal await if no longer needed
  // await Promise.resolve(); 

  // --- Data Fetching using the API function ---
  // Use properties from the resolved params
  const listingData: ListingDetail | null = await getListingDetails(
    resolvedParams.categorySlug,
    resolvedParams.listingId
  );

  // --- Handle Not Found --- 
  if (!listingData) {
    notFound(); // Trigger 404 if API returns null or fetch fails
  }

  // REMOVE explicit access after await, use resolvedParams
  // const slugForClient = params.categorySlug; 

  return (
    // Remove the outer container div
    // <div className="container mx-auto px-4 pt-6 pb-12 md:pt-8 md:pb-16">
      
      // Pass categorySlug from resolved params to ListingView
      <ListingView listing={listingData} categorySlug={resolvedParams.categorySlug} />

    // </div>
  );
}

export default ListingPage; 