import { Contact } from '@/types/site';
// import { PaginatedResponse } from '@/types/catalog'; // Не используется здесь
// import { ContactRequestPayload, ContactResponse } from '@/types/contacts'; // Убрал, т.к. вызывают ошибки и submitContactForm не было в оригинале

// Function to get the correct API base URL based on environment
function getApiBaseUrl(): string {
  // Check if the code is running on the server side
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // On the server, use the internal URL pointing to the Nginx service
    if (!process.env.INTERNAL_API_URL) {
      console.warn("INTERNAL_API_URL is not defined! Falling back to default.");
      return 'http://nginx/api'; // Default internal URL
    }
    return process.env.INTERNAL_API_URL.replace(/\/$/, ''); // Remove trailing slash if exists
  } else {
    // On the client, use the public URL accessible by the browser
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.warn("NEXT_PUBLIC_API_URL is not defined! Falling back to relative path.");
      return '/api'; // Fallback to relative path for client-side
    }
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, ''); // Remove trailing slash if exists
  }
}

/**
 * Fetches the primary contact information from the backend.
 * Assumes the backend returns a list (possibly paginated) and we take the first one, or null if empty/error.
 */
export async function fetchPrimaryContact(): Promise<Contact | null> {
  const baseUrl = getApiBaseUrl();
  // Construct the full URL carefully to avoid double slashes or missing /api
  // Assuming the base URLs (INTERNAL/NEXT_PUBLIC) already include /api
  const endpoint = '/v1/contacts/contacts/';
  const apiUrl = `${baseUrl}${endpoint}`;

  try {
    console.log(`Fetching primary contact from [${typeof window === 'undefined' ? 'SERVER' : 'CLIENT'}]:`, apiUrl);
    const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Добавьте другие заголовки, если необходимо (например, авторизация)
        },
        // Настройки кэширования Next.js (опционально)
        // next: { revalidate: 3600 } // Перепроверять раз в час
    });

    if (!response.ok) {
      // Log a more specific error if the response status indicates failure
      console.error(`Error fetching primary contact: ${response.status} ${response.statusText}`);
      // Попытка прочитать тело ошибки, если оно есть
      try {
        const errorBody = await response.text();
        console.error("Error body:", errorBody);
      } catch (e) {
        // Ignore if reading body fails
      }
      return null; // Возвращаем null при ошибке ответа сервера
    }

    // Ожидаем объект с пагинацией или просто массив
    const data: any = await response.json(); // Читаем как any для гибкости

    let contactList: Contact[] = [];

    // Проверяем, есть ли поле results (стандартный ответ DRF)
    if (data && Array.isArray(data.results)) {
        contactList = data.results;
    }
    // Проверяем, не является ли сам ответ массивом (на всякий случай)
    else if (Array.isArray(data)) {
        contactList = data;
    } else {
        console.warn("Unexpected API response format for contacts:", data);
        return null; // Неожиданный формат
    }

    // Возвращаем первый контакт из найденного списка или null
    return contactList.length > 0 ? contactList[0] : null;

  } catch (error) {
    // Log any other errors (network issues, JSON parsing errors)
    console.error('Error fetching or parsing primary contact data:', error);
    return null; // Возвращаем null при любой ошибке
  }
}

// Если вам нужна функция submitContactForm, ее нужно добавить отдельно
// убедившись, что типы ContactRequestPayload и ContactResponse существуют
/*
export async function submitContactForm(data: ContactRequestPayload): Promise<ContactResponse> {
    const submitApiUrl = `${API_BASE_URL}${API_VERSION_PREFIX}/contacts/submit/`; // Пример URL
    try {
        console.log("Submitting to:", submitApiUrl);
        const response = await fetch(submitApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        // ... остальная логика обработки ответа и ошибок ...
    } catch (error) {
        console.error('Failed to submit contact form:', error);
        throw error;
    }
}
*/ 