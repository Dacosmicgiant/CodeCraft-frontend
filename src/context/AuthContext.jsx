// src/context/AuthContext.jsx - JWT Version (Replace your current file)
import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const hasLoadedUser = useRef(false);
  const isLoadingUser = useRef(false);

  const loadUser = useCallback(async () => {
    if (isLoadingUser.current || hasLoadedUser.current) {
      console.log('🚫 Skipping loadUser - already loaded or loading');
      return;
    }
    
    console.log('🔄 loadUser called - checking JWT authentication');
    isLoadingUser.current = true;
    
    try {
      setLoading(true);
      
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      console.log('🔑 Token found:', !!token);
      
      if (token) {
        try {
          // Verify token with backend
          console.log('🔍 Verifying token with backend...');
          const { data } = await authAPI.getProfile();
          console.log('✅ Token verified, user authenticated:', data.username || data.email);
          setUser(data);
          setIsAuthenticated(true);
          
          // Update localStorage with fresh user data
          localStorage.setItem('user', JSON.stringify(data));
        } catch (verifyError) {
          console.warn('⚠️ Token verification failed:', verifyError.response?.status);
          // Clear invalid token
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('👤 No token found - user not authenticated');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('💥 Critical error in loadUser:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      console.log('🏁 loadUser completed');
      setLoading(false);
      hasLoadedUser.current = true;
      isLoadingUser.current = false;
    }
  }, []);

  useEffect(() => {
    console.log('🚀 AuthProvider mounted, calling loadUser');
    loadUser();
    
    return () => {
      console.log('🧹 AuthProvider cleanup');
      hasLoadedUser.current = false;
      isLoadingUser.current = false;
    };
  }, [loadUser]);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔐 Attempting login...');
      const { data } = await authAPI.login(credentials);
      
      if (data && data.token) {
        console.log('✅ Login successful:', data.username || data.email);
        
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        
        setUser(data);
        setIsAuthenticated(true);
        hasLoadedUser.current = true;
        return data;
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      console.log('📝 Attempting registration...');
      const { data } = await authAPI.register(userData);
      
      if (data && data.token) {
        console.log('✅ Registration successful:', data.username || data.email);
        
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        
        setUser(data);
        setIsAuthenticated(true);
        hasLoadedUser.current = true;
        return data;
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      console.error('❌ Registration failed:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await authAPI.logout();
      console.log('✅ Backend logout successful');
    } catch (err) {
      console.error('⚠️ Error during logout API call:', err);
    } finally {
      // Clear local storage and state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      hasLoadedUser.current = false;
      console.log('✅ Local logout complete');
    }
  };

  const updateUser = useCallback((newUserData) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...newUserData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  const hasRole = useCallback((role) => {
    return user && user.role === role;
  }, [user]);

  const isAdmin = useCallback(() => {
    return hasRole('admin');
  }, [hasRole]);

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
      if (err.response?.status === 401) {
        console.log('Session expired during refresh - logging out');
        await logout();
      }
      return null;
    }
  };

  const value = {
    user,
    setUser: updateUser,
    isAuthenticated,
    loading,
    isLoading: loading,
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