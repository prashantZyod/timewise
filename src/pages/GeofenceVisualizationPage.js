import React from 'react';
import GeofenceMonitoringDashboard from '../components/admin/GeofenceMonitoringDashboard';

/**
 * Geofence Visualization Page
 * Page container for the geofence monitoring dashboard
 */
const GeofenceVisualizationPage = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Geofence Monitoring</h1>
      <GeofenceMonitoringDashboard />
    </div>
  );
};

export default GeofenceVisualizationPage;
