'use client';

// Переносим все импорты сюда
import React, { useEffect, useState } from 'react'; 
import Link from 'next/link';
import Image from 'next/image'; 
import { motion } from 'framer-motion';
import { ChevronLeft, Clock, Share2, ExternalLink, Paperclip, FileText, Video, Film } from 'lucide-react'; 
// Импорт PostData нужен для типизации пропса
import { NewsArticle, MediaFile } from '@/types/news'; 
import PageHero from '@/components/common/PageHero'; // <-- Import PageHero

// Интерфейс для пропсов нового компонента
interface ChannelPostClientViewProps {
  post: NewsArticle;
}

// Функция создания ели остается здесь, т.к. используется в JSX
// const createTreePath = (x: number, height: number, width: number): string => { ... };

// Сам компонент теперь принимает post как проп
const ChannelPostClientView: React.FC<ChannelPostClientViewProps> = ({ post }) => {
  const TELEGRAM_CHANNEL_URL = "https://t.me/zemlialtaya"; // <-- Added constant

  // Функция sharePost остается здесь, т.к. использует navigator и window
  const sharePost = () => {
    if (!post) return; 
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: 'Посмотрите эту интересную статью на сайте Altailands',
        url: window.location.href,
      })
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Ссылка скопирована в буфер обмена'))
        .catch(err => console.log('Could not copy text: ', err));
    }
  };
  
  // Обработка ненайденного поста теперь будет в page.tsx
  // if (!post) { ... }

  // Форматирование даты остается здесь
  let formattedDate = 'Дата не указана';
  if (post.created_at) {
    try {
       formattedDate = new Date(post.created_at).toLocaleDateString('ru-RU', {
         day: 'numeric', 
         month: 'long', 
         year: 'numeric' 
       });
    } catch (error) {
       console.error("Error formatting date:", post.created_at, error);
    }
  }

  // --- Find the main image URL and add logging --- 
  console.log("Post media files:", post.media_files); // Log the whole array
  const mainImage = post.media_files?.find(file => file.is_main && file.type === 'image');
  console.log("Found main image object:", mainImage); // Log the found object
  const imageUrl = mainImage?.file_url; 
  console.log("Image URL to use:", imageUrl); // Log the final URL

  // --- Get other media files (excluding the main image if it exists) --- 
  const otherMediaFiles = post.media_files?.filter(file => 
      !(mainImage && file.id === mainImage.id)
  ).sort((a, b) => a.order - b.order); // Sort by order

  // Helper to get file icon
  const getFileIcon = (type: MediaFile['type']) => {
    switch (type) {
      case 'video': return <Film size={18} className="mr-2 flex-shrink-0" />;
      case 'document': return <FileText size={18} className="mr-2 flex-shrink-0" />;
      default: return <Paperclip size={18} className="mr-2 flex-shrink-0" />;
    }
  };

  return (
    <>
      <PageHero title={post.title} /> {/* <-- Use PageHero */} 
      
      {/* Main content container - applies overall padding */}
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        
        {/* Metadata Bar */}    
        <div className="max-w-4xl mx-auto mb-8 md:mb-12 pb-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
           <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-2 text-sm text-gray-500">
             {post.category && (
               <Link href={`/channel?category=${post.category.slug}`} 
                     className="inline-block bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-medium hover:bg-teal-100 transition-colors w-fit">
                 {post.category.name}
               </Link>
             )}
             <div className="flex items-center">
                <Clock size={14} className="mr-1.5 flex-shrink-0" /> 
                <span>{formattedDate}</span>
             </div>
           </div>
           <div className="flex items-center gap-3 self-end sm:self-center">
               <Link 
                 href="/channel" 
                 className="inline-flex items-center text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
               >
                 <ChevronLeft size={16} className="mr-1" />
                 Назад
               </Link>
               <button 
                 onClick={sharePost}
                 className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors text-sm"
               >
                 <Share2 size={14} className="mr-1.5" />
                 <span>Поделиться</span>
               </button>
           </div>
        </div>

        {/* Article Content Area (constrained width for readability) */}
        <div className="max-w-4xl mx-auto">
           {/* --- Use imageUrl for the main image --- */}
           {imageUrl && (
             <div className="relative w-full aspect-video mb-8 md:mb-10 rounded-xl overflow-hidden shadow-lg">
               <Image
                 src={imageUrl} // Use the found URL
                 alt={post.title}
                 layout="fill"
                 objectFit="cover"
                 priority
               />
             </div>
           )}

           {/* Short Description (Optional) */}
           {post.short_description && (
             <p className="text-lg text-gray-700 mb-8 md:mb-10 border-l-4 border-teal-500 pl-4">
               {post.short_description} {/* Removed italic, changed color */}
             </p>
           )}

           {/* Main Content (Prose handles styling and width) */}
           <div 
              className="prose prose-lg max-w-none prose-slate prose-img:rounded-xl prose-headings:text-gray-800 prose-a:text-teal-600 hover:prose-a:text-teal-700 prose-blockquote:border-l-teal-500 prose-blockquote:text-gray-600 prose-headings:font-semibold prose-blockquote:bg-slate-50/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-figure:my-6 prose-figcaption:text-center prose-figcaption:mt-2 prose-figcaption:text-sm whitespace-pre-wrap mb-12 md:mb-16" // Added bottom margin
             dangerouslySetInnerHTML={{ __html: post.content || '' }} 
           />

           {/* --- Section for Other Media Files --- */}
           {otherMediaFiles && otherMediaFiles.length > 0 && (
             <div className="mt-10 pt-8 border-t border-gray-200">
               <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">Дополнительные материалы:</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                 {otherMediaFiles.map((file, index) => (
                   <div key={file.id} className="border border-gray-200 rounded-lg overflow-hidden">
                     {file.type === 'image' ? (
                       // Display other images
                       <div className="relative aspect-video bg-gray-100">
                         <Image 
                            src={file.file_url}
                            alt={file.description || `Медиафайл ${file.id}`}
                            layout="fill"
                            objectFit="cover"
                         />
                       </div>
                     ) : (
                       // Display link for non-image files
                       <a 
                         href={file.file_url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="flex items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors h-full"
                       >
                         {getFileIcon(file.type)}
                         <span className="text-sm text-gray-700 hover:text-gray-900 break-words">
                           {file.description || `${file.type_display} ${index + 1}`}
                           {!file.description && (
                              <span className="block text-xs text-gray-500">({file.type_display})</span>
                           )}
                         </span>
                       </a>
                     )}
                   </div>
                 ))}
               </div>
             </div>
           )}
        </div>

        {/* --- Insert New Telegram CTA Block --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }} // Use animate, similar to ChannelView
          transition={{ duration: 0.5, delay: 0.3 }} // Use same transition as ChannelView
          className="max-w-4xl mx-auto mt-12 md:mt-16" // Kept existing margin
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
    </>
  );
};

export default ChannelPostClientView; 