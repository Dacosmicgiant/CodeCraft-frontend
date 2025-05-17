// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      try {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
          
          // Verify with backend that token is still valid
          try {
            const { data } = await authAPI.getProfile();
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
          } catch (err) {
            // Invalid token - remove from localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Error loading user:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.register(userData);
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
      await authAPI.logout();
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // Added this to allow updating user data
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};