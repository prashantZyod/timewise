// Utility function to calculate distance between two points using the Haversine formula
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c * 1000; // Convert to meters
  
  return distance;
};

// Get current user position with a promise-based interface
export const getCurrentPosition = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      error => {
        let errorMessage;
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied. Please enable location services to check in.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get location timed out. Please try again.';
            break;
          default:
            errorMessage = 'An unknown error occurred while getting location.';
            break;
        }
        
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options
      }
    );
  });
};

// Check if user is within the allowed radius of a branch
export const isWithinGeofence = async (branchLatitude, branchLongitude, geofenceRadius = 100) => {
  try {
    const position = await getCurrentPosition();
    
    const distance = calculateDistance(
      position.latitude,
      position.longitude,
      branchLatitude,
      branchLongitude
    );
    
    return {
      isWithin: distance <= geofenceRadius,
      distance: Math.round(distance),
      position
    };
  } catch (error) {
    throw error;
  }
};