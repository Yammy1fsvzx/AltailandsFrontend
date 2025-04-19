'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

// Определяем тип для пропсов
interface BlogHeroProps {
  // searchQuery: string; // <-- Remove
  // onSearchChange: (query: string) => void; // <-- Remove
}

// Компонент BlogHero
const BlogHero: React.FC<BlogHeroProps> = (/* { searchQuery, onSearchChange } */) => { // <-- Remove props from destructuring
  const containerRef = useRef<HTMLDivElement>(null);
  const farMountainRef = useRef<SVGPathElement>(null);
  const mountainRef = useRef<SVGPathElement>(null);
  const forestRef = useRef<SVGPathElement>(null);
  const treesRef = useRef<SVGGElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end center"]
  });

  const farMountainY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const nearMountainY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const forestY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const treesY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fogY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const fogOpacity = useTransform(scrollYProgress, [0, 0.5], [0.6, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.8], [0, -50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    setIsClient(true);
    const handleMouseMove = (e: MouseEvent) => {
      if (typeof window !== 'undefined') {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const x = (e.clientX - windowWidth / 2) / (windowWidth / 2);
        const y = (e.clientY - windowHeight / 2) / (windowHeight / 2);
        setMousePosition({ x, y });
      }
    };
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowWidth(window.innerWidth);
      }
    };
    handleResize();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const mouseParallaxFactor = {
    farMountain: 2,
    nearMountain: 3,
    forest: 4,
    trees: 5,
    fog: 4,
    content: -2
  };

  const createTreePath = (x: number, height: number, width: number): string => {
    const baseWidth = width;
    const treeHeight = height;
    let path = `M${x - 3},${900} `;
    path += `L${x - 4},${900 - treeHeight * 0.12} `;
    path += `L${x + 4},${900 - treeHeight * 0.12} `;
    path += `L${x + 3},${900} `;
    path += `Z `;
    path += `M${x - baseWidth * 0.7},${900 - treeHeight * 0.10} `;
    path += `C${x - baseWidth * 0.9},${900 - treeHeight * 0.25} ${x - baseWidth},${900 - treeHeight * 0.30} ${x - baseWidth * 0.75},${900 - treeHeight * 0.38} `;
    path += `C${x - baseWidth * 0.85},${900 - treeHeight * 0.48} ${x - baseWidth * 0.65},${900 - treeHeight * 0.55} ${x - baseWidth * 0.5},${900 - treeHeight * 0.65} `;
    path += `C${x - baseWidth * 0.55},${900 - treeHeight * 0.75} ${x - baseWidth * 0.3},${900 - treeHeight * 0.80} ${x - baseWidth * 0.15},${900 - treeHeight * 0.88} `;
    path += `C${x - baseWidth * 0.05},${900 - treeHeight * 0.95} ${x},${900 - treeHeight} ${x + baseWidth * 0.05},${900 - treeHeight * 0.95} `;
    path += `C${x + baseWidth * 0.15},${900 - treeHeight * 0.88} ${x + baseWidth * 0.3},${900 - treeHeight * 0.80} ${x + baseWidth * 0.5},${900 - treeHeight * 0.65} `;
    path += `C${x + baseWidth * 0.65},${900 - treeHeight * 0.55} ${x + baseWidth * 0.85},${900 - treeHeight * 0.48} ${x + baseWidth * 0.75},${900 - treeHeight * 0.38} `;
    path += `C${x + baseWidth},${900 - treeHeight * 0.30} ${x + baseWidth * 0.9},${900 - treeHeight * 0.25} ${x + baseWidth * 0.7},${900 - treeHeight * 0.10} `;
    path += `Z`;
    return path;
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[60vh] bg-gradient-to-b from-[#0e463e] to-[#0c3c34] text-white overflow-hidden"
    >
       <svg
          className="absolute inset-0 w-full h-full z-0"
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="farMountainGradientHero" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#13564C" />
              <stop offset="100%" stopColor="#0E433B" />
            </linearGradient>
            <linearGradient id="nearMountainGradientHero" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B3B33" />
              <stop offset="100%" stopColor="#072F29" />
            </linearGradient>
            <linearGradient id="treeGradientHero" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#062723" />
              <stop offset="100%" stopColor="#041E1A" />
            </linearGradient>
            <filter id="mountainShadowHero" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>

          <motion.path
            ref={farMountainRef}
            d="M0,600 L200,500 L400,570 L600,490 L800,580 L1000,460 L1200,530 L1400,480 L1600,550 L1800,470 L1920,520 L1920,1080 L0,1080 Z"
            fill="url(#farMountainGradientHero)"
            filter="url(#mountainShadowHero)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
            style={{
              y: farMountainY,
              x: mousePosition.x * -mouseParallaxFactor.farMountain
            }}
          />

          <motion.path
            ref={mountainRef}
            d="M0,750 L200,680 L300,720 L400,650 L600,750 L700,700 L850,780 L950,720 L1100,800 L1300,680 L1500,780 L1700,700 L1800,750 L1920,680 L1920,1080 L0,1080 Z"
            fill="url(#nearMountainGradientHero)"
            filter="url(#mountainShadowHero)"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            style={{
              y: nearMountainY,
              x: mousePosition.x * -mouseParallaxFactor.nearMountain
            }}
          />

          <motion.path
            ref={forestRef}
            d="M0,800 L50,780 L80,800 L120,760 L180,810 L220,780 L260,800 L300,770 L350,800 L400,760 L450,810 L500,780 L550,800 L600,770 L650,800 L700,760 L750,810 L800,780 L850,800 L900,770 L950,800 L1000,760 L1050,810 L1100,780 L1150,800 L1200,770 L1250,800 L1300,760 L1350,810 L1400,780 L1450,800 L1500,770 L1550,800 L1600,760 L1650,810 L1700,780 L1750,800 L1800,770 L1850,800 L1900,780 L1920,790 L1920,1080 L0,1080 Z"
            fill="#072F29"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
            style={{
              y: forestY,
              x: mousePosition.x * -mouseParallaxFactor.forest
            }}
          />

          <motion.g
            ref={treesRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.6, ease: "easeOut" }}
            style={{
              y: treesY,
              x: mousePosition.x * -mouseParallaxFactor.trees
            }}
          >
            <path d={createTreePath(158, 165, 48)} fill="url(#treeGradientHero)" opacity="0.9" />
            <path d={createTreePath(431, 225, 65)} fill="url(#treeGradientHero)" />
            <path d={createTreePath(763, 168, 50)} fill="url(#treeGradientHero)" opacity="0.9" />
            <path d={createTreePath(1136, 240, 70)} fill="url(#treeGradientHero)" />
            <path d={createTreePath(1456, 174, 53)} fill="url(#treeGradientHero)" opacity="0.9" />
            <path d={createTreePath(1829, 238, 74)} fill="url(#treeGradientHero)" />
            <path d={createTreePath(947, 178, 54)} fill="url(#treeGradientHero)" opacity="0.9" />
            <path d={createTreePath(643, 252, 75)} fill="url(#treeGradientHero)" />
          </motion.g>

          <motion.path
            d="M0,940 Q480,910 960,940 Q1440,970 1920,940"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
            style={{
              y: fogY,
              x: mousePosition.x * -mouseParallaxFactor.fog,
              opacity: fogOpacity
            }}
          />
       </svg>

        <motion.div 
            className="relative z-10 content-container text-center flex flex-col items-center px-4 h-full justify-center"
            style={{ 
              y: contentY, 
              opacity: contentOpacity,
              x: mousePosition.x * mouseParallaxFactor.content,
            }}
        >
            <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight max-w-4xl"
            >
                Новости и статьи проекта
            </motion.h1>

            <motion.p 
                className="text-lg md:text-xl text-gray-300 max-w-3xl mb-10 leading-relaxed"
            >
                 Актуальная информация, полезные материалы и аналитика для инвесторов и покупателей земельных участков.
            </motion.p>

             <motion.div 
                className="w-full max-w-lg"
            > 
                <div className="relative">
                    {/* Убираем поле поиска, оно больше не используется */}
                </div>
            </motion.div>

        </motion.div>
    </section>
  );
};

export default BlogHero; 