// src/context/AuthContext.jsx
import { createContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoize loadUser to prevent infinite re-renders
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Verify with backend that session is still valid
          try {
            const { data } = await authAPI.getProfile();
            // Update user data with fresh data from backend
            if (data) {
              setUser(data);
              localStorage.setItem('user', JSON.stringify(data));
            }
          } catch (err) {
            // 401 means session is invalid - this is expected behavior
            if (err.response?.status === 401) {
              console.log('Session expired - clearing stored data');
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              setUser(null);
              setIsAuthenticated(false);
            } else {
              console.warn('Error verifying session:', err.message);
              // Keep the stored user data for other errors (network issues, etc.)
            }
          }
        } catch (parseError) {
          console.error('Error parsing stored user data:', parseError);
          // Clear corrupted data
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No stored user, check if there's a valid session cookie
        try {
          const { data } = await authAPI.getProfile();
          if (data) {
            setUser(data);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(data));
          }
        } catch (err) {
          // 401 is expected for non-authenticated users
          if (err.response?.status === 401) {
            console.log('No valid session found - user not authenticated');
          } else {
            console.warn('Error checking authentication:', err.message);
          }
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    } catch (err) {
      console.error('Error in loadUser:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since we don't want this to change

  // Load user data on mount only
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await authAPI.register(userData);
      
      if (data) {
        // Store user data and update state
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setIsAuthenticated(true);
        return data;
      }
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
      console.log('🔐 Attempting login...');
      const { data } = await authAPI.login(credentials);
      
      if (data) {
        console.log('✅ Login successful:', data);
        // Store user data and update state
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setIsAuthenticated(true);
        return data;
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      // Don't clear localStorage here - only clear it if the user was previously logged in
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      // Call backend logout endpoint to clear cookies
      await authAPI.logout();
      console.log('✅ Backend logout successful');
    } catch (err) {
      console.error('⚠️ Error during logout API call:', err);
      // Continue with local logout even if backend call fails
    } finally {
      // Always clear local storage and state
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      console.log('✅ Local logout complete');
    }
  };

  // Update user data (e.g., after profile update)
  const updateUser = useCallback((newUserData) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user && user.role === role;
  }, [user]);

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

  // Refresh user data from backend
  const refreshUser = async () => {
    if (!isAuthenticated) return null;
    
    try {
      const { data } = await authAPI.getProfile();
      if (data) {
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
      }
    } catch (err) {
      console.error('Error refreshing user data:', err);
      // If refresh fails with 401, session expired
      if (err.response?.status === 401) {
        console.log('Session expired during refresh - logging out');
        await logout();
      }
      return null;
    }
  };

  const value = {
    user,
    setUser: updateUser, // Provide setUser for backward compatibility
    isAuthenticated,
    loading, // Keep the same name as your existing code
    isLoading: loading, // Also provide isLoading alias for consistency
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