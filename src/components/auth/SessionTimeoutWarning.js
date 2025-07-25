import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Clock, RefreshCcw } from 'lucide-react';

// Time before showing warning (in milliseconds)
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const CHECK_INTERVAL = 60 * 1000; // 1 minute

const SessionTimeoutWarning = () => {
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(WARNING_BEFORE_TIMEOUT / 1000);
  const { isAuthenticated, lastActivity, updateActivity, logout } = useAuth();
  
  const checkTimeout = useCallback(() => {
    if (!isAuthenticated) return;
    
    const inactivityTime = Date.now() - lastActivity;
    const timeoutTime = 30 * 60 * 1000; // 30 minutes (same as in AuthContext)
    const timeLeft = timeoutTime - inactivityTime;
    
    if (timeLeft <= WARNING_BEFORE_TIMEOUT) {
      setShowWarning(true);
      setTimeRemaining(Math.max(Math.floor(timeLeft / 1000), 0));
    } else {
      setShowWarning(false);
    }
  }, [isAuthenticated, lastActivity]);
  
  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Extend the session
  const extendSession = () => {
    updateActivity();
    setShowWarning(false);
  };
  
  useEffect(() => {
    const interval = setInterval(checkTimeout, CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [checkTimeout]);
  
  // Countdown timer when warning is shown
  useEffect(() => {
    let countdownInterval;
    
    if (showWarning && timeRemaining > 0) {
      countdownInterval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [showWarning, timeRemaining]);
  
  // Auto logout when timer reaches zero
  useEffect(() => {
    if (showWarning && timeRemaining === 0) {
      logout('/login?timeout=true');
    }
  }, [showWarning, timeRemaining, logout]);
  
  if (!showWarning) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <Clock className="w-6 h-6 text-yellow-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Session Timeout Warning
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 text-center">
          Your session will expire in <span className="font-medium text-red-600">{formatTime(timeRemaining)}</span> due to inactivity.
        </p>
        
        <div className="flex justify-center">
          <button
            onClick={extendSession}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Extend Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeoutWarning;