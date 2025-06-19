// src/context/AuthContext.jsx - Simplified for current backend
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
    
    console.log('🔄 loadUser called - checking authentication via cookies');
    isLoadingUser.current = true;
    
    try {
      setLoading(true);
      
      // Check if user is stored in localStorage (for UI persistence)
      const storedUser = localStorage.getItem('user');
      console.log('💾 Stored user found:', !!storedUser);
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('✅ Using stored user data:', userData.username || userData.email);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Verify with backend using cookies
          try {
            console.log('🔍 Verifying stored user with backend...');
            const { data } = await authAPI.getProfile();
            if (data) {
              console.log('✅ Backend verification successful');
              setUser(data);
              localStorage.setItem('user', JSON.stringify(data));
            }
          } catch (verifyError) {
            console.warn('⚠️ Backend verification failed:', verifyError.response?.status);
            if (verifyError.response?.status === 401) {
              console.log('🧹 Clearing invalid stored data');
              localStorage.removeItem('user');
              setUser(null);
              setIsAuthenticated(false);
            }
          }
          
        } catch (parseError) {
          console.error('❌ Error parsing stored user data:', parseError);
          localStorage.removeItem('user');
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No stored user, check if we have valid cookies
        try {
          console.log('🔍 Checking for valid session via cookies...');
          const { data } = await authAPI.getProfile();
          if (data) {
            console.log('✅ Found valid session via cookies');
            setUser(data);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(data));
          }
        } catch (err) {
          console.log('👤 No valid session found');
          setUser(null);
          setIsAuthenticated(false);
        }
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
      
      if (data) {
        console.log('✅ Login successful:', data.username || data.email);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setIsAuthenticated(true);
        hasLoadedUser.current = true;
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
      console.log('📝 Attempting registration...');
      const { data } = await authAPI.register(userData);
      
      if (data) {
        console.log('✅ Registration successful:', data.username || data.email);
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setIsAuthenticated(true);
        hasLoadedUser.current = true;
        return data;
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
      console.log('✅ Backend logout successful - cookie cleared');
    } catch (err) {
      console.error('⚠️ Error during logout API call:', err);
    } finally {
      // Clear local state regardless of API success
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