'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { HeaderData, MenuItem } from '@/types/site'; // Импортируем типы
import { usePathname } from 'next/navigation';

// Оставляем статичные данные для логотипа и меню
const staticHeaderDataBase: Omit<HeaderData, 'phone'> = {
  logo: {
    src: "/images/logo.png", // Убедитесь, что этот файл есть в public/images
    alt: "ЗемлиАлтая",
  },
  menu: [
    { id: 1, title: "Главная", path: "/" },
    { id: 2, title: "Каталог", path: "/catalog" },
    { id: 3, title: "Канал", path: "/channel" },
    { id: 4, title: "Контакты", path: "/contacts" },
  ],
};

// Определяем тип пропсов для Header
interface HeaderProps {
  phoneNumber: string | null;
}

/**
 * Компонент Header
 * Адаптирован из примера пользователя
 */
const Header: React.FC<HeaderProps> = ({ phoneNumber }) => {
  // Используем статичные данные для лого и меню
  const data = staticHeaderDataBase; 
  // Используем номер телефона из пропсов, если он есть, иначе дефолтный
  const displayPhone = phoneNumber || "+7 (000) 000-00-00"; // Дефолтный номер

  // Состояния и хуки из примера
  const [scrollY, setScrollY] = useState(0);
  // Добавили проверку window для рендеринга на сервере
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0); 
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Эффект для отслеживания скролла и ресайза
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Добавляем слушатели только на клиенте
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);

      // Вызываем handleResize сразу для установки начальной ширины
      handleResize();

      // Убираем слушатели
      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const showBackground = scrollY > 50;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    // Блокируем/разблокируем скролл body только на клиенте
    if (typeof document !== 'undefined') {
      document.body.style.overflow = !mobileMenuOpen ? 'hidden' : '';
    }
  };

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
  };

  // Варианты анимации для мобильного меню
  const menuVariants = {
    closed: {
      x: '100%',
      transition: {
        type: 'tween',
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.4,
        ease: [0.4, 0.0, 0.2, 1]
      }
    }
  };

  // Варианты анимации для пунктов меню
  const menuItemVariants = {
    closed: { opacity: 0, x: 50 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${ 
        showBackground
          ? 'bg-white shadow-md py-3'
          : 'bg-transparent py-6' 
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.2, 0.0, 0.0, 1.0]
      }}
    >
      <div className="max-w-[1480px] mx-auto px-4 sm:px-8 flex items-center justify-between">
        {/* Логотип */}
        <Link
          href="/"
          className="flex items-center cursor-pointer group"
        >
          <div className={`h-10 w-10 sm:h-12 sm:w-12 ${ 
            showBackground ? 'bg-gray-100' : 'bg-white' // Немного изменил фон для контраста
          } rounded-full flex items-center justify-center mr-3 transition-colors overflow-hidden shadow-md`}>
            <Image
              src={data.logo.src || "/images/logo.png"} // Дефолтное значение
              alt={data.logo.alt || "Лого"}
              width={36}
              height={36}
              className="object-contain"
              priority // Добавляем priority для LCP (Логотип часто является LCP)
            />
          </div>
          <span className={`text-lg sm:text-xl transition-colors ${ 
            showBackground ? 'text-gray-900' : 'text-white' // Используем Tailwind цвета
          } group-hover:text-[#25BD6B]`}> {/* Цвет ховера можно будет настроить */}
            {data.logo.alt || "Лого Проекта"}
          </span>
        </Link>

        {/* Навигационное меню - десктоп */}
        <nav className="hidden md:flex items-center space-x-10">
          {data.menu.map((item: MenuItem, index: number) => {
            const isActive = pathname === item.path;

            return (
              <Link
                key={item.id}
                href={item.path}
                className={`relative transition-colors hover:text-[#25BD6B] ${ 
                  isActive 
                    ? `font-semibold ${showBackground ? 'text-[#25BD6B]' : 'text-[#25BD6B]'}`
                    : `${showBackground ? 'text-gray-800' : 'text-white'}`
                }`}
              >
                {item.title}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#25BD6B]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>

        {/* Кнопка телефона - десктоп */}
        <motion.a
          href={`tel:${displayPhone.replace(/[^\d+]/g, '')}`}
          className={`${ 
            showBackground
              ? 'text-gray-800 border-gray-300 bg-gray-50 hover:bg-gray-100'
              : 'text-white border-[rgba(255,255,255,0.3)] bg-white/5 backdrop-blur-sm hover:bg-white/10' 
          } border px-4 sm:px-5 py-2 sm:py-2.5 rounded-full items-center space-x-2 transition-all hidden md:flex`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* SVG иконка телефона - изменяем цвет динамически */}
          <svg 
            viewBox="0 0 24 24" 
            // Убираем text-[#fff] и добавляем динамический класс
            className={`w-4 h-4 sm:w-5 sm:h-5 fill-current transition-colors ${showBackground ? 'text-gray-800' : 'text-white'}`} 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
          <span className="font-medium">{displayPhone}</span>
        </motion.a>

        {/* Гамбургер для мобильного меню */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 p-2 rounded-md z-50 relative" // Добавил relative
          onClick={toggleMobileMenu}
          aria-label="Открыть меню"
        >
          {/* Исправил анимацию иконки гамбургера */}
          <span className={`block w-6 h-0.5 transition-all duration-300 ${ 
            mobileMenuOpen ? 'bg-white rotate-45 translate-y-[7px]' : (showBackground ? 'bg-gray-800' : 'bg-white')
          }`}></span>
          <span className={`block w-6 h-0.5 my-1 transition-opacity duration-300 ${ 
             mobileMenuOpen ? 'opacity-0' : (showBackground ? 'bg-gray-800' : 'bg-white')
          }`}></span>
          <span className={`block w-6 h-0.5 transition-all duration-300 ${ 
            mobileMenuOpen ? 'bg-white -rotate-45 -translate-y-[7px]' : (showBackground ? 'bg-gray-800' : 'bg-white')
          }`}></span>
        </button>
      </div>

      {/* Мобильное меню */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-[#0c3c34] z-40" 
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="flex flex-col justify-start items-stretch h-full w-full px-6 pt-24 pb-12 overflow-y-auto">
              <nav className="flex flex-col space-y-4 items-stretch">
                {data.menu.map((item: MenuItem, index: number) => {
                  const isActive = pathname === item.path;

                  return (
                    <motion.div
                      key={item.id}
                      custom={index}
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={menuItemVariants}
                      className="w-full border-b border-white/10" 
                    >
                      <Link
                        href={item.path}
                        onClick={handleCloseMenu}
                        className={`block py-4 text-xl transition-colors duration-300 ${ 
                           isActive ? 'text-[#25BD6B] font-semibold' : 'text-gray-200 hover:text-white'
                        }`}
                      >
                        {item.title}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  custom={data.menu.length}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={menuItemVariants}
                  className="w-full pt-6"
                >
                  <a
                    href={`tel:${displayPhone.replace(/[^\d+]/g, '')}`}
                    className="inline-flex items-center justify-center w-full px-6 py-3 border border-white/20 text-base font-medium rounded-lg shadow-sm text-gray-100 bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white/50 transition-colors"
                    onClick={handleCloseMenu}
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current mr-3" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
                    </svg>
                    {displayPhone}
                  </a>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header; 