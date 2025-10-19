import React, { createContext, useContext, useEffect, useState } from 'react';
import { getToken, getUserData, removeToken, removeUserData } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (token) {
        // Load user data from storage
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token exists but no user data - clear everything
          await removeToken();
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // No token = not authenticated
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logoutUser = async () => {
    await removeToken();
    await removeUserData();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};