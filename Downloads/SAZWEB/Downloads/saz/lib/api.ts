// API client for frontend requests
// Handles all communication with backend API endpoints

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  // Check if response is OK
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText || 'Unknown error'}`);
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  // Get response text first to check if it's empty
  const text = await response.text();
  
  if (!text) {
    throw new Error('Empty response from server');
  }

  // Parse JSON safely
  try {
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    throw new Error(`Failed to parse JSON response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `/api${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const apiResponse = await handleResponse<ApiResponse<T>>(response);
    
    if (!apiResponse.success) {
      throw new Error(apiResponse.error || 'API request failed');
    }

    return apiResponse.data as T;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

// Documents API
export const documents = {
  async list(userId?: string): Promise<any[]> {
    const url = userId ? `/documents?userId=${userId}` : '/documents';
    return fetchAPI(url, { method: 'GET' });
  },

  async create(data: any): Promise<any> {
    return fetchAPI('/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: any): Promise<any> {
    return fetchAPI('/documents', {
      method: 'PATCH',
      body: JSON.stringify({ id, ...data }),
    });
  },

  async get(id: string): Promise<any> {
    return fetchAPI(`/documents?id=${id}`, { method: 'GET' });
  },

  async delete(id: string): Promise<void> {
    return fetchAPI(`/documents?id=${id}`, { method: 'DELETE' });
  },
};

// Residents API
export const residents = {
  async list(filters?: Record<string, string>): Promise<any[]> {
    const searchParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
    }
    const queryString = searchParams.toString();
    const url = queryString ? `/residents?${queryString}` : '/residents';
    return fetchAPI(url, { method: 'GET' });
  },

  async create(data: any): Promise<any> {
    return fetchAPI('/residents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: any): Promise<any> {
    return fetchAPI('/residents', {
      method: 'PATCH',
      body: JSON.stringify({ id, ...data }),
    });
  },

  async get(id: string): Promise<any> {
    return fetchAPI(`/residents?id=${id}`, { method: 'GET' });
  },

  async delete(id: string): Promise<void> {
    return fetchAPI(`/residents?id=${id}`, { method: 'DELETE' });
  },
};

// Announcements API
export const announcements = {
  async list(): Promise<any[]> {
    return fetchAPI('/announcements', { method: 'GET' });
  },

  async create(data: any): Promise<any> {
    return fetchAPI('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: any): Promise<any> {
    return fetchAPI('/announcements', {
      method: 'PATCH',
      body: JSON.stringify({ id, ...data }),
    });
  },

  async get(id: string): Promise<any> {
    return fetchAPI(`/announcements?id=${id}`, { method: 'GET' });
  },

  async delete(id: string): Promise<void> {
    return fetchAPI(`/announcements?id=${id}`, { method: 'DELETE' });
  },
};

// Export api object
export const api = {
  documents,
  residents,
  announcements,
};

export default api;
