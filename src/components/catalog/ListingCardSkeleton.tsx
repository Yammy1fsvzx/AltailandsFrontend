import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const ListingCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col h-full">
      {/* Skeleton for Image */}
      <Skeleton className="aspect-[16/10] w-full" /> 
      <div className="p-4 flex-grow space-y-3">
        {/* Skeleton for Title */}
        <Skeleton className="h-5 w-3/4" />
        {/* Skeleton for Location */}
        <Skeleton className="h-4 w-1/2" />
      </div>
      {/* Skeleton for Price and Area row */}
      <div className="p-4 pt-0 flex justify-between items-center">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-5 w-1/4" />
      </div>
    </div>
  );
}; 