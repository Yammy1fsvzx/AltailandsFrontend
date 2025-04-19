import { fetchAPI } from './catalog'; // Используем fetchAPI из catalog.ts, который читает правильный URL

// Interface for the request body data
export interface ApplicationRequestBody {
  name: string;
  phone: string;
  email?: string | null;
  user_message?: string | null;
  request_type: string; // e.g., 'catalog', 'quiz', 'contact', 'listing'
  status: string; // e.g., 'new'
  // Make related object fields optional for contact form
  related_object_content_type_app_label?: string | null; 
  related_object_model_name?: string | null; 
  related_object_id?: number | null;
  // Add field for quiz answers
  quiz_answers?: string | null; // JSON string or similar
}

/**
 * Submits the application form data to the backend.
 * @param formData The data to submit.
 * @returns The created request object or throws an error.
 */
export async function submitApplication(formData: ApplicationRequestBody): Promise<any> {
  try {
    // Ensure the endpoint starts with /v1/
    const response = await fetchAPI<any>('/v1/requests/', undefined, { // Changed endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      // Reset cache policy if needed for POST, default might be ok
      // cache: 'no-store', 
    });
    return response; // Return the created request object
  } catch (error) {
    console.error("Error submitting application:", error);
    // Re-throw the error to be caught by the form component
    throw error;
  }
} 