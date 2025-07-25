import React from 'react';
import BackendIntegrationDemo from '../components/BackendIntegrationDemo';
import { GeoLocationProvider } from '../contexts/GeoLocationContext';

/**
 * Page to demonstrate backend integration functionality
 */
const BackendDemo = () => {
  return (
    <GeoLocationProvider>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Backend Integration Demo</h1>
        <p className="text-slate-600 mb-6">
          This page demonstrates the integration between the frontend and backend for geofencing and attendance tracking.
        </p>
        
        <div className="grid md:grid-cols-1 gap-6">
          <BackendIntegrationDemo />
        </div>
        
        <div className="mt-10 p-4 bg-slate-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">About This Demo</h2>
          <p className="text-slate-700 mb-4">
            This demonstration showcases the integration between the Timewise frontend React application and the Node.js/Express backend. The key features demonstrated are:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Connecting to backend APIs for geofence management</li>
            <li>Checking if a user's current location is within a geofence boundary</li>
            <li>Device registration with the backend</li>
            <li>Location tracking with periodic updates to the server</li>
            <li>Staff attendance management through the API</li>
          </ul>
          
          <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="text-amber-800 font-medium mb-2">Getting Started</h3>
            <p className="text-amber-700">
              To use this demo effectively, ensure the backend server is running and accessible at the URL specified in your environment variables (REACT_APP_API_URL).
              If you haven't set up the backend yet, check the server directory for instructions.
            </p>
          </div>
        </div>
      </div>
    </GeoLocationProvider>
  );
};

export default BackendDemo;
