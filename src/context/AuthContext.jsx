
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axiosInstance.get('/auth/me');
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      if (!userData) {
        throw new Error('Invalid user data');
      }
      
      setUser(userData);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
      return { success: true, user: userData };
    } catch (error) {
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axiosInstance.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};