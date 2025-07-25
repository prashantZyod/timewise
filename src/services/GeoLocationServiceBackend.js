import GeoLocationService from './GeoLocationService';
import api from './api';

/**
 * Extended GeoLocationService that integrates with the backend API
 */
class GeoLocationServiceBackend extends GeoLocationService {
  /**
   * Get current location and check if it's within the specified geofence
   * @param {string} geofenceId - ID of the geofence to check against
   * @returns {Promise<Object>} - Location result with geofence check
   */
  static async getCurrentLocationWithGeofenceCheck(geofenceId) {
    try {
      // Get current position using the parent class method
      const currentPosition = await this.getCurrentPosition();
      
      // Check against geofence using backend API
      const geofenceCheck = await api.geofence.checkLocationInGeofence({
        geofenceId,
        location: currentPosition
      });
      
      return {
        ...currentPosition,
        isWithinGeofence: geofenceCheck.data.isWithin,
        distance: geofenceCheck.data.distance,
        radius: geofenceCheck.data.radius,
        geofence: geofenceCheck.data.geofence
      };
    } catch (error) {
      console.error('Error in getCurrentLocationWithGeofenceCheck:', error);
      throw error;
    }
  }

  /**
   * Check in at the current location
   * @param {string} staffId - Staff ID
   * @param {string} branchId - Branch ID
   * @param {Object} deviceInfo - Device information
   * @param {string} notes - Optional notes
   * @param {Object} customPremiseData - Optional custom premise data
   * @returns {Promise<Object>} - Check-in result
   */
  static async checkIn(staffId, branchId, deviceInfo, notes = '', customPremiseData = null) {
    try {
      const currentPosition = await this.getCurrentPosition();
      
      return await api.attendance.checkIn({
        staffId,
        branchId,
        location: currentPosition,
        deviceInfo,
        notes,
        customPremiseData
      });
    } catch (error) {
      console.error('Error in checkIn:', error);
      throw error;
    }
  }

  /**
   * Check out from the current location
   * @param {string} staffId - Staff ID
   * @param {Object} deviceInfo - Device information
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} - Check-out result
   */
  static async checkOut(staffId, deviceInfo, notes = '') {
    try {
      const currentPosition = await this.getCurrentPosition();
      
      return await api.attendance.checkOut({
        staffId,
        location: currentPosition,
        deviceInfo,
        notes
      });
    } catch (error) {
      console.error('Error in checkOut:', error);
      throw error;
    }
  }

  /**
   * Update location tracking data
   * @param {string} staffId - Staff ID
   * @returns {Promise<Object>} - Location update result
   */
  static async updateLocationTracking(staffId) {
    try {
      const currentPosition = await this.getCurrentPosition();
      
      return await api.attendance.updateLocation({
        staffId,
        location: currentPosition
      });
    } catch (error) {
      console.error('Error in updateLocationTracking:', error);
      throw error;
    }
  }

  /**
   * Start tracking location for a staff member
   * @param {string} staffId - Staff ID
   * @param {number} interval - Update interval in minutes (default: 5)
   * @returns {Object} - Tracking controller
   */
  static startLocationTracking(staffId, interval = 5) {
    let trackingId = null;
    const intervalMs = interval * 60 * 1000;
    
    const updateLocation = async () => {
      try {
        await this.updateLocationTracking(staffId);
      } catch (error) {
        console.error('Error updating location:', error);
      }
    };
    
    // Initial update
    updateLocation();
    
    // Set interval for regular updates
    trackingId = setInterval(updateLocation, intervalMs);
    
    return {
      stop: () => {
        if (trackingId) {
          clearInterval(trackingId);
          trackingId = null;
        }
      },
      isTracking: () => trackingId !== null
    };
  }

  /**
   * Register a new device
   * @param {string} staffId - Staff ID
   * @param {string} deviceId - Unique device identifier
   * @param {string} name - Device name
   * @param {string} type - Device type
   * @param {Object} browserInfo - Browser information
   * @param {Object} osInfo - OS information
   * @returns {Promise<Object>} - Registration result
   */
  static async registerDevice(staffId, deviceId, name, type, browserInfo, osInfo) {
    try {
      const currentPosition = await this.getCurrentPosition();
      
      return await api.device.registerDevice({
        deviceId,
        name,
        type,
        staffId,
        browserInfo,
        osInfo,
        lastKnownLocation: currentPosition
      });
    } catch (error) {
      console.error('Error in registerDevice:', error);
      throw error;
    }
  }

  /**
   * Save a custom premise location to both localStorage and backend
   * @param {Object} customLocation - The custom location {latitude, longitude, radius, name}
   * @param {string} branchId - Branch ID
   * @returns {Promise<Boolean>} - Success status
   */
  static async saveCustomPremiseLocationToBackend(customLocation, branchId) {
    try {
      // First save to localStorage using parent method
      const localSaveResult = this.saveCustomPremiseLocation(customLocation);
      
      if (!localSaveResult) {
        throw new Error('Failed to save to localStorage');
      }
      
      // Then save to backend as a geofence
      await api.geofence.createGeofence({
        name: customLocation.name || 'Custom Premise',
        branchId,
        center: {
          latitude: parseFloat(customLocation.latitude),
          longitude: parseFloat(customLocation.longitude)
        },
        radius: parseInt(customLocation.radius || 250, 10),
        customPremise: true
      });
      
      return true;
    } catch (error) {
      console.error('Error saving custom premise to backend:', error);
      return false;
    }
  }
}

export default GeoLocationServiceBackend;
