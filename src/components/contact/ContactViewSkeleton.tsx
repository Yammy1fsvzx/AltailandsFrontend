import React from 'react';
import PageHero from '@/components/common/PageHero';
import { Skeleton } from '@/components/ui/skeleton';

const ContactViewSkeleton: React.FC = () => {
  return (
    <>
      <PageHero title="Контакты" />
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20 relative z-10">
        <div className="mx-auto bg-white rounded-2xl md:rounded-[30px] shadow-xl p-6 sm:p-8 md:p-12 lg:p-16">
          {/* Skeleton for Info/Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-20 mb-12 md:mb-16 lg:mb-20">
            {/* Left Column Skeleton (Contact Info) */}
            <div className="space-y-6 md:space-y-7">
              <Skeleton className="h-8 w-3/4 mb-4" /> {/* Title */}
              <Skeleton className="h-4 w-full mb-6" /> {/* Subtitle */}
              <Skeleton className="h-4 w-5/6 mb-6" /> {/* Subtitle */}
              
              {/* Info Items Skeletons */}
              <div className="space-y-5">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            
            {/* Right Column Skeleton (Contact Form) */}
            <div className="space-y-6 md:space-y-7">
              <Skeleton className="h-8 w-3/4 mb-4" /> {/* Title */}
              {/* Form Field Skeletons */}
              <div className="space-y-5">
                 <Skeleton className="h-10 w-full rounded-lg" />
                 <Skeleton className="h-10 w-full rounded-lg" />
                 <Skeleton className="h-10 w-full rounded-lg" />
                 <Skeleton className="h-24 w-full rounded-lg" />
                 <Skeleton className="h-12 w-full rounded-lg" /> {/* Button */}
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Map Section Skeleton */}
          <div className="mt-12 md:mt-16 lg:mt-20">
            <Skeleton className="h-8 w-1/2 mx-auto mb-8" /> {/* Title */}
            <Skeleton className="w-full h-80 md:h-96 lg:h-[500px] rounded-lg" /> {/* Map Placeholder */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactViewSkeleton; 