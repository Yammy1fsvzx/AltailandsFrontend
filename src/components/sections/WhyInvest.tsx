'use client'
import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import PeopleIcon from '@mui/icons-material/People';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const WhyInvest = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // Используем useInView для отслеживания видимости элемента на экране
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const isProgressBarInView = useInView(progressBarRef, { once: true, amount: 0.8 });
  
  // Используем скролл для параллакс-эффекта
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Создаем параллакс-эффекты только для текста
  const textY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  // Анимация для элементов
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section 
      ref={sectionRef}
      // Возвращаем основной цвет текста темным для светлой темы
      className="py-16 md:py-24 w-full overflow-hidden my-20 text-gray-900"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="mx-auto container px-4 max-w-[1600px]">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 items-start">
          {/* Левая колонка с изображением (2/5) */}
          <motion.div 
            className="relative h-full order-2 lg:order-1 lg:col-span-2"
            variants={itemVariants}
          >
            <div className="relative h-[400px] md:h-[500px] lg:h-full w-full rounded-[30px] overflow-hidden shadow-lg">
              <Image 
                src="/images/altai-landscape.jpg" 
                alt="Живописные ландшафты Горного Алтая" 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-medium">Рост стоимости земли</span>
                  <span className="bg-[#25BD6B] py-1 px-3 rounded-full text-sm font-bold text-black">+20-40% в год</span>
                </div>
                
                <div ref={progressBarRef} className="w-full h-[4px] bg-white/20 rounded-full mb-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-[#25BD6B] to-[#40E78B]"
                    initial={{ width: 0 }}
                    animate={isProgressBarInView ? { width: "70%" } : { width: 0 }}
                    transition={{ duration: 1.8, delay: 0.2, ease: "linear" }}
                  />
                </div>
                
                <div className="flex items-center text-sm text-white/80 mb-4">
                  <span>2019</span>
                  <div className="flex-grow mx-2 border-t border-dashed border-white/30"></div>
                  <span>2026</span>
                </div>
                
                <motion.div 
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.3, ease: "linear" }}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-center">
                      <p className="text-xs text-white/70">Туристический поток</p>
                      <div className="flex items-baseline">
                        <motion.span 
                          className="text-2xl font-bold"
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.4, ease: "linear" }}
                        >
                          2,1
                        </motion.span>
                        <span className="text-sm ml-1">млн</span>
                        <span className="mx-2 opacity-50">→</span>
                        <motion.span 
                          className="text-2xl font-bold text-[#25BD6B]"
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                          transition={{ duration: 0.4, delay: 0.5, ease: "linear" }}
                        >
                          5+
                        </motion.span>
                        <span className="text-sm ml-1">млн</span>
                      </div>
                      <p className="text-xs text-white/70 mt-1">2019 → 2026</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-white/70">Доходность аренды</p>
                      <motion.p 
                        className="text-2xl font-bold text-[#25BD6B]"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.6, ease: "linear" }}
                      >
                        20-30%
                      </motion.p>
                      <p className="text-xs text-white/70 mt-1">годовых</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Правая колонка с информацией (3/5) */}
          <motion.div 
            className="flex flex-col order-1 lg:order-2 lg:col-span-3"
            style={{ y: textY }}
          >
            <motion.div
              variants={itemVariants}
              className="mb-6"
            >
              {/* Возвращаем темные цвета текста */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
                Инвестиции в Горный Алтай
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed max-w-2xl">
                Недвижимость в Горном Алтае — инвестиция с гарантированным ростом. Развитие инфраструктуры, ограниченное предложение и растущий туризм делают регион одним из самых перспективных в России.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-2">
              {/* Блок 1: Туризм */}
              <motion.div
                // Возвращаем светлый фон и темный текст
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex"
                variants={itemVariants}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: "linear" }}
              >
                <div className="w-12 h-12 rounded-full bg-[#25BD6B]/10 flex items-center justify-center flex-shrink-0 mr-4">
                  <PeopleIcon className="text-[#25BD6B]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Рост туризма</h3>
                  <p className="text-gray-600">Увеличение потока с 2,1 млн до 3,5+ млн туристов за 4 года. Прогноз: 5+ млн к 2026 году.</p>
                </div>
              </motion.div>
              
              {/* Блок 2: Недвижимость */}
              <motion.div
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex"
                variants={itemVariants}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: "linear" }}
              >
                <div className="w-12 h-12 rounded-full bg-[#25BD6B]/10 flex items-center justify-center flex-shrink-0 mr-4">
                  <HomeWorkIcon className="text-[#25BD6B]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Растущие цены</h3>
                  <p className="text-gray-600">Ежегодный рост цен на земельные участки +20-40%. Апартаменты: от 300 тыс. до 600 тыс. ₽/м².</p>
                </div>
              </motion.div>
              
              {/* Блок 3: Доходность */}
              <motion.div
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex"
                variants={itemVariants}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.4, ease: "linear" }}
              >
                <div className="w-12 h-12 rounded-full bg-[#25BD6B]/10 flex items-center justify-center flex-shrink-0 mr-4">
                  <TrendingUpIcon className="text-[#25BD6B]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Высокая доходность</h3>
                  <p className="text-gray-600">Доходность от аренды апартаментов и баз отдыха — 20-30% годовых. В 2-3 раза выше, чем в среднем по России.</p>
                </div>
              </motion.div>
              
              {/* Кнопка подробнее */}
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.5, ease: "linear" }}
              >
                <Link href="/channel/1" className="block h-full">
                  <motion.div 
                    // Возвращаем светлые стили для кнопки
                    className="bg-gray-50 border border-gray-200 hover:border-[#25BD6B]/50 hover:bg-[#25BD6B]/10 rounded-2xl p-5 shadow-sm flex items-center transition-all duration-200 cursor-pointer group h-full"
                    whileHover={{ 
                      y: -2, 
                      boxShadow: "0 4px 8px rgba(37, 189, 107, 0.15)",
                      transition: { duration: 0.2, ease: "linear" }
                    }}
                    whileTap={{ 
                      y: 0, 
                      boxShadow: "0 0 0 rgba(37, 189, 107, 0)",
                      transition: { duration: 0.1 }
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#25BD6B]/10 group-hover:bg-[#25BD6B]/20 flex items-center justify-center flex-shrink-0 mr-4 transition-all duration-300">
                      <ArrowForwardIcon className="text-[#25BD6B]" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-[#25BD6B] group-hover:text-[#1E9D59] transition-colors mb-2">Узнать подробнее</h3>
                      <p className="text-gray-600">Больше информации о выгодах инвестиций в Горный Алтай</p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default WhyInvest; 