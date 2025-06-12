// src/services/api.js
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
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    console.log('📤 Request data:', config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
    console.error('❌ API Error:', error);
    
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Clear auth data and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } catch (err) {
        console.error('Authentication error:', err);
      }
    }
    
    // Better error logging
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
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

// User API calls - matches your backend - KEEPING INTACT
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  getProfile: () => api.get('/users/profile'),
  getProgress: () => api.get('/users/progress'),
  getBookmarks: () => api.get('/users/bookmarks'),
  addBookmark: (tutorialId) => api.post(`/users/bookmarks/${tutorialId}`),
  removeBookmark: (tutorialId) => api.delete(`/users/bookmarks/${tutorialId}`),
};

// Lesson API - Updated to use axios instead of fetch for consistency
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
      const response = await api.put(`/lessons/${lessonId}`, { isPublished });
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

  // Export lesson content - simplified to use your existing backend structure
  export: async (lessonId, format = 'json') => {
    try {
      // Get the lesson first
      const lesson = await lessonAPI.getById(lessonId);
      
      if (!lesson.success) {
        throw new Error(lesson.message || 'Failed to fetch lesson');
      }
      
      const lessonData = lesson.data;
      let exportData;
      
      switch (format) {
        case 'json':
          exportData = JSON.stringify(lessonData, null, 2);
          break;
          
        case 'html':
          exportData = convertToHTML(lessonData);
          break;
          
        case 'text':
          exportData = convertToText(lessonData);
          break;
          
        default:
          throw new Error('Unsupported export format');
      }
      
      return {
        success: true,
        data: exportData,
        filename: `${lessonData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${format}`
      };
    } catch (error) {
      console.error('❌ Export lesson error:', error);
      return {
        success: false,
        message: error.message || 'Export failed'
      };
    }
  }
};

// Helper functions for lesson export
const convertToHTML = (lessonData) => {
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${lessonData.title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1, h2, h3, h4, h5, h6 { color: #333; }
        code { background: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
        blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 20px; font-style: italic; }
        img { max-width: 100%; height: auto; }
    </style>
</head>
<body>
    <h1>${lessonData.title}</h1>
    <div class="meta">
        <p><strong>Duration:</strong> ${lessonData.duration} minutes</p>
        <p><strong>Order:</strong> #${lessonData.order}</p>
        <p><strong>Status:</strong> ${lessonData.isPublished ? 'Published' : 'Draft'}</p>
    </div>
    <hr>
`;

  if (lessonData.content && lessonData.content.blocks) {
    lessonData.content.blocks.forEach(block => {
      html += convertBlockToHTML(block);
    });
  }

  html += `
</body>
</html>`;

  return html;
};

const convertBlockToHTML = (block) => {
  switch (block.type) {
    case 'paragraph':
      return `<p>${block.data.text || ''}</p>\n`;
    case 'header':
      const level = block.data.level || 1;
      return `<h${level}>${block.data.text || ''}</h${level}>\n`;
    case 'list':
      const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
      const items = (block.data.items || []).map(item => `<li>${item}</li>`).join('\n');
      return `<${tag}>\n${items}\n</${tag}>\n`;
    case 'code':
      return `<pre><code>${block.data.code || ''}</code></pre>\n`;
    case 'quote':
      const text = block.data.text || '';
      const caption = block.data.caption ? `<cite>${block.data.caption}</cite>` : '';
      return `<blockquote>${text}${caption}</blockquote>\n`;
    case 'image':
      const url = block.data.file?.url || block.data.url || '';
      const alt = block.data.caption || block.data.alt || '';
      return `<img src="${url}" alt="${alt}" />\n`;
    default:
      return `<!-- Unknown block type: ${block.type} -->\n`;
  }
};

const convertToText = (lessonData) => {
  let text = `${lessonData.title}\n${'='.repeat(lessonData.title.length)}\n\n`;
  text += `Duration: ${lessonData.duration} minutes\n`;
  text += `Order: #${lessonData.order}\n`;
  text += `Status: ${lessonData.isPublished ? 'Published' : 'Draft'}\n\n`;
  text += `${'-'.repeat(50)}\n\n`;

  if (lessonData.content && lessonData.content.blocks) {
    lessonData.content.blocks.forEach(block => {
      text += convertBlockToText(block);
    });
  }

  return text;
};

const convertBlockToText = (block) => {
  switch (block.type) {
    case 'paragraph':
      return `${block.data.text?.replace(/<[^>]*>/g, '') || ''}\n\n`;
    case 'header':
      const text = block.data.text?.replace(/<[^>]*>/g, '') || '';
      return `${text}\n${'-'.repeat(text.length)}\n\n`;
    case 'list':
      const items = (block.data.items || []).map((item, index) => {
        const cleanItem = item.replace(/<[^>]*>/g, '');
        return block.data.style === 'ordered' 
          ? `${index + 1}. ${cleanItem}` 
          : `• ${cleanItem}`;
      }).join('\n');
      return `${items}\n\n`;
    case 'code':
      return `\`\`\`\n${block.data.code || ''}\n\`\`\`\n\n`;
    case 'quote':
      const quoteText = block.data.text?.replace(/<[^>]*>/g, '') || '';
      const caption = block.data.caption ? `\n— ${block.data.caption}` : '';
      return `> ${quoteText}${caption}\n\n`;
    default:
      return '';
  }
};

// Legacy API calls for backward compatibility
export const tutorialsAPI = tutorialAPI;
export const exercisesAPI = {
  getAll: (params) => api.get('/exercises', { params }),
  getById: (id) => api.get(`/exercises/${id}`),
  submit: (id, solution) => api.post(`/exercises/${id}/submit`, { solution }),
};

// Helper function to validate image URLs (keeping your existing function)
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