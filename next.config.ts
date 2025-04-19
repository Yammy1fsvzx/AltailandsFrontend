import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Или 'http' если ваш прод на http
        hostname: 'altailands.ru', // Ваш домен в продакшене
        port: '', // Пусто, если стандартные порты 80/443
        pathname: '/backend/media/**', // Путь к медиа в продакшене
      },
      {
        protocol: 'http', // HTTP для локальной разработки
        hostname: 'localhost', // Доступ через Nginx
        port: '', // Пусто, так как Nginx слушает стандартный порт 80
        pathname: '/media/**', // Путь к медиа через Nginx
      },
      {
        protocol: 'http', // HTTP для локальной разработки
        hostname: 'nginx', // Доступ через Nginx
        port: '', // Пусто, так как Nginx слушает стандартный порт 80
        pathname: '/media/**', // Путь к медиа через Nginx
      },
    ],
  },
};

export default nextConfig;
