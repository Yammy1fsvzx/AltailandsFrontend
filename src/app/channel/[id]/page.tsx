// Импортируем только необходимое для серверного компонента
import React from 'react'; 
import Link from 'next/link';
// Импортируем notFound для обработки ненайденных постов
import { notFound } from 'next/navigation'; 
// Импортируем данные и тип
import { PostData, samplePosts } from '@/data/channelData'; 
// Импортируем новый клиентский компонент
import ChannelPostClientView from '@/components/channel/ChannelPostClientView';
import { fetchNewsArticleById } from '@/lib/api/fetchNews'; // Import the new fetch function
import { NewsArticle } from '@/types/news'; // Import the NewsArticle type

// Интерфейс для params остается прежним для страницы
interface ChannelPostPageProps {
  params: {
    id: string; // Expect id as a string from the URL
  };
}

// Вспомогательная функция для разрешения params
async function getResolvedParams(params: { id: string }) {
  return await Promise.resolve(params);
}

// Основной компонент страницы (уже async)
export default async function ChannelPostPage({ params }: ChannelPostPageProps) {
  // Используем вспомогательную функцию для разрешения params
  const resolvedParams = await getResolvedParams(params);
  const articleId = parseInt(resolvedParams.id, 10); // Convert id string to number

  // Validate if the id is a number
  if (isNaN(articleId)) {
    console.error(`Invalid article ID received: ${resolvedParams.id}`);
    notFound(); // Show 404 if id is not a valid number
  }

  // Fetch the article by its numeric ID
  const article: NewsArticle | null = await fetchNewsArticleById(articleId);

  // If article fetch failed or article not found, show 404
  if (!article) {
    notFound();
  }

  // Возвращаем клиентский компонент, передавая ему данные поста
  return <ChannelPostClientView post={article} />;
}

// Удаляем всю старую разметку и логику, которая переехала в ChannelPostClientView 