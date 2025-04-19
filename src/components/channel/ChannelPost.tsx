import React from 'react';
import Image from 'next/image';
import { FiVideo, FiPlayCircle } from 'react-icons/fi'; // Добавили FiPlayCircle

// Обновляем тип данных для поста/статьи
export interface PostData {
  id: number;
  author?: string; // Автор (может быть статичным для канала)
  date: string; // Дата поста
  title: string; // Добавляем заголовок статьи
  text?: string; // Полный текст статьи (теперь необязателен для карточки)
  imageUrl?: string; // URL изображения
  videoUrl?: string; // URL видео (для кружков или обычных видео)
  isCircleVideo?: boolean; // Флаг для видео-кружка
  category: string; // Добавляем категорию
  excerpt: string; // Добавляем отрывок/описание для карточки
}

interface ChannelPostProps {
  post: PostData;
}

const ChannelPost: React.FC<ChannelPostProps> = ({ post }) => {

  // Функция для форматирования даты (простой пример)
  const formatDate = (dateString: string) => {
    try {
      return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(dateString));
    } catch (e) {
      return dateString; // Возвращаем исходную строку в случае ошибки
    }
  };

  const channelName = post.author || 'Земли Алтая';
  const avatarPlaceholder = channelName.charAt(0).toUpperCase(); // Первая буква для аватара

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden p-5 sm:p-6 border border-gray-100">
      {/* Шапка поста (аватар, автор, дата) */}
      <div className="flex items-center justify-between mb-4">
         <div className="flex items-center space-x-3">
             {/* Плейсхолдер аватара */}
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                {avatarPlaceholder}
            </div>
            <div>
                <span className="font-semibold text-gray-800 text-base">{channelName}</span> 
                 {/* Дата под именем */}
                <span className="block text-gray-400 text-xs leading-tight">{formatDate(post.date)}</span> 
            </div>
         </div>
         {/* Можно добавить иконку "меню" */}
         {/* <button className="text-gray-400 hover:text-gray-600">...</button> */}
      </div>

      {/* Контент поста */}
      <div className="space-y-4">
        {/* Текст (позже заменим на excerpt в карточке) */}
        {post.text && (
          <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap line-clamp-4">{post.text}</p> // Временно оставим полный текст с line-clamp
        )}

        {/* Изображение */}
        {post.imageUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-100">
            <Image 
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
            />
          </div>
        )}

        {/* Видео-кружок (улучшенный плейсхолдер) */}
        {post.isCircleVideo && post.videoUrl && (
            <div className="relative w-32 h-32 group cursor-pointer">
                 {/* Сам кружок */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden">
                    <FiVideo className="w-10 h-10 text-white opacity-50 z-10 relative" />
                </div>
                 {/* Иконка Play по центру поверх */}
                 <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     <FiPlayCircle className="w-12 h-12 text-white/80" />
                 </div>
             </div>
        )}

        {/* TODO: Добавить обработку обычных видео, если нужно */}
      </div>
      {/* Тег/Категория (добавим в новом дизайне) */}
      <div className="mt-4">
        <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
            {post.category}
        </span>
      </div>
    </div>
  );
};

export default ChannelPost; 