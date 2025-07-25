/**
 * Device Service
 * Handles API communication for device-related operations
 */
import Device from '../entities/Device';

class DeviceService {
  /**
   * Base API endpoint for device operations
   * @type {string}
   */
  static baseUrl = '/api/devices';

  /**
   * Get a device by ID
   * @param {string} id - The device ID
   * @returns {Promise<Device|null>} - Returns a promise with device or null
   */
  static async getById(id) {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll use the entity's localStorage implementation
      return await Device.getById(id);
    } catch (error) {
      console.error('Error fetching device:', error);
      throw error;
    }
  }

  /**
   * Get all devices
   * @returns {Promise<Device[]>} - Returns a promise with device array
   */
  static async getAll() {
    try {
      // In a real implementation, this would make an API call
      return await Device.getAll();
    } catch (error) {
      console.error('Error fetching all devices:', error);
      throw error;
    }
  }

  /**
   * List devices with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<{data: Device[], total: number, page: number, limit: number}>} - Paginated result
   */
  static async list(page = 1, limit = 10) {
    try {
      // In a real implementation, this would make an API call
      return await Device.list(page, limit);
    } catch (error) {
      console.error('Error listing devices:', error);
      throw error;
    }
  }

  /**
   * Create a new device
   * @param {Object} data - Device data
   * @returns {Promise<Device>} - Created device
   */
  static async create(data) {
    try {
      // In a real implementation, this would make an API call
      return await Device.create(data);
    } catch (error) {
      console.error('Error creating device:', error);
      throw error;
    }
  }

  /**
   * Update a device
   * @param {string} id - The device ID
   * @param {Object} data - The data to update
   * @returns {Promise<Device>} Updated device
   */
  static async update(id, data) {
    try {
      // In a real implementation, this would make an API call
      return await Device.update(id, data);
    } catch (error) {
      console.error('Error updating device:', error);
      throw error;
    }
  }

  /**
   * Delete a device
   * @param {string} id - The device ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    try {
      // In a real implementation, this would make an API call
      return await Device.delete(id);
    } catch (error) {
      console.error('Error deleting device:', error);
      throw error;
    }
  }
  
  /**
   * Filter devices based on criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Promise<Device[]>} - Returns a promise with filtered device array
   */
  static async filter(criteria) {
    try {
      // In a real implementation, this would make an API call
      return await Device.filter(criteria);
    } catch (error) {
      console.error('Error filtering devices:', error);
      throw error;
    }
  }
  
  /**
   * Update device status (ping)
   * @param {string} id - The device ID
   * @returns {Promise<Device>} Updated device
   */
  static async ping(id) {
    try {
      return await Device.ping(id);
    } catch (error) {
      console.error('Error pinging device:', error);
      throw error;
    }
  }

  /**
   * Get devices by branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Device[]>} - Returns a promise with devices array
   */
  static async getByBranch(branchId) {
    try {
      return await Device.getByBranch(branchId);
    } catch (error) {
      console.error('Error fetching devices by branch:', error);
      throw error;
    }
  }
  
  /**
   * Approve a device registration
   * @param {string} id - The device ID
   * @returns {Promise<Device>} Updated device
   */
  static async approve(id) {
    try {
      // Update device status to 'approved'
      return await Device.update(id, { status: 'approved', approvedAt: new Date() });
    } catch (error) {
      console.error('Error approving device:', error);
      throw error;
    }
  }
  
  /**
   * Reject a device registration
   * @param {string} id - The device ID
   * @returns {Promise<Device>} Updated device
   */
  static async reject(id) {
    try {
      // Update device status to 'rejected'
      return await Device.update(id, { status: 'rejected', rejectedAt: new Date() });
    } catch (error) {
      console.error('Error rejecting device:', error);
      throw error;
    }
  }
  
  /**
   * Remove a device
   * @param {string} id - The device ID
   * @returns {Promise<boolean>} Success status
   */
  static async remove(id) {
    try {
      // Alias for delete to maintain consistent API
      return await this.delete(id);
    } catch (error) {
      console.error('Error removing device:', error);
      throw error;
    }
  }
}

export default DeviceService;
