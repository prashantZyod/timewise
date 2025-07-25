/**
 * Branch Service
 * Handles API communication for branch-related operations
 */
import Branch from '../entities/Branch';
import api, { branchAPI } from './api';

class BranchService {
  /**
   * Base API endpoint for branch operations
   * @type {string}
   */
  static baseUrl = '/api/branches';

  /**
   * Get a branch by ID
   * @param {string} id - The branch ID
   * @returns {Promise<Branch|null>} - Returns a promise with branch or null
   */
  static async getById(id) {
    try {
      // First try to get from API
      try {
        const response = await branchAPI.getBranchById(id);
        if (response.data) {
          return new Branch(response.data);
        }
      } catch (apiError) {
        console.warn('API call failed, falling back to local storage:', apiError);
        // Fall back to localStorage if API fails
        return await Branch.getById(id);
      }
    } catch (error) {
      console.error('Error fetching branch:', error);
      throw error;
    }
  }

  /**
   * Get all branches
   * @returns {Promise<Branch[]>} - Returns a promise with branch array
   */
  static async getAll() {
    try {
      // First try to get from API
      try {
        const response = await branchAPI.getAllBranches();
        if (response.data) {
          const branches = response.data.map(branchData => new Branch(branchData));
          // Update local storage for offline use
          await Branch.saveAllToLocalStorage(branches);
          return branches;
        }
      } catch (apiError) {
        console.warn('API call failed, falling back to local storage:', apiError);
        // Fall back to localStorage if API fails
        return await Branch.getAll();
      }
    } catch (error) {
      console.error('Error fetching all branches:', error);
      throw error;
    }
  }

  /**
   * List branches with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise<{data: Branch[], total: number, page: number, limit: number}>} - Paginated result
   */
  static async list(page = 1, limit = 10) {
    try {
      // Try to get from API with pagination
      try {
        const response = await api.get(`${this.baseUrl}?page=${page}&limit=${limit}`);
        if (response.data) {
          const branches = response.data.data.map(branchData => new Branch(branchData));
          return {
            data: branches,
            total: response.data.total,
            page: response.data.page,
            limit: response.data.limit
          };
        }
      } catch (apiError) {
        console.warn('API call failed, falling back to local storage:', apiError);
        // Fall back to localStorage if API fails
        return await Branch.list(page, limit);
      }
    } catch (error) {
      console.error('Error listing branches:', error);
      throw error;
    }
  }

  /**
   * Create a new branch
   * @param {Object} data - Branch data
   * @returns {Promise<Branch>} - Created branch
   */
  static async create(data) {
    try {
      // First try to create via API
      try {
        const response = await branchAPI.createBranch(data);
        if (response.data) {
          return new Branch(response.data);
        }
      } catch (apiError) {
        console.warn('API call failed, falling back to local storage:', apiError);
        // Fall back to localStorage if API fails
        return await Branch.create(data);
      }
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }

  /**
   * Update a branch
   * @param {string} id - The branch ID
   * @param {Object} data - The data to update
   * @returns {Promise<Branch>} Updated branch
   */
  static async update(id, data) {
    try {
      // First try to update via API
      try {
        const response = await branchAPI.updateBranch(id, data);
        if (response.data) {
          return new Branch(response.data);
        }
      } catch (apiError) {
        console.warn('API call failed, falling back to local storage:', apiError);
        // Fall back to localStorage if API fails
        return await Branch.update(id, data);
      }
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
      // First try to delete via API
      try {
        const response = await branchAPI.deleteBranch(id);
        if (response.status === 200) {
          // Also remove from local storage if exists
          try {
            await Branch.delete(id);
          } catch (localError) {
            console.warn('Local delete failed but API delete succeeded:', localError);
          }
          return true;
        }
      } catch (apiError) {
        console.warn('API call failed, falling back to local storage:', apiError);
        // Fall back to localStorage if API fails
        return await Branch.delete(id);
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      throw error;
    }
  }
  
  /**
   * Filter branches based on criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Promise<Branch[]>} - Returns a promise with filtered branch array
   */
  static async filter(criteria) {
    try {
      // Try to filter via API
      try {
        // Convert criteria to query params
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(criteria)) {
          queryParams.append(key, value);
        }
        
        const response = await api.get(`${this.baseUrl}/filter?${queryParams.toString()}`);
        if (response.data) {
          return response.data.map(branchData => new Branch(branchData));
        }
      } catch (apiError) {
        console.warn('API call failed, falling back to local storage:', apiError);
        // Fall back to localStorage if API fails
        return await Branch.filter(criteria);
      }
    } catch (error) {
      console.error('Error filtering branches:', error);
      throw error;
    }
  }
  
  /**
   * Get staff assigned to a branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Array>} - Returns a promise with staff array
   */
  static async getStaff(branchId) {
    try {
      return await Branch.getStaff(branchId);
    } catch (error) {
      console.error('Error fetching staff for branch:', error);
      throw error;
    }
  }

  /**
   * Get devices assigned to a branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Array>} - Returns a promise with devices array
   */
  static async getDevices(branchId) {
    try {
      return await Branch.getDevices(branchId);
    } catch (error) {
      console.error('Error fetching devices for branch:', error);
      throw error;
    }
  }
}

export default BranchService;
