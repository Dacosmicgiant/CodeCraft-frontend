// src/context/AuthContext.jsx - Improved version
import { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { authAPI } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Use ref to track if we've already loaded user to prevent double loading in Strict Mode
  const hasLoadedUser = useRef(false);
  const isLoadingUser = useRef(false);

  const loadUser = useCallback(async () => {
    // Prevent duplicate calls in Strict Mode
    if (isLoadingUser.current || hasLoadedUser.current) {
      console.log('🚫 Skipping loadUser - already loaded or loading');
      return;
    }
    
    console.log('🔄 loadUser called - starting authentication check');
    isLoadingUser.current = true;
    
    try {
      setLoading(true);
      
      // Check if user is stored in localStorage
      const storedUser = localStorage.getItem('user');
      console.log('💾 Stored user found:', !!storedUser);
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('✅ Using stored user data:', userData.username || userData.email);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Skip API verification for now to prevent double calls
          console.log('⏭️ Skipping API verification to prevent Strict Mode issues');
          
        } catch (parseError) {
          console.error('❌ Error parsing stored user data:', parseError);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('👤 No stored user found - user not authenticated');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('💥 Critical error in loadUser:', err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      console.log('🏁 loadUser completed, setting loading to false');
      setLoading(false);
      hasLoadedUser.current = true;
      isLoadingUser.current = false;
    }
  }, []);

  // Load user data on mount only
  useEffect(() => {
    console.log('🚀 AuthProvider mounted, calling loadUser');
    loadUser();
    
    // Cleanup function for Strict Mode
    return () => {
      console.log('🧹 AuthProvider cleanup');
      // Reset refs when component unmounts (Strict Mode)
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
      
      if (data) {
        console.log('✅ Login successful:', data);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setIsAuthenticated(true);
        hasLoadedUser.current = true; // Mark as loaded
        return data;
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
      const { data } = await authAPI.register(userData);
      
      if (data) {
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setIsAuthenticated(true);
        hasLoadedUser.current = true; // Mark as loaded
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

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await authAPI.logout();
      console.log('✅ Backend logout successful');
    } catch (err) {
      console.error('⚠️ Error during logout API call:', err);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      hasLoadedUser.current = false; // Reset
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