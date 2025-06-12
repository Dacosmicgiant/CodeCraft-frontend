// src/services/api/lessonAPI.js
import apiClient from './apiClient'; // Assume you have this axios instance configured

/**
 * Lesson API Service
 * Handles all lesson-related API calls
 */
export const lessonAPI = {
  /**
   * Get all lessons with pagination and search
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search query
   * @param {string} params.tutorial - Tutorial ID filter
   * @param {boolean} params.published - Published filter
   * @returns {Promise} API response
   */
  getAll: async (params = {}) => {
    console.log('🔍 Getting all lessons with params:', params);
    try {
      const queryParams = new URLSearchParams();
      
      // Add params to query string
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const queryString = queryParams.toString();
      const url = queryString ? `/lessons/all?${queryString}` : '/lessons/all';
      
      const response = await apiClient.get(url);
      console.log('✅ Got all lessons:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get all lessons error:', error);
      throw error;
    }
  },

  /**
   * Get lessons by tutorial ID
   * @param {string} tutorialId - Tutorial ID
   * @returns {Promise} API response
   */
  getByTutorial: async (tutorialId) => {
    console.log('🔍 Getting lessons for tutorial:', tutorialId);
    try {
      if (!tutorialId) {
        throw new Error('Tutorial ID is required');
      }
      
      const response = await apiClient.get(`/tutorials/${tutorialId}/lessons`);
      console.log('✅ Got tutorial lessons:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get tutorial lessons error:', error);
      throw error;
    }
  },

  /**
   * Get lesson by ID
   * @param {string} lessonId - Lesson ID
   * @returns {Promise} API response
   */
  getById: async (lessonId) => {
    console.log('🔍 Getting lesson by ID:', lessonId);
    try {
      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }
      
      const response = await apiClient.get(`/lessons/${lessonId}`);
      console.log('✅ Got lesson:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Get lesson error:', error);
      throw error;
    }
  },

  /**
   * Create new lesson
   * @param {string} tutorialId - Tutorial ID
   * @param {Object} lessonData - Lesson data
   * @param {string} lessonData.title - Lesson title
   * @param {number} lessonData.order - Lesson order
   * @param {number} lessonData.duration - Duration in minutes
   * @param {Object} lessonData.content - EditorJS content
   * @param {boolean} lessonData.isPublished - Published status
   * @returns {Promise} API response
   */
  create: async (tutorialId, lessonData) => {
    console.log('📝 Creating lesson for tutorial:', tutorialId);
    console.log('📝 Lesson data:', lessonData);
    try {
      if (!tutorialId) {
        throw new Error('Tutorial ID is required');
      }
      
      if (!lessonData) {
        throw new Error('Lesson data is required');
      }

      // Validate required fields
      if (!lessonData.title || !lessonData.title.trim()) {
        throw new Error('Lesson title is required');
      }

      if (!lessonData.order || lessonData.order < 1) {
        throw new Error('Lesson order is required and must be positive');
      }

      if (!lessonData.duration || lessonData.duration < 1) {
        throw new Error('Lesson duration is required and must be positive');
      }

      // Ensure content has proper structure
      const contentData = {
        ...lessonData,
        content: lessonData.content || {
          time: Date.now(),
          blocks: [],
          version: "2.28.2"
        }
      };
      
      const response = await apiClient.post(`/tutorials/${tutorialId}/lessons`, contentData);
      console.log('✅ Created lesson:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Create lesson error:', error);
      throw error;
    }
  },

  /**
   * Update lesson
   * @param {string} lessonId - Lesson ID
   * @param {Object} lessonData - Updated lesson data
   * @returns {Promise} API response
   */
  update: async (lessonId, lessonData) => {
    console.log('📝 Updating lesson:', lessonId);
    console.log('📝 Lesson data:', lessonData);
    try {
      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }
      
      if (!lessonData) {
        throw new Error('Lesson data is required');
      }
      
      const response = await apiClient.put(`/lessons/${lessonId}`, lessonData);
      console.log('✅ Updated lesson:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update lesson error:', error);
      throw error;
    }
  },

  /**
   * Update lesson content only
   * @param {string} lessonId - Lesson ID
   * @param {Object} content - EditorJS content
   * @returns {Promise} API response
   */
  updateContent: async (lessonId, content) => {
    console.log('📝 Updating lesson content:', lessonId);
    try {
      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }
      
      if (!content) {
        throw new Error('Content is required');
      }
      
      const response = await apiClient.put(`/lessons/${lessonId}/content`, { content });
      console.log('✅ Updated lesson content:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Update lesson content error:', error);
      throw error;
    }
  },

  /**
   * Delete lesson
   * @param {string} lessonId - Lesson ID
   * @returns {Promise} API response
   */
  delete: async (lessonId) => {
    console.log('🗑️ Deleting lesson:', lessonId);
    try {
      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }
      
      const response = await apiClient.delete(`/lessons/${lessonId}`);
      console.log('✅ Deleted lesson:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Delete lesson error:', error);
      throw error;
    }
  },

  /**
   * Duplicate lesson
   * @param {string} lessonId - Lesson ID to duplicate
   * @returns {Promise} API response
   */
  duplicate: async (lessonId) => {
    console.log('📋 Duplicating lesson:', lessonId);
    try {
      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }
      
      const response = await apiClient.post(`/lessons/${lessonId}/duplicate`);
      console.log('✅ Duplicated lesson:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Duplicate lesson error:', error);
      throw error;
    }
  },

  /**
   * Toggle lesson publish status
   * @param {string} lessonId - Lesson ID
   * @param {boolean} isPublished - New published status
   * @returns {Promise} API response
   */
  togglePublish: async (lessonId, isPublished) => {
    console.log('🔄 Toggling lesson publish status:', lessonId, isPublished);
    try {
      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }
      
      if (typeof isPublished !== 'boolean') {
        throw new Error('isPublished must be a boolean');
      }
      
      const response = await apiClient.put(`/lessons/${lessonId}/toggle-publish`, { 
        isPublished 
      });
      console.log('✅ Toggled lesson status:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Toggle lesson status error:', error);
      throw error;
    }
  },

  /**
   * Export lesson in different formats
   * @param {string} lessonId - Lesson ID
   * @param {string} format - Export format (json, html, text)
   * @returns {Promise} API response
   */
  export: async (lessonId, format = 'json') => {
    console.log('📤 Exporting lesson:', lessonId, 'as', format);
    try {
      if (!lessonId) {
        throw new Error('Lesson ID is required');
      }
      
      const validFormats = ['json', 'html', 'text'];
      if (!validFormats.includes(format)) {
        throw new Error(`Invalid format. Must be one of: ${validFormats.join(', ')}`);
      }
      
      const response = await apiClient.get(`/lessons/${lessonId}/export?format=${format}`);
      console.log('✅ Exported lesson:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Export lesson error:', error);
      throw error;
    }
  },

  /**
   * Reorder lessons within a tutorial
   * @param {string} tutorialId - Tutorial ID
   * @param {Array} lessonOrders - Array of {lessonId, order} objects
   * @returns {Promise} API response
   */
  reorder: async (tutorialId, lessonOrders) => {
    console.log('🔄 Reordering lessons in tutorial:', tutorialId);
    console.log('📝 New order:', lessonOrders);
    try {
      if (!tutorialId) {
        throw new Error('Tutorial ID is required');
      }
      
      if (!Array.isArray(lessonOrders)) {
        throw new Error('lessonOrders must be an array');
      }
      
      if (lessonOrders.length === 0) {
        throw new Error('lessonOrders array cannot be empty');
      }
      
      // Validate lessonOrders structure
      lessonOrders.forEach((item, index) => {
        if (!item.lessonId || !item.order) {
          throw new Error(`Invalid lessonOrders item at index ${index}. Must have lessonId and order properties.`);
        }
        if (typeof item.order !== 'number' || item.order < 1) {
          throw new Error(`Invalid order at index ${index}. Order must be a positive number.`);
        }
      });
      
      const response = await apiClient.put(`/tutorials/${tutorialId}/lessons/reorder`, {
        lessonOrders
      });
      console.log('✅ Reordered lessons:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Reorder lessons error:', error);
      throw error;
    }
  },

  /**
   * Get next available order number for a tutorial
   * @param {string} tutorialId - Tutorial ID
   * @returns {Promise<number>} Next order number
   */
  getNextOrder: async (tutorialId) => {
    console.log('🔢 Getting next order for tutorial:', tutorialId);
    try {
      if (!tutorialId) {
        throw new Error('Tutorial ID is required');
      }
      
      const response = await lessonAPI.getByTutorial(tutorialId);
      
      if (response.success && response.data.length > 0) {
        const maxOrder = Math.max(...response.data.map(lesson => lesson.order || 0));
        return maxOrder + 1;
      }
      
      return 1; // First lesson
    } catch (error) {
      console.error('❌ Get next order error:', error);
      // Return 1 as fallback
      return 1;
    }
  },

  /**
   * Bulk update lessons
   * @param {Array} updates - Array of {lessonId, updates} objects
   * @returns {Promise} Array of API responses
   */
  bulkUpdate: async (updates) => {
    console.log('📝 Bulk updating lessons:', updates);
    try {
      if (!Array.isArray(updates)) {
        throw new Error('Updates must be an array');
      }
      
      const promises = updates.map(({ lessonId, updates: lessonUpdates }) => 
        lessonAPI.update(lessonId, lessonUpdates)
      );
      
      const results = await Promise.allSettled(promises);
      console.log('✅ Bulk update results:', results);
      return results;
    } catch (error) {
      console.error('❌ Bulk update error:', error);
      throw error;
    }
  },

  /**
   * Search lessons across all tutorials
   * @param {string} query - Search query
   * @param {Object} filters - Additional filters
   * @returns {Promise} API response
   */
  search: async (query, filters = {}) => {
    console.log('🔍 Searching lessons:', query, filters);
    try {
      const params = {
        search: query,
        ...filters
      };
      
      return await lessonAPI.getAll(params);
    } catch (error) {
      console.error('❌ Search lessons error:', error);
      throw error;
    }
  }
};

export default lessonAPI;