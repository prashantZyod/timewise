/**
 * GeoLocation Service
 * Handles location-based operations and calculations
 */
class GeoLocationService {
  /**
   * Get the current position using browser's geolocation API
   * @param {Object} options - Geolocation options
   * @returns {Promise<Object>} - Location data with coordinates
   */
  static async getCurrentPosition(options = {}) {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        position => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        }),
        error => {
          let errorMessage = 'Unknown location error';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied. Please enable location services for this site.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable. Please try again.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out. Please check your connection.';
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
  }
  
  /**
   * Start watching position changes
   * @param {Function} successCallback - Called on position updates
   * @param {Function} errorCallback - Called on errors
   * @param {Object} options - Geolocation options
   * @returns {Number} - Watch ID for clearing the watch
   */
  static watchPosition(successCallback, errorCallback, options = {}) {
    if (!navigator.geolocation) {
      errorCallback(new Error('Geolocation is not supported by this browser'));
      return null;
    }
    
    return navigator.geolocation.watchPosition(
      position => successCallback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString()
      }),
      errorCallback,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        ...options
      }
    );
  }
  
  /**
   * Stop watching position changes
   * @param {Number} watchId - Watch ID from watchPosition
   */
  static clearWatch(watchId) {
    if (navigator.geolocation && watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  }
  
  /**
   * Calculate distance between two coordinates using Haversine formula
   * @param {Object} point1 - First coordinate {latitude, longitude}
   * @param {Object} point2 - Second coordinate {latitude, longitude}
   * @returns {Number} - Distance in meters
   */
  static calculateDistance(point1, point2) {
    // Haversine formula for calculating distance between coordinates
    const R = 6371e3; // Earth radius in meters
    const φ1 = point1.latitude * Math.PI/180;
    const φ2 = point2.latitude * Math.PI/180;
    const Δφ = (point2.latitude - point1.latitude) * Math.PI/180;
    const Δλ = (point2.longitude - point1.longitude) * Math.PI/180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c; // distance in meters
  }
  
  /**
   * Check if a location is within specified radius of another location
   * @param {Object} userLocation - User's coordinates {latitude, longitude}
   * @param {Object} targetLocation - Target coordinates {latitude, longitude}
   * @param {Number} radius - Radius in meters (default: 100m)
   * @returns {Object} - Result with isWithin flag, distance and radius
   */
  static isWithinRadius(userLocation, targetLocation, radius = 100) {
    const distance = this.calculateDistance(userLocation, targetLocation);
    return {
      isWithin: distance <= radius,
      distance,
      radius
    };
  }
  
  /**
   * Get a user-friendly address from coordinates using reverse geocoding
   * @param {Object} coordinates - Location coordinates {latitude, longitude}
   * @returns {Promise<String>} - Human-readable address
   */
  static async getAddressFromCoordinates(coordinates) {
    try {
      if (!coordinates || !this.validateCoordinates(coordinates)) {
        throw new Error('Invalid coordinates provided');
      }
      
      // Try to use backend geocoding service if available
      try {
        const response = await fetch(`/api/geolocation/geocode?lat=${coordinates.latitude}&lng=${coordinates.longitude}`);
        if (response.ok) {
          const data = await response.json();
          if (data.address) {
            return data.address;
          }
        }
      } catch (backendError) {
        console.warn('Backend geocoding service unavailable:', backendError);
        // Continue with local fallback
      }
      
      // Local fallback
      return `Location at ${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return 'Unknown location';
    }
  }
  
  /**
   * Validate if the coordinates are valid
   * @param {Object} coordinates - Location coordinates {latitude, longitude}
   * @returns {Boolean} - Whether coordinates are valid
   */
  static validateCoordinates(coordinates) {
    if (!coordinates || typeof coordinates !== 'object') return false;
    
    const { latitude, longitude } = coordinates;
    
    return (
      typeof latitude === 'number' && 
      typeof longitude === 'number' &&
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180
    );
  }
  
  /**
   * Track continuous presence within factory geofence
   * @param {string} employeeId - The employee ID to track
   * @param {Object} factoryLocation - The factory location {latitude, longitude}
   * @param {number} radius - The geofence radius in meters (default: 250m)
   * @param {number} interval - Checking interval in minutes (default: 15min)
   * @returns {Object} - Tracking controller with start/stop methods
   */
  static trackFactoryPresence(employeeId, factoryLocation, radius = 250, interval = 15) {
    let trackingId = null;
    let presenceLog = [];
    const intervalMs = interval * 60 * 1000;
    
    const checkPresence = async () => {
      try {
        // Get current position
        const currentPosition = await this.getCurrentPosition();
        
        // Check if within factory geofence
        const verification = this.isWithinRadius(
          currentPosition,
          factoryLocation,
          radius
        );
        
        // Log the presence check
        const presenceCheck = {
          employeeId,
          timestamp: new Date(),
          isWithinGeofence: verification.isWithin,
          distance: verification.distance,
          location: {
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
            accuracy: currentPosition.accuracy
          }
        };
        
        presenceLog.push(presenceCheck);
        
        // Store in localStorage for persistence
        const existingLogs = JSON.parse(localStorage.getItem('presenceLogs') || '{}');
        if (!existingLogs[employeeId]) {
          existingLogs[employeeId] = [];
        }
        existingLogs[employeeId].push(presenceCheck);
        localStorage.setItem('presenceLogs', JSON.stringify(existingLogs));
        
        // Check if employee left the geofence
        if (!verification.isWithin) {
          // This is where you could trigger an alert or notification
          console.warn(`Employee ${employeeId} has left the factory geofence!`);
        }
        
        return presenceCheck;
      } catch (error) {
        console.error('Error tracking presence:', error);
        return null;
      }
    };
    
    return {
      start: () => {
        // Perform initial check
        checkPresence();
        
        // Set up interval for periodic checks
        trackingId = setInterval(checkPresence, intervalMs);
        
        return trackingId;
      },
      stop: () => {
        if (trackingId) {
          clearInterval(trackingId);
          trackingId = null;
        }
        return presenceLog;
      },
      getLog: () => {
        return presenceLog;
      },
      checkNow: checkPresence
    };
  }
  
  /**
   * Calculate the total time an employee spent within the factory geofence
   * @param {string} employeeId - The employee ID
   * @param {Date} startDate - The start date to calculate from
   * @param {Date} endDate - The end date to calculate to (defaults to now)
   * @returns {Object} - Time statistics {totalMinutes, compliancePercentage, breachCount}
   */
  static calculateGeofenceCompliance(employeeId, startDate, endDate = new Date()) {
    try {
      // Get logs from localStorage
      const allLogs = JSON.parse(localStorage.getItem('presenceLogs') || '{}');
      const employeeLogs = allLogs[employeeId] || [];
      
      // Filter logs by date range
      const logsInRange = employeeLogs.filter(log => {
        const logDate = new Date(log.timestamp);
        return logDate >= startDate && logDate <= endDate;
      });
      
      if (logsInRange.length === 0) {
        return {
          totalMinutes: 0,
          compliancePercentage: 0,
          breachCount: 0,
          logs: []
        };
      }
      
      // Calculate statistics
      const compliantLogs = logsInRange.filter(log => log.isWithinGeofence);
      const breachCount = logsInRange.length - compliantLogs.length;
      const compliancePercentage = (compliantLogs.length / logsInRange.length) * 100;
      
      // Calculate total time (assuming each log represents the interval period)
      const totalHours = logsInRange.length * 15 / 60; // 15 min intervals to hours
      
      return {
        totalHours,
        compliancePercentage,
        breachCount,
        logs: logsInRange
      };
    } catch (error) {
      console.error('Error calculating geofence compliance:', error);
      return {
        totalHours: 0,
        compliancePercentage: 0,
        breachCount: 0,
        logs: []
      };
    }
  }
  
  /**
   * Save a custom premise location to localStorage
   * @param {Object} customLocation - The custom location {latitude, longitude, radius, name}
   * @returns {Boolean} - Success status
   */
  static saveCustomPremiseLocation(customLocation) {
    try {
      if (!customLocation) {
        console.error('Null or undefined location provided');
        throw new Error('Invalid location: null or undefined');
      }
      
      console.log('Attempting to save custom location:', customLocation);
      
      if (!this.validateCoordinates(customLocation)) {
        console.error('Invalid coordinates:', customLocation);
        throw new Error('Invalid location coordinates');
      }
      
      // Ensure the object has all required properties
      const locationToSave = {
        latitude: parseFloat(customLocation.latitude),
        longitude: parseFloat(customLocation.longitude),
        radius: parseInt(customLocation.radius || 250, 10),
        name: customLocation.name || 'Custom Premise',
        timestamp: new Date().toISOString()
      };
      
      console.log('Saving location to localStorage:', locationToSave);
      localStorage.setItem('customPremiseLocation', JSON.stringify(locationToSave));
      
      // Verify it was saved correctly
      const savedLocation = this.getCustomPremiseLocation();
      console.log('Verified saved location:', savedLocation);
      
      return true;
    } catch (error) {
      console.error('Error saving custom premise location:', error);
      return false;
    }
  }
  
  /**
   * Get the saved custom premise location from localStorage
   * @returns {Object|null} - The saved custom location or null if not found
   */
  static getCustomPremiseLocation() {
    try {
      const saved = localStorage.getItem('customPremiseLocation');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error getting custom premise location:', error);
      return null;
    }
  }
  
  /**
   * Check if a location is within the custom premise geofence
   * @param {Object} userLocation - User's coordinates {latitude, longitude}
   * @returns {Object} - Result with isWithin flag, distance and radius
   */
  static isWithinCustomPremise(userLocation) {
    const customPremise = this.getCustomPremiseLocation();
    
    if (!customPremise || !this.validateCoordinates(userLocation)) {
      return {
        isWithin: false,
        distance: null,
        radius: null,
        premiseExists: !!customPremise
      };
    }
    
    const result = this.isWithinRadius(
      userLocation,
      {
        latitude: customPremise.latitude,
        longitude: customPremise.longitude
      },
      customPremise.radius
    );
    
    return {
      ...result,
      premiseName: customPremise.name,
      premiseExists: true
    };
  }
}

export default GeoLocationService;
