// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';

// Create the context and export it
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // This would be replaced with actual API auth
    // For demo purposes, let's add an admin role if username is "admin"
    const isAdmin = userData.username === "admin";
    
    const userWithRole = {
      ...userData,
      role: isAdmin ? 'admin' : 'user'
    };
    
    setUser(userWithRole);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithRole));
  };

  const register = (userData) => {
    // This would be replaced with actual API registration
    const userWithRole = {
      ...userData,
      role: 'user' // New users are regular users by default
    };
    
    setUser(userWithRole);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userWithRole));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};