import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export const ArticleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg flex flex-col">
      {/* Image Skeleton */}
      <Skeleton className="w-full h-48 md:h-56 object-cover" />
      <div className="p-5 md:p-6 flex flex-col flex-grow">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4 mb-3" />
        {/* Date Skeleton */}
        <Skeleton className="h-4 w-1/4 mb-4" />
        {/* Excerpt Skeleton */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-5" />
        {/* Read More Skeleton (bottom) */}
        <div className="mt-auto">
          <Skeleton className="h-5 w-1/3" />
        </div>
      </div>
    </div>
  );
}; 