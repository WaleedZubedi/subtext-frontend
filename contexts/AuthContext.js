import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSubscriptionStatus, getToken, getUserData, removeSubscriptionStatus, removeToken, removeUserData } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = await getToken();
      if (token) {
        // Load user data from storage
        const userData = await getUserData();
        const subscriptionStatus = await getSubscriptionStatus();
        
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          setHasSubscription(subscriptionStatus);
        } else {
          // Token exists but no user data - clear everything
          await removeToken();
          await removeSubscriptionStatus();
          setIsAuthenticated(false);
          setUser(null);
          setHasSubscription(false);
        }
      } else {
        // No token = not authenticated
        setIsAuthenticated(false);
        setUser(null);
        setHasSubscription(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setUser(null);
      setHasSubscription(false);
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
    await removeSubscriptionStatus();
    setUser(null);
    setIsAuthenticated(false);
    setHasSubscription(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        hasSubscription,
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