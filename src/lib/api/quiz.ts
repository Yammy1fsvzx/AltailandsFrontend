import { fetchAPI } from './catalog'; // Используем fetchAPI из catalog.ts, который читает правильный URL
import { Quiz } from '@/types/quiz'; // Import the main Quiz type
import { PaginatedResponse } from '@/types/catalog'; // Import PaginatedResponse

/**
 * Fetches the first active quiz from the API.
 * @returns The active quiz object or null if not found or error.
 */
export async function getActiveQuiz(): Promise<Quiz | null> {
  try {
    // Endpoint for quizzes, filtering by is_active=true
    const params = new URLSearchParams({ is_active: 'true' });
    // Ensure the endpoint starts with /v1/
    const data = await fetchAPI<PaginatedResponse<Quiz>>('/v1/quizzes/', params);
    
    // Return the first quiz from the results, or null if none found
    if (data && data.results && data.results.length > 0) {
      console.log("Found active quiz:", data.results[0].title);
      return data.results[0];
    }
    console.warn("No active quiz found.");
    return null;

  } catch (error) {
    console.error("Failed to fetch active quiz:", error);
    return null; // Return null on error
  }
} 