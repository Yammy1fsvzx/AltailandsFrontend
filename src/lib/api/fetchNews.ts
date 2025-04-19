import { NewsArticle } from "@/types/news";
import { getApiBaseUrl } from './utils'; // Import the utility function
// import { PaginatedResponse } from '@/types/catalog'; // Уберите, если не используется

/**
 * Загружает список новостных статей из API.
 * @returns {Promise<NewsArticle[]>} Массив новостных статей или пустой массив в случае ошибки.
 */
export async function fetchNewsArticles(): Promise<NewsArticle[]> {
  const baseUrl = getApiBaseUrl(); // Get base URL dynamically
  // Construct the full URL. Assuming endpoint starts with /v1/...
  const endpoint = '/v1/news/articles/';
  const url = `${baseUrl}${endpoint}`;
  const env = typeof window === 'undefined' ? 'SERVER' : 'CLIENT';
  console.log(`Fetching news articles from [${env}]: ${url}`);

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!response.ok) {
      // Log the error status and text for debugging
      console.error(`Failed to fetch news articles: ${response.status} ${response.statusText}`);
      // Consider throwing a more specific error or returning an empty array/null
      return [];
    }

    const data = await response.json();

    // Check if results exist and return them, otherwise return empty array
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.results)) {
      return data.results;
    } else {
      console.warn("Received unexpected format for news articles:", data);
      return []; // Return empty array if results are missing or not an array
    }

  } catch (error) {
    console.error('An unexpected error occurred while fetching news articles:', error);
    // Depending on requirements, re-throw the error or return a default value
    // For now, let's return an empty array to prevent breaking the page
    return [];
  }
}

/**
 * Загружает одну новостную статью по её ID из API.
 * @param {number | string} id - ID статьи.
 * @returns {Promise<NewsArticle | null>} Объект статьи или null, если статья не найдена или произошла ошибка.
 */
export async function fetchNewsArticleById(id: number | string): Promise<NewsArticle | null> {
  const baseUrl = getApiBaseUrl(); // Get base URL dynamically
  // Construct the full URL. Assuming endpoint starts with /v1/...
  const endpoint = `/v1/news/articles/${id}/`;
  const url = `${baseUrl}${endpoint}`;
  const env = typeof window === 'undefined' ? 'SERVER' : 'CLIENT';
  console.log(`Fetching news article by ID from [${env}]: ${url}`);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) {
        // Статья не найдена - это не ошибка сервера, просто нет данных
        console.log(`News article with ID ${id} not found.`);
        return null;
      }
      // Другие ошибки сервера
      console.error(`Failed to fetch news article ${id}: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch news article with ID ${id}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`An unexpected error occurred while fetching news article ${id}:`, error);
    return null;
  }
} 