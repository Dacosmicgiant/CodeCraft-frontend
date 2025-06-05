// src/services/api/lesson.api.js
import api from './index';

export const lessonAPI = {
  // Create a new lesson for a specific tutorial
  create: async (tutorialId, lessonData) => {
    try {
      const response = await api.post(`/tutorials/${tutorialId}/lessons`, lessonData);
      return response.data;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  },

  // Get all lessons (with optional filters)
  getAll: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/lessons${queryString ? `?${queryString}` : ''}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons:', error);
      throw error;
    }
  },

  // Get lessons by tutorial ID
  getByTutorial: async (tutorialId) => {
    try {
      const response = await api.get(`/tutorials/${tutorialId}/lessons`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lessons by tutorial:', error);
      throw error;
    }
  },

  // Get lesson by ID or slug
  getById: async (id) => {
    try {
      const response = await api.get(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      throw error;
    }
  },

  // Update lesson
  update: async (id, lessonData) => {
    try {
      const response = await api.put(`/lessons/${id}`, lessonData);
      return response.data;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  },

  // Update lesson content only
  updateContent: async (id, content) => {
    try {
      const response = await api.put(`/lessons/${id}/content`, { content });
      return response.data;
    } catch (error) {
      console.error('Error updating lesson content:', error);
      throw error;
    }
  },

  // Delete lesson
  delete: async (id) => {
    try {
      const response = await api.delete(`/lessons/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  },

  // Duplicate lesson
  duplicate: async (id) => {
    try {
      const response = await api.post(`/lessons/${id}/duplicate`);
      return response.data;
    } catch (error) {
      console.error('Error duplicating lesson:', error);
      throw error;
    }
  },

  // Reorder lessons within a tutorial
  reorder: async (tutorialId, lessonOrders) => {
    try {
      const response = await api.put(`/tutorials/${tutorialId}/lessons/reorder`, {
        lessonOrders
      });
      return response.data;
    } catch (error) {
      console.error('Error reordering lessons:', error);
      throw error;
    }
  },

  // Export lesson in different formats
  export: async (id, format = 'json') => {
    try {
      // This would need to be implemented in the backend
      const response = await api.get(`/lessons/${id}/export?format=${format}`);
      return response.data;
    } catch (error) {
      console.error('Error exporting lesson:', error);
      throw error;
    }
  },

  // Publish/unpublish lesson
  togglePublish: async (id, isPublished) => {
    try {
      const response = await api.patch(`/lessons/${id}/publish`, { isPublished });
      return response.data;
    } catch (error) {
      console.error('Error toggling lesson publish status:', error);
      throw error;
    }
  },

  // Get lesson statistics
  getStats: async (id) => {
    try {
      const response = await api.get(`/lessons/${id}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching lesson stats:', error);
      throw error;
    }
  }
};

export default lessonAPI;