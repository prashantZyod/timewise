/**
 * Geolocation Utility Functions
 * This file contains helper functions for common geolocation operations
 * such as distance calculations, geofence validation, etc.
 */

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * This calculates the great-circle distance between two points on a sphere
 * 
 * @param {Object} coord1 - First coordinate {latitude, longitude}
 * @param {Object} coord2 - Second coordinate {latitude, longitude}
 * @returns {number} Distance in meters between the two coordinates
 */
export const calculateDistance = (coord1, coord2) => {
  // Radius of the Earth in meters
  const earthRadius = 6371000;
  
  // Convert latitude and longitude from degrees to radians
  const lat1 = deg2rad(coord1.latitude);
  const lon1 = deg2rad(coord1.longitude);
  const lat2 = deg2rad(coord2.latitude);
  const lon2 = deg2rad(coord2.longitude);
  
  // Haversine formula
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadius * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 * 
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
const deg2rad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Check if a coordinate is within a circular geofence
 * 
 * @param {Object} userLocation - User's current location {latitude, longitude}
 * @param {Object} geofenceCenter - Center of the geofence {latitude, longitude}
 * @param {number} radiusInMeters - Radius of the geofence in meters
 * @returns {boolean} True if the user is within the geofence, false otherwise
 */
export const isWithinGeofence = (userLocation, geofenceCenter, radiusInMeters) => {
  const distance = calculateDistance(userLocation, geofenceCenter);
  return distance <= radiusInMeters;
};

/**
 * Format coordinates in a human-readable way
 * 
 * @param {Object} coordinates - Coordinates {latitude, longitude}
 * @param {boolean} withLabels - Whether to include "Lat:" and "Long:" labels
 * @returns {string} Formatted coordinates string
 */
export const formatCoordinates = (coordinates, withLabels = true) => {
  if (!coordinates || typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
    return 'Invalid coordinates';
  }
  
  const lat = coordinates.latitude.toFixed(6);
  const lng = coordinates.longitude.toFixed(6);
  
  return withLabels 
    ? `Lat: ${lat}, Long: ${lng}`
    : `${lat}, ${lng}`;
};

/**
 * Get a user-friendly description of the accuracy
 * 
 * @param {number} accuracyInMeters - The accuracy in meters
 * @returns {string} A user-friendly description of the accuracy
 */
export const getAccuracyDescription = (accuracyInMeters) => {
  if (accuracyInMeters < 10) {
    return 'Excellent (within 10 meters)';
  } else if (accuracyInMeters < 50) {
    return 'Good (within 50 meters)';
  } else if (accuracyInMeters < 100) {
    return 'Fair (within 100 meters)';
  } else {
    return 'Poor (over 100 meters)';
  }
};

/**
 * Check if the device supports high-accuracy geolocation
 * This is a simple check that attempts to determine if the device
 * has GPS capabilities by checking for high accuracy options support
 * 
 * @returns {Promise<boolean>} True if high-accuracy is supported
 */
export const supportsHighAccuracyLocation = async () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false);
      return;
    }
    
    // Try to get a high-accuracy position
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    
    // If we get a position with high accuracy, resolve true
    // If we time out or get an error, resolve false
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position.coords.accuracy < 100); // Consider high-accuracy if < 100m
      },
      () => {
        resolve(false);
      },
      options
    );
  });
};

/**
 * Generate a Google Maps URL for the given coordinates
 * 
 * @param {Object} coordinates - Coordinates {latitude, longitude}
 * @returns {string} Google Maps URL for the given coordinates
 */
export const getGoogleMapsUrl = (coordinates) => {
  if (!coordinates || typeof coordinates.latitude !== 'number' || typeof coordinates.longitude !== 'number') {
    return '#';
  }
  
  return `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;
};

export default {
  calculateDistance,
  isWithinGeofence,
  formatCoordinates,
  getAccuracyDescription,
  supportsHighAccuracyLocation,
  getGoogleMapsUrl
};
