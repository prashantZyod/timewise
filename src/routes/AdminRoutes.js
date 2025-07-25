import React from 'react';
import { Route, Routes } from 'react-router-dom';
import GeofenceVisualizationPage from '../pages/GeofenceVisualizationPage';
import StaffManagementPage from '../pages/StaffManagementPage';

/**
 * Admin Routes
 * Handles routing for administrative pages
 */
const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/geofence-monitoring" element={<GeofenceVisualizationPage />} />
      <Route path="/staff-management" element={<StaffManagementPage />} />
      <Route path="/staff-management/add" element={<StaffManagementPage />} />
      <Route path="/staff-management/:staffId/:view" element={<StaffManagementPage />} />
      {/* Add other admin routes here */}
    </Routes>
  );
};

export default AdminRoutes;
