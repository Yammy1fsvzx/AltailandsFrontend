import React from 'react';
import Hero from '@/components/sections/Hero';
import LatestOffers from '@/components/sections/LatestOffers';
import Quiz from '@/components/sections/Quiz';
import { getLandPlots } from '@/lib/api/catalog';
import { getActiveQuiz } from '@/lib/api/quiz';
import WhyInvest from '@/components/sections/WhyInvest';

export default async function HomePage() {
  const latestOffersData = await getLandPlots({
    ordering: '-created_at',
    page_size: 6
  });

  const quizData = await getActiveQuiz();

  return (
    <main className="flex flex-col justify-between">
      <Hero />
      <WhyInvest />
      <Quiz quizData={quizData} />
      <LatestOffers listings={latestOffersData.results} />
    </main>
  );
}
