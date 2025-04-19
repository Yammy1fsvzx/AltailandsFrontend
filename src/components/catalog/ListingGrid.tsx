import React from 'react';
import { LandPlot, GenericProperty } from '@/types/catalog';
import ListingCard from './ListingCard';
import { ListingCardSkeleton } from './ListingCardSkeleton';

interface ListingGridProps {
  listings: (LandPlot | GenericProperty)[];
  isLoading: boolean;
  itemsPerPage: number;
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings, isLoading, itemsPerPage }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {isLoading 
        ? (
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <ListingCardSkeleton key={`skeleton-${index}`} />
          ))
        ) 
        : (
          listings.length > 0 ? (
            listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              Объектов не найдено.
            </div>
          )
        )
      }
    </div>
  );
};

export default ListingGrid; 