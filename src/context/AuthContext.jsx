import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data on mount and verify authentication
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
        
        // Verify with backend that session is still valid
        try {
          const { data } = await authAPI.getProfile();
          // Update user data with fresh data from backend
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
        } catch (err) {
          // Invalid session - remove from localStorage
          console.warn('Session expired or invalid');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No stored user, check if there's a valid session cookie
        try {
          const { data } = await authAPI.getProfile();
          setUser(data);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(data));
        } catch (err) {
          // No valid session
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (err) {
      console.error('Error loading user:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.register(userData);
      
      // Store user data and update state
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setIsAuthenticated(true);
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.login(credentials);
      
      // Store user data and update state
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      setIsAuthenticated(true);
      
      return data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint to clear cookies
      await authAPI.logout();
    } catch (err) {
      console.error('Error during logout:', err);
      // Continue with local logout even if backend call fails
    } finally {
      // Clear local storage and state
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  };

  // Update user data (e.g., after profile update)
  const updateUser = (newUserData) => {
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole('admin');
  };

  // Refresh user data from backend
  const refreshUser = async () => {
    if (!isAuthenticated) return null;
    
    try {
      const { data } = await authAPI.getProfile();
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return data;
    } catch (err) {
      console.error('Error refreshing user data:', err);
      // If refresh fails, might mean session expired
      if (err.response?.status === 401) {
        await logout();
      }
      return null;
    }
  };

  const value = {
    user,
    setUser: updateUser, // Provide setUser for backward compatibility
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    hasRole,
    isAdmin,
    refreshUser,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};