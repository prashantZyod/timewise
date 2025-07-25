import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';

/**
 * Combined provider component that wraps all context providers
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

// Export custom hooks for easy access
export { useAuth };
