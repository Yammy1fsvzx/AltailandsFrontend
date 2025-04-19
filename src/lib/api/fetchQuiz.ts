import { Quiz } from '@/types/quiz';
import { getApiBaseUrl } from './utils'; // Import the utility function

// Remove top-level constants for API URL
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// const API_VERSION_PREFIX = '/api/v1';

/**
 * Загружает активный квиз из API.
 * @returns {Promise<Quiz | null>} Объект активного квиза или null, если активный квиз не найден или произошла ошибка.
 */
export async function fetchActiveQuiz(): Promise<Quiz | null> {
  const baseUrl = getApiBaseUrl(); // Get base URL dynamically
  // Construct the full URL. Assuming endpoint starts with /v1/...
  const endpoint = '/v1/quizzes/?is_active=true';
  const apiUrl = `${baseUrl}${endpoint}`;
  const env = typeof window === 'undefined' ? 'SERVER' : 'CLIENT';
  console.log(`Fetching active quiz from [${env}]: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        // Кэширование, если нужно
        // next: { revalidate: 600 }
    });

    if (!response.ok) {
      console.error(`Error fetching active quiz: ${response.status} ${response.statusText}`);
      try {
        const errorBody = await response.text();
        console.error("Error body:", errorBody);
      } catch (e) {}
      return null;
    }

    const quizzes: Quiz[] | { results: Quiz[] } = await response.json();

    let activeQuiz: Quiz | null = null;
    if (Array.isArray(quizzes)) {
        activeQuiz = quizzes.length > 0 ? quizzes[0] : null;
    } else if (quizzes && Array.isArray(quizzes.results)) {
        activeQuiz = quizzes.results.length > 0 ? quizzes.results[0] : null;
    }

    return activeQuiz;

  } catch (error) {
    console.error('Error fetching or parsing active quiz data:', error);
    return null;
  }
} 