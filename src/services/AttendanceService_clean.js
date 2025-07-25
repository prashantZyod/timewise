/**
 * Attendance Service
 * Handles API communication for attendance-related operations
 */
import api from './api';

class AttendanceService {
  /**
   * Base API endpoint for attendance operations
   * @type {string}
   */
  static baseUrl = '/attendance';

  /**
   * Get an attendance record by ID
   * @param {string} id - The attendance ID
   * @returns {Promise<Object|null>} - Returns a promise with attendance or null
   */
  static async getById(id) {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  }

  /**
   * Get all attendance records
   * @returns {Promise<Object[]>} - Returns a promise with attendance array
   */
  static async getAll() {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching all attendance records:', error);
      throw error;
    }
  }

  /**
   * List attendance records with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} sort - Sort field and direction (e.g., '-created_at')
   * @returns {Promise<{data: Object[], total: number, page: number, limit: number}>} - Paginated result
   */
  static async list(page = 1, limit = 10, sort = '-created_at') {
    try {
      const response = await api.get(`${this.baseUrl}?page=${page}&limit=${limit}&sort=${sort}`);
      return response.data;
    } catch (error) {
      console.error('Error listing attendance records:', error);
      throw error;
    }
  }

  /**
   * Staff check-in
   * @param {Object} data - Check-in data
   * @param {string} data.staffId - Staff ID
   * @param {string} data.branchId - Branch ID  
   * @param {Object} data.location - Location coordinates
   * @param {number} data.location.latitude - Latitude
   * @param {number} data.location.longitude - Longitude
   * @returns {Promise<Object>} - Check-in result
   */
  static async checkIn(data) {
    try {
      const response = await api.post(`${this.baseUrl}/check-in`, data);
      return response.data;
    } catch (error) {
      console.error('Error during check-in:', error);
      throw error;
    }
  }

  /**
   * Staff check-out
   * @param {Object} data - Check-out data
   * @param {string} data.staffId - Staff ID
   * @param {Object} data.location - Location coordinates
   * @param {number} data.location.latitude - Latitude
   * @param {number} data.location.longitude - Longitude
   * @returns {Promise<Object>} - Check-out result
   */
  static async checkOut(data) {
    try {
      const response = await api.post(`${this.baseUrl}/check-out`, data);
      return response.data;
    } catch (error) {
      console.error('Error during check-out:', error);
      throw error;
    }
  }

  /**
   * Update location tracking
   * @param {Object} data - Location data
   * @param {string} data.staffId - Staff ID
   * @param {Object} data.location - Location coordinates
   * @returns {Promise<Object>} - Update result
   */
  static async updateLocation(data) {
    try {
      const response = await api.post(`${this.baseUrl}/update-location`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  }

  /**
   * Create a new attendance record
   * @param {Object} data - Attendance data
   * @returns {Promise<Object>} - Created attendance
   */
  static async create(data) {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating attendance record:', error);
      throw error;
    }
  }

  /**
   * Update an attendance record
   * @param {string} id - The attendance ID
   * @param {Object} data - The data to update
   * @returns {Promise<Object>} Updated attendance
   */
  static async update(id, data) {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating attendance record:', error);
      throw error;
    }
  }

  /**
   * Delete an attendance record
   * @param {string} id - The attendance ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      throw error;
    }
  }

  /**
   * Filter attendance records based on criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Promise<Object[]>} - Returns a promise with filtered attendance array
   */
  static async filter(criteria) {
    try {
      const params = new URLSearchParams(criteria).toString();
      const response = await api.get(`${this.baseUrl}/filter?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering attendance records:', error);
      throw error;
    }
  }

  /**
   * Get attendance reports
   * @param {Object} params - Report parameters
   * @returns {Promise<Object>} - Report data
   */
  static async getReports(params) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await api.get(`${this.baseUrl}/reports?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance reports:', error);
      throw error;
    }
  }

  /**
   * Get today's attendance records
   * @returns {Promise<Object[]>} - Today's attendance
   */
  static async getTodayRecords() {
    try {
      const response = await api.get(`${this.baseUrl}/today`);
      return response.data;
    } catch (error) {
      console.error('Error fetching today\'s records:', error);
      throw error;
    }
  }
}

export default AttendanceService;
