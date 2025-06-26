interface ApiConfig {
  token: string | null;
}

let config: ApiConfig = {
  token: null,
};

export const setApiConfig = (newConfig: Partial<ApiConfig>) => {
  config = { ...config, ...newConfig };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const api = {
  getPost: async (id: string) => {
    const response = await fetch(`/api/posts/${id}`);
    return handleResponse(response);
  },

  createPost: async (postData: { id: string; title: string; date: string; content: string }) => {
    const response = await fetch(`/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.token || ''}`,
      },
      body: JSON.stringify(postData),
    });
    return handleResponse(response);
  },

  updatePost: async (id: string, postData: { title: string; date: string; content: string }) => {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.token || ''}`,
      },
      body: JSON.stringify(postData),
    });
    return handleResponse(response);
  },
};