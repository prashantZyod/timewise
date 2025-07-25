import React, { createContext, useContext, useState, useCallback } from 'react';
import { getCurrentPosition, isWithinGeofence } from '../services/geolocation';

// Create the context
const GeoLocationContext = createContext();

// Provider component
export const GeoLocationProvider = ({ children }) => {
  // State for current location
  const [currentPosition, setCurrentPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(null);

  // Get current position
  const getPosition = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const position = await getCurrentPosition();
      setCurrentPosition(position);
      setPermissionGranted(true);
      return position;
    } catch (err) {
      console.error('Error getting position:', err);
      setError(err.message);
      
      if (err.message.includes('permission denied')) {
        setPermissionGranted(false);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if user is within geofence
  const checkGeofence = useCallback(async (branch) => {
    if (!branch || !branch.latitude || !branch.longitude) {
      throw new Error('Branch location information is missing');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await isWithinGeofence(
        branch.latitude,
        branch.longitude,
        branch.geofenceRadius || 100
      );
      
      setCurrentPosition(result.position);
      setPermissionGranted(true);
      return result;
    } catch (err) {
      console.error('Geofence check error:', err);
      setError(err.message);
      
      if (err.message.includes('permission denied')) {
        setPermissionGranted(false);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Request permission explicitly
  const requestPermission = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // This will trigger the browser permission dialog
      await getPosition();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [getPosition]);

  // Context value
  const value = {
    currentPosition,
    loading,
    error,
    permissionGranted,
    
    // Methods
    getPosition,
    checkGeofence,
    requestPermission
  };

  return (
    <GeoLocationContext.Provider value={value}>
      {children}
    </GeoLocationContext.Provider>
  );
};

// Custom hook to use the geo location context
export const useGeoLocation = () => {
  const context = useContext(GeoLocationContext);
  if (!context) {
    throw new Error('useGeoLocation must be used within a GeoLocationProvider');
  }
  return context;
};

export default GeoLocationContext;
