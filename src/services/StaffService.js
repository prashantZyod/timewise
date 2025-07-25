/**
 * Staff Service
 * Handles API communication for staff-related operations
 */
import api from './api';

class StaffService {
  /**
   * Base API endpoint for staff operations
   * @type {string}
   */
  static baseUrl = '/staff';

  /**
   * Get a staff member by ID
   * @param {string} id - The staff ID
   * @returns {Promise<Object|null>} - Returns a promise with staff or null
   */
  static async getById(id) {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  }

  /**
   * Get all staff
   * @returns {Promise<Staff[]>} - Returns a promise with staff array
   */
  static async getAll() {
    try {
      // In a real implementation, this would make an API call
      return await Staff.getAll();
    } catch (error) {
      console.error('Error fetching all staff:', error);
      throw error;
    }
  }

  /**
   * List staff with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<{data: Staff[], total: number, page: number, limit: number}>} - Paginated result
   */
  static async list(page = 1, limit = 10) {
    try {
      // In a real implementation, this would make an API call
      return await Staff.list(page, limit);
    } catch (error) {
      console.error('Error listing staff:', error);
      throw error;
    }
  }

  /**
   * Create a new staff member
   * @param {Object} data - Staff data
   * @returns {Promise<Staff>} - Created staff
   */
  static async create(data) {
    try {
      // In a real implementation, this would make an API call
      return await Staff.create(data);
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  }

  /**
   * Update a staff member
   * @param {string} id - The staff ID
   * @param {Object} data - The data to update
   * @returns {Promise<Staff>} Updated staff
   */
  static async update(id, data) {
    try {
      // In a real implementation, this would make an API call
      return await Staff.update(id, data);
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  }

  /**
   * Delete a staff member
   * @param {string} id - The staff ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    try {
      // In a real implementation, this would make an API call
      return await Staff.delete(id);
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  }
  
  /**
   * Filter staff based on criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Promise<Staff[]>} - Returns a promise with filtered staff array
   */
  static async filter(criteria) {
    try {
      // In a real implementation, this would make an API call
      return await Staff.filter(criteria);
    } catch (error) {
      console.error('Error filtering staff:', error);
      throw error;
    }
  }
  
  /**
   * Get staff by branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Staff[]>} - Returns a promise with staff array
   */
  static async getByBranch(branchId) {
    try {
      return await this.filter({ branch_id: branchId });
    } catch (error) {
      console.error('Error fetching staff by branch:', error);
      throw error;
    }
  }
}

export default StaffService;
