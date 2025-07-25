import React, { useState, useEffect } from 'react';
import { useGeoLocation } from '../../contexts/GeoLocationContext';
import { MapPin, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

/**
 * Component that requests and handles geolocation permissions
 * 
 * @param {Object} props Component props
 * @param {Function} props.onLocationGranted Callback when location is successfully retrieved
 * @param {Function} props.onLocationDenied Callback when location access is denied
 * @param {Function} props.onLocationError Callback when location retrieval fails
 * @param {boolean} props.autoRequest Whether to automatically request location on mount
 */
const LocationPermissionRequest = ({ 
  onLocationGranted, 
  onLocationDenied, 
  onLocationError,
  autoRequest = true,
  className = ''
}) => {
  // Get location methods from context
  const { 
    getCurrentLocation, 
    locationError, 
    currentLocation,
    loadingLocation 
  } = useGeoLocation();
  
  // Local state for permission status
  const [permissionStatus, setPermissionStatus] = useState('pending'); // pending, granted, denied, error
  const [permissionMessage, setPermissionMessage] = useState('');

  // Request location permission
  const requestLocationPermission = async () => {
    try {
      // Check for permissions API support
      if (navigator.permissions && navigator.permissions.query) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        // Update UI based on permission state
        if (permission.state === 'granted') {
          setPermissionStatus('granted');
          setPermissionMessage('Location access is granted');
        } else if (permission.state === 'denied') {
          setPermissionStatus('denied');
          setPermissionMessage('Location access is denied. Please enable location in your browser settings.');
          if (onLocationDenied) onLocationDenied('Permission denied');
          return;
        } else {
          // prompt state - will be handled by getCurrentLocation
          setPermissionStatus('pending');
          setPermissionMessage('Requesting location access...');
        }
        
        // Listen for permission changes
        permission.addEventListener('change', (e) => {
          if (e.target.state === 'granted') {
            setPermissionStatus('granted');
            setPermissionMessage('Location access is granted');
            getCurrentLocation();
          } else if (e.target.state === 'denied') {
            setPermissionStatus('denied');
            setPermissionMessage('Location access is denied');
            if (onLocationDenied) onLocationDenied('Permission denied');
          }
        });
      }
      
      // Get current location (this will prompt for permission if needed)
      const location = await getCurrentLocation();
      
      if (location) {
        setPermissionStatus('granted');
        setPermissionMessage('Location access is granted');
        if (onLocationGranted) onLocationGranted(location);
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      setPermissionStatus('error');
      setPermissionMessage(error.message || 'Failed to request location permission');
      if (onLocationError) onLocationError(error);
    }
  };

  // Effect to auto-request location on mount if enabled
  useEffect(() => {
    if (autoRequest) {
      requestLocationPermission();
    }
  }, [autoRequest]);

  // Update based on location error from context
  useEffect(() => {
    if (locationError) {
      setPermissionStatus('error');
      setPermissionMessage(locationError);
      if (onLocationError) onLocationError(new Error(locationError));
    }
  }, [locationError, onLocationError]);

  // Update based on successful location retrieval
  useEffect(() => {
    if (currentLocation && permissionStatus !== 'granted') {
      setPermissionStatus('granted');
      setPermissionMessage('Location access is granted');
      if (onLocationGranted) onLocationGranted(currentLocation);
    }
  }, [currentLocation, permissionStatus, onLocationGranted]);

  // Render appropriate UI based on status
  return (
    <div className={`rounded-lg p-4 ${className}`}>
      {permissionStatus === 'pending' && (
        <div className="flex items-center gap-3 bg-blue-50 text-blue-800 p-4 rounded-lg">
          <div className={`${loadingLocation ? 'animate-pulse' : ''}`}>
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">Location Access</h3>
            <p className="text-sm">{loadingLocation ? 'Requesting location access...' : 'Please allow location access when prompted'}</p>
          </div>
          {!loadingLocation && !autoRequest && (
            <button 
              onClick={requestLocationPermission}
              className="ml-auto bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm transition-colors"
            >
              Allow Access
            </button>
          )}
        </div>
      )}

      {permissionStatus === 'granted' && (
        <div className="flex items-center gap-3 bg-green-50 text-green-800 p-4 rounded-lg">
          <CheckCircle className="h-5 w-5" />
          <div>
            <h3 className="font-medium">Location Access Granted</h3>
            {currentLocation && (
              <p className="text-sm">
                Your location: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      )}

      {permissionStatus === 'denied' && (
        <div className="flex items-center gap-3 bg-red-50 text-red-800 p-4 rounded-lg">
          <XCircle className="h-5 w-5" />
          <div>
            <h3 className="font-medium">Location Access Denied</h3>
            <p className="text-sm">{permissionMessage}</p>
            <p className="text-xs mt-1">
              Please enable location access in your browser settings and refresh the page.
            </p>
          </div>
        </div>
      )}

      {permissionStatus === 'error' && (
        <div className="flex items-center gap-3 bg-orange-50 text-orange-800 p-4 rounded-lg">
          <AlertTriangle className="h-5 w-5" />
          <div>
            <h3 className="font-medium">Location Error</h3>
            <p className="text-sm">{permissionMessage}</p>
            <button 
              onClick={requestLocationPermission}
              className="mt-2 bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1 rounded text-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPermissionRequest;
