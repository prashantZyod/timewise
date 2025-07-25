/**
 * Branch Service
 * Handles API communication for branch-related operations
 */
import api from './api';

class BranchService {
  /**
   * Base API endpoint for branch operations
   * @type {string}
   */
  static baseUrl = '/branches';

  /**
   * Get a branch by ID
   * @param {string} id - The branch ID
   * @returns {Promise<Object|null>} - Returns a promise with branch or null
   */
  static async getById(id) {
    try {
      const response = await api.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch:', error);
      throw error;
    }
  }

  /**
   * Get all branches
   * @returns {Promise<Object[]>} - Returns a promise with branch array
   */
  static async getAll() {
    try {
      const response = await api.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error('Error fetching all branches:', error);
      throw error;
    }
  }

  /**
   * List branches with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<{data: Object[], total: number, page: number, limit: number}>} - Paginated result
   */
  static async list(page = 1, limit = 10) {
    try {
      const response = await api.get(`${this.baseUrl}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error listing branches:', error);
      throw error;
    }
  }

  /**
   * Create a new branch
   * @param {Object} data - Branch data
   * @returns {Promise<Object>} - Created branch
   */
  static async create(data) {
    try {
      const response = await api.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  /**
   * Update a branch
   * @param {string} id - The branch ID
   * @param {Object} data - The data to update
   * @returns {Promise<Object>} Updated branch
   */
  static async update(id, data) {
    try {
      const response = await api.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating branch:', error);
      throw error;
    }
  }

  /**
   * Delete a branch
   * @param {string} id - The branch ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    try {
      await api.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  }

  /**
   * Filter branches by criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Promise<Object[]>} - Filtered branches
   */
  static async filter(criteria) {
    try {
      const params = new URLSearchParams(criteria).toString();
      const response = await api.get(`${this.baseUrl}/filter?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error filtering branches:', error);
      throw error;
    }
  }

  /**
   * Get staff for a specific branch
   * @param {string} branchId - The branch ID
   * @returns {Promise<Object[]>} - Staff array
   */
  static async getStaff(branchId) {
    try {
      const response = await api.get(`${this.baseUrl}/${branchId}/staff`);
      return response.data;
    } catch (error) {
      console.error('Error fetching branch staff:', error);
      throw error;
    }
  }
}

export default BranchService;
