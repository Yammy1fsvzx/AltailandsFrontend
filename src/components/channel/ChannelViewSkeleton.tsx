import React from 'react';
import PageHero from '@/components/common/PageHero';
import { ArticleCardSkeleton } from './ArticleCardSkeleton';
import { Skeleton } from "@/components/ui/skeleton";

const ChannelViewSkeleton: React.FC = () => {
  const skeletonCount = 6; // Number of skeleton cards to display

  return (
    <>
      <PageHero title="Канал" />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        {/* Skeleton for Telegram Button/Link */}
        <div className="text-center mb-12 md:mb-16">
          <Skeleton className="h-12 w-64 mx-auto rounded-lg" />
        </div>

        {/* Grid of Article Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <ArticleCardSkeleton key={`article-skel-${index}`} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ChannelViewSkeleton; 