'use client'
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountainRef = useRef<SVGPathElement>(null);
  const farMountainRef = useRef<SVGPathElement>(null);
  const forestRef = useRef<SVGPathElement>(null);
  const treesRef = useRef<SVGGElement>(null);
  const moonRef = useRef<SVGCircleElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowWidth, setWindowWidth] = useState(0);
  
  // Используем хук useScroll для отслеживания положения скролла
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Трансформации для разных элементов на основе скролла
  const moonY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const moonScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1]);
  const moonOpacity = useTransform(scrollYProgress, [0, 0.5], [0.9, 0.6]);
  const farMountainY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const nearMountainY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const forestY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const treesY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const fogY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const fogOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.8], [0, -100]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    // Устанавливаем флаг, что мы на клиенте
    setIsClient(true);
    
    // Обработчик движения мыши для эффекта параллакса
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      // Проверяем, что window существует
      if (typeof window !== 'undefined') {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // Преобразуем координаты мыши в проценты от центра экрана (-1 до 1)
        const x = (clientX - windowWidth / 2) / (windowWidth / 2);
        const y = (clientY - windowHeight / 2) / (windowHeight / 2);
        
        setMousePosition({ x, y });
      }
    };
    
    // Добавляем отслеживание размера экрана
    const handleResize = () => {
      if (typeof window !== 'undefined') {
          setWindowWidth(window.innerWidth);
      }
    };
    
    // Инициализируем значение ширины окна
    handleResize();
    
    // Добавляем слушатели только на клиенте
    if (typeof window !== 'undefined') {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Коэффициенты смещения для эффекта параллакса от движения мыши
  const mouseParallaxFactor = {
    moon: 10,
    farMountain: 3,
    nearMountain: 5,
    forest: 8,
    trees: 12,
    fog: 10,
    content: -5
  };

  // Функция для создания силуэта ели
  const createTreePath = (x: number, height: number, width: number): string => {
    const baseWidth = width;
    const treeHeight = height;
    
    // Начальная точка у основания ствола
    let path = `M${x - 3},${900} `;
    
    // Ствол - слегка расширяющийся книзу
    path += `L${x - 4},${900 - treeHeight * 0.12} `;
    path += `L${x + 4},${900 - treeHeight * 0.12} `;
    path += `L${x + 3},${900} `;
    path += `Z `;
    
    // Начинаем рисовать силуэт кроны снизу от ствола
    path += `M${x - baseWidth * 0.7},${900 - treeHeight * 0.10} `;
    
    // Нижняя часть кроны - самая широкая
    path += `C${x - baseWidth * 0.9},${900 - treeHeight * 0.25} ${x - baseWidth},${900 - treeHeight * 0.30} ${x - baseWidth * 0.75},${900 - treeHeight * 0.38} `;
    
    // Середина кроны - сужается
    path += `C${x - baseWidth * 0.85},${900 - treeHeight * 0.48} ${x - baseWidth * 0.65},${900 - treeHeight * 0.55} ${x - baseWidth * 0.5},${900 - treeHeight * 0.65} `;
    
    // Верхняя часть кроны - заостряется к вершине
    path += `C${x - baseWidth * 0.55},${900 - treeHeight * 0.75} ${x - baseWidth * 0.3},${900 - treeHeight * 0.80} ${x - baseWidth * 0.15},${900 - treeHeight * 0.88} `;
    
    // Вершина
    path += `C${x - baseWidth * 0.05},${900 - treeHeight * 0.95} ${x},${900 - treeHeight} ${x + baseWidth * 0.05},${900 - treeHeight * 0.95} `;
    
    // Правая сторона (зеркальное отражение)
    path += `C${x + baseWidth * 0.15},${900 - treeHeight * 0.88} ${x + baseWidth * 0.3},${900 - treeHeight * 0.80} ${x + baseWidth * 0.5},${900 - treeHeight * 0.65} `;
    path += `C${x + baseWidth * 0.65},${900 - treeHeight * 0.55} ${x + baseWidth * 0.85},${900 - treeHeight * 0.48} ${x + baseWidth * 0.75},${900 - treeHeight * 0.38} `;
    path += `C${x + baseWidth},${900 - treeHeight * 0.30} ${x + baseWidth * 0.9},${900 - treeHeight * 0.25} ${x + baseWidth * 0.7},${900 - treeHeight * 0.10} `;
    
    // Замыкаем контур
    path += `Z`;
    
    return path;
  };

  return (
    <div ref={containerRef} className="relative w-full h-[100vh] overflow-hidden xs:rounded-none">
      {/* Фон - минималистичный градиент */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e463e] to-[#0c3c34] z-0" />
      
      {/* SVG пейзаж - элегантный и простой */}
      <svg
        className="absolute inset-0 w-full h-full z-10"
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Градиенты для гор */}
          <linearGradient id="farMountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#13564C" />
            <stop offset="100%" stopColor="#0E433B" />
          </linearGradient>
          
          <linearGradient id="nearMountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B3B33" />
            <stop offset="100%" stopColor="#072F29" />
          </linearGradient>
          
          <linearGradient id="treeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#062723" />
            <stop offset="100%" stopColor="#041E1A" />
          </linearGradient>

          {/* Фильтры для теней и свечения */}
          <filter id="mountainShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#000" floodOpacity="0.5" />
          </filter>
          
          <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          {/* Радиальный градиент для свечения вокруг луны */}
          <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        {/* Звезды - рендерим только на клиенте */}
        {isClient && (
          <g>
            {Array.from({ length: 120 }).map((_, i) => {
              // Используем фиксированное начальное значение для предсказуемости
              const seed = i * 123.456;
              
              // Распределяем звезды по всему небу, больше концентрация вверху
              const yFactor = (i % 3 === 0) ? 0.7 : ((i % 3 === 1) ? 0.5 : 0.25);
              const xPos = ((seed * 1.1) % 1920).toFixed(0);
              const yPos = ((seed * 0.7) % (600 * yFactor)).toFixed(0);
              
              // Разная плотность размещения в разных частях неба
              const sectionDensity = Math.floor(parseInt(xPos) / 400);
              const shouldRenderStar = !(i % (sectionDensity + 2) === 0 && parseInt(yPos) > 200);
              
              // Рендерим звезду только если она проходит проверку на размещение
              if (shouldRenderStar) {
                // Более разные размеры звезд
                const sizeVariation = ((i % 15) + 1) / 10;
                const r = (sizeVariation + (seed % 1) * 0.2).toFixed(2);
                
                // Разная яркость
                const brightnessBase = (i % 2 === 0) ? 0.4 : 0.3;
                const op = (brightnessBase + ((i % 10) / 20)).toFixed(2);
                
                // Разная длительность анимации и задержка
                const durBase = 2 + (i % 5);
                const durVariation = (seed % 1) * 2;
                const dur = (durBase + durVariation).toFixed(1);
                const del = ((i % 7) * 0.7).toFixed(1);
                
                // Несколько разных типов анимации
                const animationType = i % 4;
                let animation;
                
                switch(animationType) {
                  case 0: // Обычное мерцание
                    animation = {
                      opacity: [parseFloat(op), parseFloat(op) * 1.3, parseFloat(op)],
                      scale: [1, 1.2, 1],
                    };
                    break;
                  case 1: // Более слабое мерцание
                    animation = {
                      opacity: [parseFloat(op), parseFloat(op) * 1.15, parseFloat(op)],
                      scale: [1, 1.05, 1],
                    };
                    break;
                  case 2: // Только изменение яркости
                    animation = {
                      opacity: [parseFloat(op), parseFloat(op) * 1.25, parseFloat(op)],
                    };
                    break;
                  case 3: // Медленное продолжительное затухание и усиление
                    animation = {
                      opacity: [parseFloat(op), parseFloat(op) * 0.6, parseFloat(op)],
                    };
                    break;
                  default: // По умолчанию - обычное мерцание
                    animation = {
                        opacity: [parseFloat(op), parseFloat(op) * 1.3, parseFloat(op)],
                        scale: [1, 1.2, 1],
                    };
                    break;
                }
                
                return (
                  <motion.circle 
                    key={`star-${i}`} 
                    cx={xPos} 
                    cy={yPos} 
                    r={r}
                    fill={i % 20 === 0 ? "#f0f8ff" : "white"} 
                    opacity={op}
                    initial={{ opacity: 0 }} // Начальное состояние - невидимая
                    animate={animation}
                    transition={{
                      opacity: {
                        duration: parseFloat(dur),
                        repeat: Infinity,
                        repeatType: 'loop',
                        delay: parseFloat(del)
                      },
                      scale: {
                        duration: parseFloat(dur) * 1.5,
                        repeat: Infinity,
                        repeatType: 'loop',
                        delay: parseFloat(del) + 0.5
                      }
                    }}
                    style={{
                      x: mousePosition.x * -(1 + (i % 3)),
                      y: mousePosition.y * -(1 + (i % 3))
                    }}
                    suppressHydrationWarning // Подавляем предупреждение о гидратации для звезд
                  />
                );
              }
              
              // Если звезда не должна быть отрендерена, возвращаем null
              return null;
            })}
          </g>
        )}
        
        {/* Свечение вокруг луны */}
        <motion.circle
          cx="1600"
          cy="250"
          r="120"
          fill="url(#moonHalo)"
          style={{ 
            y: moonY,
            x: mousePosition.x * -mouseParallaxFactor.moon * 1.2,
            scale: moonScale,
            opacity: moonOpacity
          }}
        />
        
        {/* Луна */}
        <motion.circle 
          ref={moonRef}
          cx="1600" 
          cy="250" 
          r="70" 
          fill="#FFFFFF" 
          opacity="0.9"
          filter="url(#moonGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          style={{ 
            y: moonY,
            x: mousePosition.x * -mouseParallaxFactor.moon,
            scale: moonScale,
            opacity: moonOpacity
          }}
        />
        
        {/* Горы дальние - с эффектом параллакса */}
        <motion.path
          ref={farMountainRef}
          d="M0,600 L200,500 L400,570 L600,490 L800,580 L1000,460 L1200,530 L1400,480 L1600,550 L1800,470 L1920,520 L1920,1080 L0,1080 Z"
          fill="url(#farMountainGradient)"
          filter="url(#mountainShadow)"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          style={{ 
            y: farMountainY,
            x: mousePosition.x * -mouseParallaxFactor.farMountain
          }}
        />
        
        {/* Горы ближние - с эффектом параллакса */}
        <motion.path
          ref={mountainRef}
          d="M0,750 L200,680 L300,720 L400,650 L600,750 L700,700 L850,780 L950,720 L1100,800 L1300,680 L1500,780 L1700,700 L1800,750 L1920,680 L1920,1080 L0,1080 Z"
          fill="url(#nearMountainGradient)"
          filter="url(#mountainShadow)"
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.5, ease: "easeOut" }}
          style={{ 
            y: nearMountainY,
            x: mousePosition.x * -mouseParallaxFactor.nearMountain
          }}
        />

        {/* Минималистичный силуэт леса - с эффектом параллакса */}
        <motion.path
          ref={forestRef}
          d="M0,800 
            L50,780 L80,800 L120,760 L180,810 L220,780 L260,800 L300,770 
            L350,800 L400,760 L450,810 L500,780 L550,800 L600,770 
            L650,800 L700,760 L750,810 L800,780 L850,800 L900,770 
            L950,800 L1000,760 L1050,810 L1100,780 L1150,800 L1200,770 
            L1250,800 L1300,760 L1350,810 L1400,780 L1450,800 L1500,770 
            L1550,800 L1600,760 L1650,810 L1700,780 L1750,800 L1800,770 
            L1850,800 L1900,780 L1920,790 
            L1920,1080 L0,1080 Z"
          fill="#072F29"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
          style={{ 
            y: forestY,
            x: mousePosition.x * -mouseParallaxFactor.forest
          }}
        />
        
        {/* Силуэты елей - передний план */}
        <motion.g
          ref={treesRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1, ease: "easeOut" }}
          style={{ 
            y: treesY,
            x: mousePosition.x * -mouseParallaxFactor.trees
          }}
        >
          {/* Большие ели на переднем плане - более прореженные и хаотичные */}
          <path d={createTreePath(95, 210, 58)} fill="url(#treeGradient)" />
          <path d={createTreePath(287, 245, 72)} fill="url(#treeGradient)" />
          <path d={createTreePath(431, 225, 65)} fill="url(#treeGradient)" />
          <path d={createTreePath(643, 252, 75)} fill="url(#treeGradient)" />
          <path d={createTreePath(842, 227, 68)} fill="url(#treeGradient)" />
          <path d={createTreePath(1136, 240, 70)} fill="url(#treeGradient)" />
          <path d={createTreePath(1378, 230, 67)} fill="url(#treeGradient)" />
          <path d={createTreePath(1587, 217, 62)} fill="url(#treeGradient)" />
          <path d={createTreePath(1829, 238, 74)} fill="url(#treeGradient)" />
          
          {/* Ели среднего размера на втором плане - хаотичное расположение */}
          <path d={createTreePath(158, 165, 48)} fill="url(#treeGradient)" opacity="0.9" />
          <path d={createTreePath(376, 172, 52)} fill="url(#treeGradient)" opacity="0.9" />
          <path d={createTreePath(528, 155, 46)} fill="url(#treeGradient)" opacity="0.9" />
          <path d={createTreePath(763, 168, 50)} fill="url(#treeGradient)" opacity="0.9" />
          <path d={createTreePath(947, 178, 54)} fill="url(#treeGradient)" opacity="0.9" />
          <path d={createTreePath(1038, 163, 49)} fill="url(#treeGradient)" opacity="0.9" />
          <path d={createTreePath(1297, 159, 47)} fill="url(#treeGradient)" opacity="0.9" />
          <path d={createTreePath(1456, 174, 53)} fill="url(#treeGradient)" opacity="0.9" />
          <path d={createTreePath(1723, 166, 50)} fill="url(#treeGradient)" opacity="0.9" />
          
          {/* Более мелкие ели и отдельные деревья разбросаны случайным образом */}
          <path d={createTreePath(42, 105, 28)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(215, 112, 31)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(342, 108, 29)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(489, 118, 32)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(587, 101, 27)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(698, 116, 31)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(883, 109, 30)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(1004, 103, 28)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(1193, 117, 32)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(1342, 104, 29)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(1517, 113, 31)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(1635, 108, 30)} fill="url(#treeGradient)" opacity="0.8" />
          <path d={createTreePath(1794, 115, 32)} fill="url(#treeGradient)" opacity="0.8" />
          
          {/* Добавим несколько отдельно стоящих елей разного размера для большей естественности */}
          <path d={createTreePath(128, 195, 57)} fill="url(#treeGradient)" opacity="0.95" />
          <path d={createTreePath(560, 205, 60)} fill="url(#treeGradient)" opacity="0.95" />
          <path d={createTreePath(713, 185, 54)} fill="url(#treeGradient)" opacity="0.95" />
          <path d={createTreePath(1245, 200, 58)} fill="url(#treeGradient)" opacity="0.95" />
          <path d={createTreePath(1520, 190, 56)} fill="url(#treeGradient)" opacity="0.95" />
          
          {/* Небольшие группы елей для создания эффекта глубины и "случайности" */}
          <path d={createTreePath(203, 135, 40)} fill="url(#treeGradient)" opacity="0.85" />
          <path d={createTreePath(420, 125, 38)} fill="url(#treeGradient)" opacity="0.85" />
          <path d={createTreePath(630, 132, 39)} fill="url(#treeGradient)" opacity="0.85" />
          <path d={createTreePath(813, 128, 38)} fill="url(#treeGradient)" opacity="0.85" />
          <path d={createTreePath(1058, 135, 40)} fill="url(#treeGradient)" opacity="0.85" />
          <path d={createTreePath(1273, 130, 39)} fill="url(#treeGradient)" opacity="0.85" />
          <path d={createTreePath(1473, 126, 37)} fill="url(#treeGradient)" opacity="0.85" />
          <path d={createTreePath(1678, 134, 40)} fill="url(#treeGradient)" opacity="0.85" />
        </motion.g>
        
        {/* Туман в долине - тонкая полупрозрачная линия */}
        <motion.path
          d="M0,940 Q480,910 960,940 Q1440,970 1920,940"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3, delay: 1, ease: "easeInOut" }}
          style={{ 
            y: fogY,
            x: mousePosition.x * -mouseParallaxFactor.fog,
            opacity: fogOpacity
          }}
        />
      </svg>
      
      {/* Световые лучи - декоративный элемент, адаптивный для разных экранов */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full z-10 opacity-40"
        style={{
          x: mousePosition.x * -5,
          y: mousePosition.y * -3
        }}
      >
        <motion.div 
          className="absolute top-0 left-[60%] w-[2px] h-[30%] bg-gradient-to-b from-[#25BD6B] to-transparent"
          initial={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
          animate={{ 
            opacity: [0.3, 0.4, 0.3],
            scaleY: 1,
          }}
          transition={{ 
            opacity: {
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: "easeInOut"
            },
            scaleY: { duration: 2.5, delay: 2, ease: "easeOut" },
          }}
        />
        <motion.div 
          className="absolute top-0 left-[62%] w-[1px] h-[25%] bg-gradient-to-b from-[#25BD6B] to-transparent"
          initial={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
          animate={{ 
            opacity: [0.25, 0.35, 0.25],
            scaleY: 1,
          }}
          transition={{ 
            opacity: {
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: "easeInOut"
            },
            scaleY: { duration: 2, delay: 2.2, ease: "easeOut" },
          }}
        />
        <motion.div 
          className="absolute top-0 left-[65%] w-[3px] h-[35%] bg-gradient-to-b from-[#25BD6B] to-transparent"
          initial={{ opacity: 0, scaleY: 0, transformOrigin: 'top' }}
          animate={{ 
            opacity: [0.35, 0.45, 0.35],
            scaleY: 1,
          }}
          transition={{ 
            opacity: {
              duration: 5,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: "easeInOut"
            },
            scaleY: { duration: 3, delay: 1.8, ease: "easeOut" },
          }}
        />
      </motion.div>
      
      {/* Контент - адаптивный для разных экранов */}
      <motion.div 
        className="relative z-20 container mx-auto px-6 h-full flex flex-col justify-center"
        style={{ 
          y: contentY, 
          opacity: contentOpacity,
          x: mousePosition.x * mouseParallaxFactor.content,
          rotateY: mousePosition.x * 1.5, // Легкий 3D эффект вращения (уменьшил с 2 до 1.5)
        }}
      >
        <div className="max-w-3xl">
          <motion.h1 
            className="text-[2.1rem] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight"
            initial={windowWidth <= 640 ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          >
            Найдите свой <span className="text-[#25BD6B]">уникальный</span> участок<br className="hidden sm:block"/> в живописном Алтае
          </motion.h1>
          
          <motion.p 
            className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-10 max-w-2xl"
            initial={windowWidth <= 640 ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          >
            Инвестируйте в будущее с нашими премиальными участками для строительства 
            туристических объектов и загородных домов в экологически чистых зонах.
          </motion.p>
          
          <motion.div
            className="flex flex-col md:flex-row flex-wrap gap-3 sm:gap-4 mt-4"
            initial={windowWidth <= 640 ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          >
            <Link href="/catalog" className="inline-block">
              <motion.button 
                className="bg-[#25BD6B] text-white font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-3xl transition-all duration-300 cursor-pointer flex items-center justify-center group relative overflow-hidden"
                initial={{ boxShadow: "0 0 0 rgba(37, 189, 107, 0)" }}
                whileHover={{ 
                  y: -3,
                  boxShadow: "0 4px 12px rgba(37, 189, 107, 0.3)",
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={{ y: 0, boxShadow: "0 0 0 rgba(37, 189, 107, 0)" }}
              >
                <span className="relative z-10">Выбрать участок</span>
                <span className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform duration-300">→</span>
                <motion.div 
                  className="absolute inset-0 bg-[#1E9D59] rounded-3xl"
                  initial={{ scale: 0, opacity: 0, x: "100%" }}
                  whileHover={{ 
                    scale: 1, 
                    opacity: 1, 
                    x: 0,
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                  style={{ originX: 0 }}
                />
              </motion.button>
            </Link>
            
            <motion.button 
              className="text-white border border-[rgba(255,255,255,0.3)] bg-white/5 backdrop-blur-sm hover:bg-white/10 font-medium py-3 sm:py-4 px-6 sm:px-8 rounded-full transition-all duration-300 cursor-pointer"
              whileHover={{ 
                y: -3,
                boxShadow: "0 4px 12px rgba(255, 255, 255, 0.1)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
              whileTap={{ y: 0, boxShadow: "0 0 0 rgba(255, 255, 255, 0)" }}
              onClick={() => {
                // Добавляем проверку document на клиенте
                if (typeof document !== 'undefined') {
                  const quizSection = document.getElementById('quiz-section');
                  if (quizSection) {
                    quizSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
            >
              <span className="relative z-10">Получить консультацию</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Индикатор скролла - скрыт на мобильных устройствах */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex-col items-center hidden sm:flex"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 0.7, 
          y: [0, 5, 0] 
        }}
        transition={{
          y: {
            duration: 2.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut"
          },
          opacity: { duration: 1.5, delay: 2.5, ease: "easeInOut" }
        }}
      >
        <span className="text-white text-xs mb-2">Листайте вниз</span>
        <div className="w-5 h-9 border border-white rounded-full flex justify-center">
          <motion.div 
            className="w-1 h-2 bg-white rounded-full mt-2"
            animate={{ y: [0, 3, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Hero; 