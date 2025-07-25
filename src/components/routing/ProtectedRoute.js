import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
    </div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page with return path
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredRole && currentUser.role !== requiredRole && currentUser.role !== 'admin') {
    // Admin can access everything, otherwise check for specific role
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;