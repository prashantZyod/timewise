import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

// Token expiration time (24 hours in milliseconds)
const TOKEN_EXPIRATION_TIME = 24 * 60 * 60 * 1000;

// Inactivity timeout (30 minutes in milliseconds) 
const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

// Refresh interval (5 minutes in milliseconds)
const REFRESH_INTERVAL = 5 * 60 * 1000;

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();

  // Clear all auth data
  const clearAuthData = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    localStorage.removeItem('rememberMe');
    
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('tokenExpiry');
    
    setCurrentUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
  };

  // Load user from storage
  const loadUserFromStorage = () => {
    try {
      // Try localStorage first (for "remember me")
      let token = localStorage.getItem('authToken');
      let refreshToken = localStorage.getItem('refreshToken');
      let tokenExpiry = localStorage.getItem('tokenExpiry');
      let user = localStorage.getItem('user');
      let storage = 'localStorage';
      
      // If not in localStorage, try sessionStorage
      if (!token) {
        token = sessionStorage.getItem('authToken');
        refreshToken = sessionStorage.getItem('refreshToken');
        tokenExpiry = sessionStorage.getItem('tokenExpiry');
        user = sessionStorage.getItem('user');
        storage = 'sessionStorage';
      }
      
      if (token && user && tokenExpiry) {
        user = JSON.parse(user);
        
        // Check if token is expired
        if (new Date(tokenExpiry) > new Date()) {
          setCurrentUser(user);
          setIsAuthenticated(true);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          return true;
        } else if (refreshToken) {
          // We'll try to refresh in the useEffect
          return false;
        }
      }
      
      clearAuthData();
      return false;
    } catch (error) {
      console.error('Error loading user from storage:', error);
      clearAuthData();
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/users/login', { email, password });
      const { token, refreshToken, user, expiresIn } = response.data;
      
      // Calculate token expiry
      const expiryTime = new Date();
      expiryTime.setTime(expiryTime.getTime() + (expiresIn * 1000 || TOKEN_EXPIRATION_TIME));
      
      // Store in localStorage or sessionStorage based on rememberMe
      if (rememberMe) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('tokenExpiry', expiryTime.toISOString());
        localStorage.setItem('rememberMe', 'true');
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('refreshToken', refreshToken);
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('tokenExpiry', expiryTime.toISOString());
      }
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setCurrentUser(user);
      setIsAuthenticated(true);
      setLastActivity(Date.now());
      
      return user;
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.msg || 'Failed to login. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (redirectUrl = '/login') => {
    setLoading(true);
    
    try {
      // Get the refresh token to invalidate it
      const refreshToken = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      
      // Call logout API to invalidate the token on the server
      if (isAuthenticated && refreshToken) {
        await api.post('/api/users/logout', { refreshToken });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      clearAuthData();
      setLoading(false);
      navigate(redirectUrl);
    }
  };

  // Logout from all devices
  const logoutAllDevices = async () => {
    setLoading(true);
    
    try {
      if (isAuthenticated) {
        await api.post('/api/users/logout-all');
        clearAuthData();
        navigate('/login?loggedout=all');
      }
    } catch (err) {
      console.error('Logout all devices error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/api/users/forgot-password', { email });
      return true;
    } catch (err) {
      console.error('Password reset request error:', err);
      const errorMessage = err.response?.data?.msg || 'Failed to request password reset.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/api/users/reset-password', { token, newPassword });
      return true;
    } catch (err) {
      console.error('Password reset error:', err);
      const errorMessage = err.response?.data?.msg || 'Failed to reset password.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/users/verify-email', { token });
      return true;
    } catch (err) {
      console.error('Email verification error:', err);
      const errorMessage = err.response?.data?.msg || 'Failed to verify email.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.post('/api/users/resend-verification', { email });
      return true;
    } catch (err) {
      console.error('Resend verification error:', err);
      const errorMessage = err.response?.data?.msg || 'Failed to resend verification email.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const token = localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
      
      if (!token) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post('/api/users/refresh-token', { refreshToken: token });
      const { token: newToken, refreshToken: newRefreshToken, expiresIn } = response.data;
      
      // Calculate new token expiry
      const expiryTime = new Date();
      expiryTime.setTime(expiryTime.getTime() + (expiresIn * 1000 || TOKEN_EXPIRATION_TIME));
      
      // Update token in storage
      if (localStorage.getItem('rememberMe') === 'true') {
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('tokenExpiry', expiryTime.toISOString());
      } else {
        sessionStorage.setItem('authToken', newToken);
        sessionStorage.setItem('refreshToken', newRefreshToken);
        sessionStorage.setItem('tokenExpiry', expiryTime.toISOString());
      }
      
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      return true;
    } catch (err) {
      console.error('Token refresh error:', err);
      clearAuthData();
      return false;
    }
  };

  // Update user activity timestamp
  const updateActivity = () => {
    setLastActivity(Date.now());
  };

  // Check for inactivity and log out if needed
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const inactivityCheck = setInterval(() => {
      const now = Date.now();
      
      if (now - lastActivity > INACTIVITY_TIMEOUT) {
        // User has been inactive too long
        console.log('Logging out due to inactivity');
        logout('/login?timeout=true');
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(inactivityCheck);
  }, [isAuthenticated, lastActivity, logout]);

  // Set up activity listeners
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    
    const handleActivity = () => {
      updateActivity();
    };
    
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });
    
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, updateActivity]);

  // Token refresh interval
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const refreshInterval = setInterval(() => {
      refreshToken().catch(err => {
        console.error('Auto token refresh failed:', err);
        logout('/login?session=expired');
      });
    }, REFRESH_INTERVAL);
    
    return () => clearInterval(refreshInterval);
  }, [isAuthenticated, refreshToken, logout]);

  // Initial load
  useEffect(() => {
    const initialize = async () => {
      const hasValidToken = loadUserFromStorage();
      
      if (!hasValidToken) {
        const refreshed = await refreshToken();
        
        if (!refreshed) {
          setLoading(false);
        }
      }
    };
    
    initialize();
  }, [loadUserFromStorage, refreshToken]);

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    if (!currentUser) return false;
    
    // Admin has access to everything
    if (currentUser.role === 'admin') return true;
    
    // Check if user has the required role
    return currentUser.role === requiredRole;
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    logoutAllDevices,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    updateActivity,
    hasRole,
    isAdmin: currentUser?.role === 'admin',
    isStaff: currentUser?.role === 'staff'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;