'use client';

import React from 'react';

// Define props interface
interface PageHeroProps {
  title: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title }) => {
  return (
    <section className="relative w-full h-[40vh] md:h-[60vh] bg-gradient-to-b from-[#0e463e] to-[#0c3c34] text-white overflow-hidden">
      {/* SVG Background (same as before, but IDs can be kept generic now like PageHero) */}
      <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="farMountainGradientPageHero" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#13564C"></stop>
            <stop offset="100%" stopColor="#0E433B"></stop>
          </linearGradient>
          <linearGradient id="nearMountainGradientPageHero" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B3B33"></stop>
            <stop offset="100%" stopColor="#072F29"></stop>
          </linearGradient>
          <linearGradient id="treeGradientPageHero" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#062723"></stop>
            <stop offset="100%" stopColor="#041E1A"></stop>
          </linearGradient>
          <filter id="mountainShadowPageHero" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#000" floodOpacity="0.5"></feDropShadow>
          </filter>
        </defs>
        {/* Paths using renamed IDs */}
        <path d="M0,600 L200,500 L400,570 L600,490 L800,580 L1000,460 L1200,530 L1400,480 L1600,550 L1800,470 L1920,520 L1920,1080 L0,1080 Z" fill="url(#farMountainGradientPageHero)" filter="url(#mountainShadowPageHero)" opacity="1"></path>
        <path d="M0,750 L200,680 L300,720 L400,650 L600,750 L700,700 L850,780 L950,720 L1100,800 L1300,680 L1500,780 L1700,700 L1800,750 L1920,680 L1920,1080 L0,1080 Z" fill="url(#nearMountainGradientPageHero)" filter="url(#mountainShadowPageHero)" opacity="1"></path>
        <path d="M0,800 L50,780 L80,800 L120,760 L180,810 L220,780 L260,800 L300,770 L350,800 L400,760 L450,810 L500,780 L550,800 L600,770 L650,800 L700,760 L750,810 L800,780 L850,800 L900,770 L950,800 L1000,760 L1050,810 L1100,780 L1150,800 L1200,770 L1250,800 L1300,760 L1350,810 L1400,780 L1450,800 L1500,770 L1550,800 L1600,760 L1650,810 L1700,780 L1750,800 L1800,770 L1850,800 L1900,780 L1920,790 L1920,1080 L0,1080 Z" fill="#072F29" opacity="1"></path>
        <g opacity="1">
          {/* Tree paths using renamed gradient */}
          <path d="M155,900 L154,880.2 L162,880.2 L161,900 Z M124.4,883.5 C114.8,858.75 110,850.5 122,837.3 C117.2,820.8 126.8,809.25 134,792.75 C131.6,776.25 143.6,768 150.8,754.8 C155.6,743.25 158,735 160.4,743.25 C165.2,754.8 172.4,768 182,792.75 C189.2,809.25 198.8,820.8 194,837.3 C206,850.5 201.2,858.75 191.6,883.5 Z" fill="url(#treeGradientPageHero)" opacity="0.9"></path>
          <path d="M428,900 L427,873 L435,873 L434,900 Z M385.5,877.5 C372.5,843.75 366,832.5 382.25,814.5 C375.75,792 388.75,776.25 398.5,753.75 C395.25,731.25 411.5,720 421.25,702 C427.75,686.25 431,675 434.25,686.25 C440.75,702 450.5,720 463.5,753.75 C473.25,776.25 486.25,792 479.75,814.5 C496,832.5 489.5,843.75 476.5,877.5 Z" fill="url(#treeGradientPageHero)"></path>
          {/* ... other tree paths ... */}
        </g>
        <path d="M0,940 Q480,910 960,940 Q1440,970 1920,940" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="30" opacity="0.6"></path>
      </svg>

      {/* Content: Centered Title using the 'title' prop */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {title} {/* Use the title prop here */}
        </h1>
      </div>
    </section>
  );
};

export default PageHero; 