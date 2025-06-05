import axios from 'axios';

// Update this to point to your backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for cookies to work
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor - FIXED VERSION
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't automatically redirect on 401 errors
    // Let the calling component handle authentication errors appropriately
    if (error.response?.status === 401) {
      // Only clear stored data, don't redirect automatically
      // The AuthContext will handle the authentication flow
      console.log('401 Unauthorized - clearing stored auth data');
      
      // Only clear if this wasn't an auth check request
      // This prevents clearing data when just checking authentication status
      if (!originalRequest.url.includes('/auth/me')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls - matches your backend exactly
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.get('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
};

// Domain API calls
export const domainAPI = {
  getAll: () => api.get('/domains'),
  getById: (id) => api.get(`/domains/${id}`),
  create: (data) => api.post('/domains', data),
  update: (id, data) => api.put(`/domains/${id}`, data),
  delete: (id) => api.delete(`/domains/${id}`),
};

// Technology API calls
export const technologyAPI = {
  getAll: (params) => api.get('/technologies', { params }),
  getById: (id) => api.get(`/technologies/${id}`),
  create: (data) => api.post('/technologies', data),
  update: (id, data) => api.put(`/technologies/${id}`, data),
  delete: (id) => api.delete(`/technologies/${id}`),
};

// Tutorial API calls - matches your backend structure
export const tutorialAPI = {
  getAll: (params) => api.get('/tutorials', { params }),
  getById: (id) => api.get(`/tutorials/${id}`),
  create: (data) => api.post('/tutorials', data),
  update: (id, data) => api.put(`/tutorials/${id}`, data),
  delete: (id) => api.delete(`/tutorials/${id}`),
};

// User API calls - matches your backend
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  getProfile: () => api.get('/users/profile'),
  getProgress: () => api.get('/users/progress'),
  getBookmarks: () => api.get('/users/bookmarks'),
  addBookmark: (tutorialId) => api.post(`/users/bookmarks/${tutorialId}`),
  removeBookmark: (tutorialId) => api.delete(`/users/bookmarks/${tutorialId}`),
};

// Legacy API calls for backward compatibility
export const tutorialsAPI = tutorialAPI;
export const exercisesAPI = {
  getAll: (params) => api.get('/exercises', { params }),
  getById: (id) => api.get(`/exercises/${id}`),
  submit: (id, solution) => api.post(`/exercises/${id}/submit`, { solution }),
};

export const lessonAPI = {
  // Create lesson with EditorJS content
  create: async (tutorialId, lessonData) => {
    try {
      const response = await api.post(`/tutorials/${tutorialId}/lessons`, lessonData);
      return response;
    } catch (error) {
      console.error('Create lesson error:', error);
      throw error;
    }
  },

  // Get all lessons (admin) with pagination and filters
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/lessons', { params });
      return response;
    } catch (error) {
      console.error('Get all lessons error:', error);
      throw error;
    }
  },

  // Get lesson by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/lessons/${id}`);
      return response;
    } catch (error) {
      console.error('Get lesson error:', error);
      throw error;
    }
  },

  // Get lessons by tutorial
  getByTutorial: async (tutorialId) => {
    try {
      const response = await api.get(`/tutorials/${tutorialId}/lessons`);
      return response;
    } catch (error) {
      console.error('Get lessons error:', error);
      throw error;
    }
  },

  // Update lesson
  update: async (id, lessonData) => {
    try {
      const response = await api.put(`/lessons/${id}`, lessonData);
      return response;
    } catch (error) {
      console.error('Update lesson error:', error);
      throw error;
    }
  },

  // Update lesson content only
  updateContent: async (id, content) => {
    try {
      const response = await api.put(`/lessons/${id}/content`, { content });
      return response;
    } catch (error) {
      console.error('Update lesson content error:', error);
      throw error;
    }
  },

  // Delete lesson
  delete: async (id) => {
    try {
      const response = await api.delete(`/lessons/${id}`);
      return response;
    } catch (error) {
      console.error('Delete lesson error:', error);
      throw error;
    }
  },

  // Reorder lessons
  reorder: async (lessons) => {
    try {
      const response = await api.put('/lessons/reorder', { lessons });
      return response;
    } catch (error) {
      console.error('Reorder lessons error:', error);
      throw error;
    }
  },

  // Duplicate lesson
  duplicate: async (id) => {
    try {
      const response = await api.post(`/lessons/${id}/duplicate`);
      return response;
    } catch (error) {
      console.error('Duplicate lesson error:', error);
      throw error;
    }
  },

  // Bulk update lessons
  bulkUpdate: async (lessonIds, update) => {
    try {
      const response = await api.put('/lessons/bulk', { lessonIds, update });
      return response;
    } catch (error) {
      console.error('Bulk update lessons error:', error);
      throw error;
    }
  },

  // Export lesson content
  export: async (id, format = 'json') => {
    try {
      // Use the new simplified endpoint URLs
      const endpoint = format === 'json' ? 'export-json' : 
                     format === 'html' ? 'export-html' : 'export-text';
      
      const response = await api.get(`/lessons/${id}/${endpoint}`);
      return response.data;
    } catch (error) {
      console.error('Export lesson error:', error);
      throw error;
    }
  }
};

// Helper function to validate image URLs (optional, for client-side validation)
export const validateImageUrl = (url) => {
  try {
    new URL(url);
    
    // Check for image file extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const hasImageExtension = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext)
    );
    
    // Check for known image hosting domains
    const imageDomains = [
      'imgur.com', 'i.imgur.com',
      'unsplash.com', 'images.unsplash.com',
      'pixabay.com', 'cdn.pixabay.com',
      'pexels.com', 'images.pexels.com',
      'githubusercontent.com', 'raw.githubusercontent.com',
      'cloudinary.com', 'res.cloudinary.com',
      'amazonaws.com', 's3.amazonaws.com',
      'googleusercontent.com',
      'cdn.jsdelivr.net',
      'cdnjs.cloudflare.com'
    ];
    
    const isFromImageDomain = imageDomains.some(domain => 
      url.includes(domain)
    );
    
    return {
      isValid: hasImageExtension || isFromImageDomain,
      hasExtension: hasImageExtension,
      isFromTrustedDomain: isFromImageDomain,
      message: hasImageExtension || isFromImageDomain 
        ? 'Valid image URL' 
        : 'URL should point to an image file or be from a trusted image hosting service'
    };
  } catch (error) {
    return {
      isValid: false,
      hasExtension: false,
      isFromTrustedDomain: false,
      message: 'Invalid URL format'
    };
  }
};

export default api;