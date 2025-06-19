// src/services/api.js
import axios from 'axios';

// Update this to point to your backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://codecraft-backend-8fme.onrender.com/api/v1'
    : 'http://localhost:5001/api/v1'
  );

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies to work
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor - REMOVED localStorage token logic since we use cookies
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('📤 Request data:', config.data);
    
    // NO localStorage token logic - cookies are sent automatically
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    console.log('📥 Response data:', response.data);
    return response;
  },
  async (error) => {
    console.error('❌ API Error:', error.message);
    
    // Better error logging
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      
      // Don't automatically redirect on 401 - let AuthContext handle it
      if (error.response.status === 401) {
        console.log('🔐 Authentication error - token may be expired');
        // Let the calling component/context handle the 401 error
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
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

// Enhanced Media Validation API
export const mediaAPI = {
  // Validate image URL
  validateImage: async (url) => {
    try {
      const response = await api.post('/lessons/validate-media', {
        url,
        type: 'image'
      });
      return response.data;
    } catch (error) {
      console.error('❌ Image validation error:', error);
      throw new Error(error.response?.data?.message || 'Failed to validate image URL');
    }
  },

  // Validate video/embed URL
  validateEmbed: async (url) => {
    try {
      const response = await api.post('/lessons/validate-media', {
        url,
        type: 'embed'
      });
      return response.data;
    } catch (error) {
      console.error('❌ Embed validation error:', error);
      throw new Error(error.response?.data?.message || 'Failed to validate embed URL');
    }
  },

  // Extract YouTube video info
  extractYouTubeInfo: (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return {
          videoId: match[1],
          embedUrl: `https://www.youtube.com/embed/${match[1]}`,
          thumbnailUrl: `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`,
          originalUrl: url,
          isValid: true
        };
      }
    }
    
    return { isValid: false };
  },

  // Check if URL is a valid image
  isValidImageUrl: (url) => {
    if (!url || typeof url !== 'string') return false;
    
    try {
      new URL(url);
      
      // Check for image file extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
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
        'googleusercontent.com'
      ];
      
      const isFromImageDomain = imageDomains.some(domain => 
        url.includes(domain)
      );
      
      const isDataUrl = url.startsWith('data:image/');
      
      return hasImageExtension || isFromImageDomain || isDataUrl;
    } catch {
      return false;
    }
  }
};

// Enhanced Lesson API - Updated to use axios instead of fetch for consistency
export const lessonAPI = {
  // Create lesson with EditorJS content
  create: async (tutorialId, lessonData) => {
    try {
      console.log(`🎯 Creating lesson for tutorial: ${tutorialId}`);
      console.log('📝 Lesson data:', JSON.stringify(lessonData, null, 2));
      
      const response = await api.post(`/tutorials/${tutorialId}/lessons`, lessonData);
      console.log('✅ Lesson created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create lesson error:', error);
      
      // Enhanced error handling
      if (error.response?.status === 404) {
        throw new Error('Tutorial not found. Please check if the tutorial exists.');
      } else if (error.response?.status === 400) {
        const errorMsg = error.response.data?.message || 'Invalid lesson data';
        throw new Error(errorMsg);
      } else if (error.response?.status === 401) {
        throw new Error('You must be logged in to create lessons.');
      } else if (error.response?.status === 403) {
        throw new Error('You do not have permission to create lessons.');
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to server. Please ensure the backend is running on port 5001.');
      } else {
        throw new Error(error.response?.data?.message || error.message || 'Failed to create lesson');
      }
    }
  },

  // Get all lessons (admin) with pagination and filters
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/lessons', { params });
      return response.data;
    } catch (error) {
      console.error('❌ Get all lessons error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch lessons');
    }
  },

  // Get lesson by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Get lesson error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch lesson');
    }
  },

  // Get lessons by tutorial
  getByTutorial: async (tutorialId) => {
    try {
      console.log(`🎯 Fetching lessons for tutorial: ${tutorialId}`);
      const response = await api.get(`/tutorials/${tutorialId}/lessons`);
      console.log('✅ Lessons fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get lessons by tutorial error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch lessons for tutorial');
    }
  },

  // Update lesson
  update: async (id, lessonData) => {
    try {
      console.log(`🎯 Updating lesson: ${id}`);
      console.log('📝 Update data:', JSON.stringify(lessonData, null, 2));
      
      const response = await api.put(`/lessons/${id}`, lessonData);
      console.log('✅ Lesson updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update lesson error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update lesson');
    }
  },

  // Update lesson content only
  updateContent: async (id, content) => {
    try {
      const response = await api.put(`/lessons/${id}/content`, { content });
      return response.data;
    } catch (error) {
      console.error('❌ Update lesson content error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update lesson content');
    }
  },

  // Delete lesson
  delete: async (id) => {
    try {
      const response = await api.delete(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error('❌ Delete lesson error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete lesson');
    }
  },

  // Reorder lessons within a tutorial
  reorder: async (tutorialId, lessonOrders) => {
    try {
      const response = await api.put(`/tutorials/${tutorialId}/lessons/reorder`, { lessonOrders });
      return response.data;
    } catch (error) {
      console.error('❌ Reorder lessons error:', error);
      throw new Error(error.response?.data?.message || 'Failed to reorder lessons');
    }
  },

  // Duplicate lesson
  duplicate: async (id) => {
    try {
      const response = await api.post(`/lessons/${id}/duplicate`);
      return response.data;
    } catch (error) {
      console.error('❌ Duplicate lesson error:', error);
      throw new Error(error.response?.data?.message || 'Failed to duplicate lesson');
    }
  },

  // Toggle publish status
  togglePublish: async (lessonId, isPublished) => {
    try {
      const response = await api.put(`/lessons/${lessonId}/toggle-publish`, { isPublished });
      return response.data;
    } catch (error) {
      console.error('❌ Toggle publish error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update lesson status');
    }
  },

  // Bulk update lessons
  bulkUpdate: async (lessonIds, update) => {
    try {
      const response = await api.put('/lessons/bulk', { lessonIds, update });
      return response.data;
    } catch (error) {
      console.error('❌ Bulk update lessons error:', error);
      throw new Error(error.response?.data?.message || 'Failed to bulk update lessons');
    }
  },

  // Export lesson content
  export: async (lessonId, format = 'json') => {
    try {
      const response = await api.get(`/lessons/${lessonId}/export`, {
        params: { format }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Export lesson error:', error);
      throw new Error(error.response?.data?.message || 'Failed to export lesson');
    }
  },

  // Validate media URL
  validateMedia: async (url, type) => {
    try {
      console.log(`🔍 Validating ${type} URL:`, url);
      const response = await api.post('/lessons/validate-media', { url, type });
      console.log('✅ Media validation result:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Media validation error:', error);
      throw new Error(error.response?.data?.message || 'Failed to validate media URL');
    }
  }
};

// Helper functions for media handling
export const mediaHelpers = {
  // Process YouTube URL for embedding
  processYouTubeUrl: (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return {
          isValid: true,
          videoId: match[1],
          embedUrl: `https://www.youtube.com/embed/${match[1]}`,
          thumbnailUrl: `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`,
          originalUrl: url,
          service: 'youtube'
        };
      }
    }
    
    return { isValid: false, message: 'Invalid YouTube URL' };
  },

  // Process Vimeo URL for embedding
  processVimeoUrl: (url) => {
    const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (match) {
      return {
        isValid: true,
        videoId: match[1],
        embedUrl: `https://player.vimeo.com/video/${match[1]}`,
        originalUrl: url,
        service: 'vimeo'
      };
    }
    
    return { isValid: false, message: 'Invalid Vimeo URL' };
  },

  // Validate image URL
  validateImageUrl: (url) => {
    if (!url || typeof url !== 'string') {
      return { isValid: false, message: 'URL is required' };
    }
    
    try {
      new URL(url);
      
      // Check for image file extensions
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
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
        'cdnjs.cloudflare.com',
        'wikimedia.org'
      ];
      
      const isFromImageDomain = imageDomains.some(domain => 
        url.includes(domain)
      );
      
      const isDataUrl = url.startsWith('data:image/');
      
      return {
        isValid: hasImageExtension || isFromImageDomain || isDataUrl,
        hasExtension: hasImageExtension,
        isFromTrustedDomain: isFromImageDomain,
        isDataUrl: isDataUrl,
        message: hasImageExtension || isFromImageDomain || isDataUrl
          ? 'Valid image URL' 
          : 'URL should point to an image file or be from a trusted image hosting service'
      };
    } catch (error) {
      return {
        isValid: false,
        hasExtension: false,
        isFromTrustedDomain: false,
        isDataUrl: false,
        message: 'Invalid URL format'
      };
    }
  },

  // Generate EditorJS image block
  createImageBlock: (url, caption = '', alt = '') => {
    return {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'image',
      data: {
        url: url,
        caption: caption,
        alt: alt || caption,
        stretched: false,
        withBorder: false,
        withBackground: false
      }
    };
  },

  // Generate EditorJS embed block
  createEmbedBlock: (url, service = 'youtube', caption = '') => {
    let embedData = {};
    
    if (service === 'youtube') {
      const ytData = mediaHelpers.processYouTubeUrl(url);
      if (ytData.isValid) {
        embedData = {
          service: 'youtube',
          url: ytData.originalUrl,
          embed: ytData.embedUrl,
          width: 560,
          height: 315,
          caption: caption,
          videoId: ytData.videoId,
          thumbnail: ytData.thumbnailUrl
        };
      }
    } else if (service === 'vimeo') {
      const vimeoData = mediaHelpers.processVimeoUrl(url);
      if (vimeoData.isValid) {
        embedData = {
          service: 'vimeo',
          url: vimeoData.originalUrl,
          embed: vimeoData.embedUrl,
          width: 640,
          height: 360,
          caption: caption,
          videoId: vimeoData.videoId
        };
      }
    } else {
      // Generic embed
      embedData = {
        service: 'iframe',
        url: url,
        embed: url,
        width: 800,
        height: 600,
        caption: caption
      };
    }
    
    return {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'embed',
      data: embedData
    };
  }
};

// Legacy API calls for backward compatibility
export const tutorialsAPI = tutorialAPI;
export const exercisesAPI = {
  getAll: (params) => api.get('/exercises', { params }),
  getById: (id) => api.get(`/exercises/${id}`),
  submit: (id, solution) => api.post(`/exercises/${id}/submit`, { solution }),
};

// Re-export the media validation function for backward compatibility
export const validateImageUrl = mediaHelpers.validateImageUrl;

export default api;