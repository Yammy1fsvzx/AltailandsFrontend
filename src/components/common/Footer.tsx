'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FooterData, MenuItem, SocialLink, Contact } from '@/types/site';
import { motion } from 'framer-motion';

// SVG иконки социальных сетей (взяты из примера пользователя)
const socialIcons: Record<string, React.ReactNode> = {
  vk: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.915 13.028c-.388-.49-.277-.708 0-1.146.005-.005 3.208-4.431 3.538-5.932l.002-.001c.164-.547 0-.949-.793-.949h-2.624c-.668 0-.976.345-1.141.731 0 0-1.336 3.198-3.226 5.271-.61.599-.892.791-1.225.791-.164 0-.419-.192-.419-.739V5.949c0-.656-.187-.949-.74-.949H9.161c-.419 0-.668.306-.668.591 0 .622.945.765 1.043 2.515v3.797c0 .832-.151.985-.486.985-.892 0-3.057-3.211-4.34-6.886-.259-.713-.512-1.001-1.185-1.001H.9c-.749 0-.9.345-.9.731 0 .682.892 4.073 4.148 8.553C6.318 17.343 9.374 19 12.154 19c1.671 0 1.875-.368 1.875-1.001 0-2.922-.151-3.198.686-3.198.388 0 1.056.192 2.616 1.667C19.114 18.217 19.407 19 20.405 19h2.624c.748 0 1.127-.368.909-1.094-.499-1.527-3.871-4.668-4.023-4.878z"/>
    </svg>
  ),
  telegram: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.77-1.17 3.35-1.37 3.73-1.37.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .24z"/>
    </svg>
  ),
  youtube: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
    </svg>
  ),
  whatsapp: (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.05 4.91A9.816 9.816 0 0012.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.264 8.264 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 012.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.16-.48-.27z"/>
    </svg>
  )
};

// Определяем тип пропсов для Footer
interface FooterProps {
  contactData: Contact | null;
}

const Footer: React.FC<FooterProps> = ({ contactData }) => {
  // Используем статичные данные только для того, что не пришло из API
  // или как fallback, если contactData === null
  const fallbackContact: Contact = {
    id: 0,
    phone: "+7 (000) 000-00-00",
    whatsapp: null,
    email: "info@example.com",
    office_address: "Адрес не указан",
    created_at: "",
    updated_at: "",
    working_hours: []
  };
  const contacts = contactData || fallbackContact;

  // Статичные части, которые не зависят от API
  const staticParts = {
      logo: {
        src: "/images/logo.png",
        alt: "ЗемлиАлтая",
      },
      companyDescription:
        "Мы помогаем приобрести нашим партнерам земельные участки для строительства турбаз, отелей и частных домов в живописных местах Горного Алтая.",
      socialLinks: [
        { id: "tg", name: "Telegram", icon: "telegram", url: "https://t.me/+pZojQV8NI45jOGJi" },
        { id: "wa", name: "WhatsApp", icon: "whatsapp", url: "https://wa.me/79030730909" },
      ],
      menu: [
        { id: 1, title: "Главная", path: "/" },
        { id: 2, title: "Каталог", path: "/catalog" },
        { id: 3, title: "Контакты", path: "/contacts" },
        { id: 4, title: "Канал", path: "/channel" },
      ],
       copyright: `© ${new Date().getFullYear()} ЗемлиАлтая. Все права защищены.`,
      privacyPolicy: {
        text: "Политика конфиденциальности",
        url: "/privacy-policy",
      },
  };

  const [stars, setStars] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const generateStars = () => {
      const starsCount = 150;
      const newStars = [];
      for (let i = 0; i < starsCount; i++) {
        const randomSeed = i * Math.PI * (1 + Math.random() * 0.5);
        const xPos = (Math.sin(randomSeed * 1.5) * 0.5 + 0.5) * 1920;
        const yPos = Math.random() * 400;
        const isHighStar = yPos < 150;
        const size = 0.3 + Math.pow(Math.random(), 2) * (isHighStar ? 2.5 : 2.0);
        const brightness = (isHighStar ? 0.4 : 0.3) + Math.random() * 0.4;
        const maxBrightness = brightness + 0.2 + Math.random() * 0.3;
        const animDuration = 1.5 + Math.random() * 4;
        const animDelay = Math.random() * 5;
        const scaleChange = 1 + (Math.random() > 0.7 ? Math.random() * 0.5 : Math.random() * 0.2);
        newStars.push(
          <motion.circle 
            key={`footer-star-${i}`} 
            cx={xPos} cy={yPos} r={size}
            fill={Math.random() > 0.9 ? "#E3F6FF" : "white"} 
            opacity={brightness}
            initial={{ opacity: brightness * 0.7 }}
            animate={{ opacity: [brightness, maxBrightness, brightness], scale: [1, scaleChange, 1] }}
            transition={{ repeat: Infinity, duration: animDuration, delay: animDelay, ease: "easeInOut", repeatType: "reverse" }}
          />
        );
      }
      setStars(newStars);
    };
    generateStars();
  }, []);
  
  return (
    <footer className="bg-gradient-to-b from-[#0e463e] to-[#0c3c34] text-white relative pt-20 overflow-hidden">
      {/* SVG фон и иллюстрации */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0e463e] to-[#0c3c34] opacity-90"></div>
        <svg className="absolute bottom-0 w-full z-0" viewBox="0 0 1920 400" preserveAspectRatio="xMinYMin slice">
          <defs>
            <linearGradient id="footerMountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0B3B33" />
              <stop offset="100%" stopColor="#072F29" />
            </linearGradient>
            <linearGradient id="footerForegroundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#072F29" />
              <stop offset="100%" stopColor="#041F1B" />
            </linearGradient>
            <linearGradient id="footerTreeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0A352E" />
              <stop offset="100%" stopColor="#072A24" />
            </linearGradient>
            <filter id="footerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="10" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g className="footer-stars">{stars}</g>
          <path d="M0,300 L200,220 L400,260 L600,200 L800,280 L1000,190 L1200,240 L1400,210 L1600,250 L1800,230 L1920,260 L1920,400 L0,400 Z" fill="url(#footerMountainGradient)" opacity="0.8"/>
          <path d="M0,330 L100,300 L200,320 L300,290 L500,340 L700,280 L900,350 L1200,300 L1400,340 L1600,290 L1800,330 L1920,310 L1920,400 L0,400 Z" fill="url(#footerForegroundGradient)" opacity="0.9"/>
          <g opacity="0.7">
            <path d="M300,350 L290,330 L295,332 L285,315 L290,318 L285,300 L290,305 L287,290 L290,280 L293,290 L295,305 L300,318 L305,315 L295,332 L305,330 L300,350 Z" fill="url(#footerTreeGradient)" />
            <path d="M320,360 L310,335 L315,338 L305,318 L310,322 L305,300 L313,310 L310,280 L315,270 L320,280 L317,310 L325,322 L320,318 L310,338 L330,335 L320,360 Z" fill="url(#footerTreeGradient)" />
            <path d="M1600,350 L1590,330 L1595,332 L1585,315 L1590,318 L1585,300 L1590,305 L1587,290 L1590,280 L1593,290 L1595,305 L1600,318 L1605,315 L1595,332 L1605,330 L1600,350 Z" fill="url(#footerTreeGradient)" />
            <path d="M1630,355 L1620,335 L1625,338 L1615,320 L1620,322 L1615,305 L1623,312 L1620,290 L1625,280 L1630,290 L1627,312 L1635,322 L1630,320 L1620,338 L1640,335 L1630,355 Z" fill="url(#footerTreeGradient)" />
          </g>
          <circle cx="1700" cy="120" r="60" fill="white" opacity="0.08" filter="url(#footerGlow)" />
          <circle cx="1700" cy="120" r="30" fill="white" opacity="0.2" />
        </svg>
      </div>
      
      {/* Основной раздел футера */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Логотип и описание компании */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center mb-5">
              <motion.div 
                className="bg-white/90 backdrop-blur-sm rounded-full h-12 w-12 flex items-center justify-center mr-3 shadow-md"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Image 
                  src={staticParts.logo.src || '/images/logo.png'}
                  alt={staticParts.logo.alt || 'Логотип'}
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </motion.div>
              <span className="text-xl text-white">
                <span className="text-white">Земли</span>
                <span className="text-white">Алтая</span>
              </span>
            </Link>
            <motion.p 
              className="text-gray-300 mb-8 text-sm leading-relaxed max-w-md"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {staticParts.companyDescription}
            </motion.p>
            <div className="flex space-x-4">
              {staticParts.socialLinks.map((social: SocialLink, index) => (
                <motion.a 
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-[#25BD6B] transition-colors bg-[#0a3832]/70 backdrop-blur-sm p-3 rounded-full"
                  whileHover={{ 
                    scale: 1.1, 
                    backgroundColor: 'rgba(37, 189, 107, 0.2)',
                    color: '#25BD6B' 
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  aria-label={social.name}
                >
                  {socialIcons[social.icon] || social.name}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Навигация */}
          <motion.div 
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-5 text-[#25BD6B]">Навигация</h3>
            <ul className="space-y-3">
              {staticParts.menu.slice(0, 6).map((item: MenuItem, index) => (
                <motion.li 
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index + 0.4, duration: 0.5 }}
                >
                  <Link 
                    href={item.path}
                    className="text-gray-300 hover:text-[#25BD6B] transition-colors inline-block"
                  >
                    {item.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Контакты */}
          <motion.div 
            className="lg:col-span-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-5 text-[#25BD6B]">Контакты</h3>
            <ul className="space-y-4">
              {/* Телефон */}
              {contacts.phone && (
                <motion.li 
                  className="flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-9 h-9 flex items-center justify-center bg-[#0a3832]/70 backdrop-blur-sm rounded-full mr-3 flex-shrink-0">
                    <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" /></svg>
                  </div>
                  <a href={`tel:${contacts.phone.replace(/[^\d+]/g, '')}`} className="text-gray-300 hover:text-[#25BD6B]">
                    {contacts.phone}
                  </a>
                </motion.li>
              )}
              {/* Email */}
              {contacts.email && (
                <motion.li 
                  className="flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-9 h-9 flex items-center justify-center bg-[#0a3832]/70 backdrop-blur-sm rounded-full mr-3 flex-shrink-0">
                    <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
                  </div>
                  <a href={`mailto:${contacts.email}`} className="text-gray-300 hover:text-[#25BD6B]">
                    {contacts.email}
                  </a>
                </motion.li>
              )}
              {/* Адрес */}
              {contacts.office_address && (
                <motion.li 
                  className="flex items-center"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-9 h-9 flex items-center justify-center bg-[#0a3832]/70 backdrop-blur-sm rounded-full mr-3 flex-shrink-0">
                    <svg className="w-4 h-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                  </div>
                  <span className="text-gray-300">{contacts.office_address}</span>
                </motion.li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Нижняя часть футера */}
      <div className="border-t border-[#0c3c34]/50 relative z-10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <motion.p 
            className="text-gray-400 text-sm mb-4 md:mb-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {staticParts.copyright}
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Link 
              href={staticParts.privacyPolicy.url} 
              className="text-gray-400 hover:text-[#25BD6B] text-sm"
            >
              {staticParts.privacyPolicy.text}
            </Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 