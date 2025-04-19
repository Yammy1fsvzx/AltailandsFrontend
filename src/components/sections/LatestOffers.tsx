'use client'
import React, { useRef } from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { motion, useInView } from 'framer-motion';
import { fadeIn, staggerContainer } from '@/lib/animations/scrollAnimations';
import { LandPlot } from '@/types/catalog';
import ListingCard from '@/components/catalog/ListingCard'; 

interface LatestOffersProps {
  listings: LandPlot[];
}

const LatestOffers: React.FC<LatestOffersProps> = ({ listings }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const containerVariants = staggerContainer(0.1, 0.2);

  if (!listings || listings.length === 0) {
    return null;
  }

  // Take only the first 3 listings
  const listingsToShow = listings.slice(0, 3);

  return (
    <section
      ref={sectionRef}
      className="section-padding w-full overflow-hidden bg-gray-50" 
    >
      <motion.div
        variants={staggerContainer(0.1, 0)}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="content-container space-y-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <motion.h2
              variants={fadeIn('up', 'medium')}
              className="h2-heading text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Свежие предложения
            </motion.h2>
            <motion.p
              variants={fadeIn('up', 'medium')}
              className="section-description text-lg text-gray-600 mb-6 md:mb-0"
            >
              Самые последние добавленные участки в нашей базе.
            </motion.p>
          </div>
          <motion.div
            variants={fadeIn('left', 'medium')}
            className="mt-6 md:mt-0 flex-shrink-0"
          >
            <Link
              href="/catalog?category=land-plots"
              className="inline-flex items-center px-7 py-3 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 group text-base shadow hover:shadow-md"
            >
              <span>В каталог</span>
              <FiChevronRight className="ml-1.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" 
        >
          {/* Map over the first 3 listings and render ListingCard */} 
          {listingsToShow.map((listing, index) => (
            <motion.div
              key={listing.id}
              variants={fadeIn('up', 'medium', index * 0.1)}
              className="h-full" // Ensure motion div takes full height if ListingCard needs it
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LatestOffers; 