"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { NewsArticle } from "@/types/news";
import { ArticleCard } from "./ArticleCard";
import BlogHero from "@/components/sections/ChannelHero";
import { staggerContainer } from "@/lib/animations/scrollAnimations";
import { SectionTitle } from "@/components/shared/SectionTitle";

interface ChannelViewProps {
  articles: NewsArticle[];
}

export default function ChannelView({ articles }: ChannelViewProps) {
  const TELEGRAM_CHANNEL_URL = "https://t.me/zemlialtaya";

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="content-container py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12">
          <SectionTitle>Наш канал</SectionTitle>
        </div>

        <motion.div
           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
           variants={staggerContainer ? staggerContainer(0.05, 0.1) : {}}
           initial="hidden"
           animate="visible"
         >
          {articles && articles.length > 0 ? (
              articles.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/channel/${article.id}`}
                  className="block transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded-lg"
                >
                  <ArticleCard post={article} index={index} />
                </Link>
              ))
          ) : (
              <p className="text-center text-gray-500 py-10 md:col-span-2 lg:col-span-3">
                Статьи не найдены.
              </p>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 md:mt-20"
        >
          <div className="bg-gradient-to-r from-[#0e463e] to-[#0c3c34] rounded-2xl overflow-hidden shadow-lg p-6 md:p-8 lg:p-10 text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3">Больше новостей в нашем Telegram</h2>
            <p className="text-gray-100 mb-6 text-sm md:text-base max-w-xl mx-auto">Присоединяйтесь, чтобы первыми узнавать об обновлениях и эксклюзивных предложениях.</p>
            <a 
              href={TELEGRAM_CHANNEL_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center bg-white text-[#0e463e] hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-all shadow-md text-sm md:text-base"
            >
              Подписаться в Telegram
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
} 