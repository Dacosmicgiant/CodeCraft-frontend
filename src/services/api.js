import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
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

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and not already retrying
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Logout for now, would implement refresh token logic here
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } catch (err) {
        console.error('Authentication error:', err);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.get('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
};

// Tutorials API calls
export const tutorialsAPI = {
  getAll: (params) => api.get('/tutorials', { params }),
  getById: (id) => api.get(`/tutorials/${id}`),
  create: (data) => api.post('/tutorials', data),
  update: (id, data) => api.put(`/tutorials/${id}`, data),
  delete: (id) => api.delete(`/tutorials/${id}`),
};

// Exercises API calls
export const exercisesAPI = {
  getAll: (params) => api.get('/exercises', { params }),
  getById: (id) => api.get(`/exercises/${id}`),
  submit: (id, solution) => api.post(`/exercises/${id}/submit`, { solution }),
};

// User API calls
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
  getProgress: () => api.get('/users/progress'),
  getBookmarks: () => api.get('/users/bookmarks'),
  addBookmark: (tutorialId) => api.post(`/users/bookmarks/${tutorialId}`),
  removeBookmark: (tutorialId) => api.delete(`/users/bookmarks/${tutorialId}`),
};

export default api;