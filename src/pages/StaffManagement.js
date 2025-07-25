import React from 'react';
import { useStaff } from '../contexts';
import { Redirect } from 'react-router-dom';

// This is a wrapper component that just imports and renders the actual StaffManagement component
export default function StaffManagement() {
  const { loading } = useStaff();
  
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Loading staff management...</p>
      </div>
    );
  }
  
  // Import and render the actual component
  const StaffManagementComponent = require('../components/management/StaffManagement').default;
  return <StaffManagementComponent />;
}
