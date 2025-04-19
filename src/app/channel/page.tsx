// 'use client';

import React from 'react';
import Link from 'next/link';
// import { PostData, samplePosts } from '@/data/channelData';
import { ArticleCard } from '@/components/channel/ArticleCard';
// import BlogHero from '@/components/sections/ChannelHero'; // Remove old hero if exists
import PageHero from '@/components/common/PageHero'; // Import new common Hero
import { motion } from 'framer-motion';
import { staggerContainer } from '@/lib/animations/scrollAnimations';
import { fetchNewsArticles } from '@/lib/api/fetchNews';
import { NewsArticle } from '@/types/news';
import ChannelView from "@/components/channel/ChannelView";
import ChannelViewSkeleton from '@/components/channel/ChannelViewSkeleton'; // <-- Import Skeleton

const TELEGRAM_CHANNEL_URL = 'https://t.me/zemlialtaya';

// Metadata can remain static or be generated dynamically later
export const metadata = {
  title: "Канал | Altailands",
  description: "Новости и статьи о проекте Altailands",
};

// Make the component async to fetch data
export default async function ChannelPage() {
  // Fetch news articles from the API
  const newsArticles: NewsArticle[] = await fetchNewsArticles();

  // Check if data is not loaded yet (or fetch failed)
  // Render skeleton if the array is empty. Server components often render
  // initially with empty data before the async fetch completes.
  if (!newsArticles || newsArticles.length === 0) {
    console.warn("No news articles fetched or fetch failed, rendering skeleton.");
    return <ChannelViewSkeleton />;
  }

  // Pass the fetched articles to the view component
  return (
    <>
      <PageHero title="Канал" /> {/* <-- Add PageHero here */}
      <ChannelView articles={newsArticles} />
    </>
  );
}
