/**
 * Staff Entity
 * Represents the data structure and operations for staff members
 */
class Staff {
  /**
   * Create a new Staff instance
   * @param {Object} data - Staff data
   * @param {string} data.id - Unique identifier for the staff
   * @param {string} data.name - Full name of the staff member
   * @param {string} data.email - Email address
   * @param {string} data.position - Job position/title
   * @param {string} data.branch_id - ID of the branch they work at
   * @param {string} data.status - Status (active, inactive)
   * @param {string} data.phone - Phone number
   * @param {string} data.photo_url - URL to profile photo
   * @param {Date} data.joined_date - Date when joined the organization
   */
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || '';
    this.email = data.email || '';
    this.position = data.position || '';
    this.branch_id = data.branch_id || '';
    this.status = data.status || 'active';
    this.phone = data.phone || '';
    this.photo_url = data.photo_url || '';
    this.joined_date = data.joined_date ? new Date(data.joined_date) : new Date();
    this.created_at = data.created_at ? new Date(data.created_at) : new Date();
    this.updated_at = data.updated_at ? new Date(data.updated_at) : new Date();
  }

  /**
   * Create a new staff record
   * @param {Object} data - Staff data
   * @returns {Promise<Staff>} - Returns a promise with the created staff
   */
  static async create(data) {
    // This would call the API in a real implementation
    const staff = new Staff(data);
    
    // Simulate API call with localStorage for demo
    const existingStaff = JSON.parse(localStorage.getItem('staff') || '[]');
    existingStaff.push(staff);
    localStorage.setItem('staff', JSON.stringify(existingStaff));
    
    return staff;
  }

  /**
   * Get all staff records
   * @returns {Promise<Staff[]>} - Returns a promise with array of all staff
   */
  static async getAll() {
    // This would call the API in a real implementation
    const staffData = JSON.parse(localStorage.getItem('staff') || '[]');
    return staffData.map(data => new Staff(data));
  }

  /**
   * Get staff by ID
   * @param {string} id - Staff ID
   * @returns {Promise<Staff|null>} - Returns a promise with staff or null if not found
   */
  static async getById(id) {
    // This would call the API in a real implementation
    const staffData = JSON.parse(localStorage.getItem('staff') || '[]');
    const foundStaff = staffData.find(staff => staff.id === id);
    return foundStaff ? new Staff(foundStaff) : null;
  }

  /**
   * Update a staff record
   * @param {string} id - Staff ID
   * @param {Object} data - Updated staff data
   * @returns {Promise<Staff|null>} - Returns a promise with updated staff or null if not found
   */
  static async update(id, data) {
    // This would call the API in a real implementation
    const staffData = JSON.parse(localStorage.getItem('staff') || '[]');
    const index = staffData.findIndex(staff => staff.id === id);
    
    if (index === -1) return null;
    
    const updatedStaff = { 
      ...staffData[index], 
      ...data,
      updated_at: new Date().toISOString()
    };
    
    staffData[index] = updatedStaff;
    localStorage.setItem('staff', JSON.stringify(staffData));
    
    return new Staff(updatedStaff);
  }

  /**
   * Delete a staff record
   * @param {string} id - Staff ID
   * @returns {Promise<boolean>} - Returns a promise with true if deleted, false if not found
   */
  static async delete(id) {
    // This would call the API in a real implementation
    const staffData = JSON.parse(localStorage.getItem('staff') || '[]');
    const filteredStaff = staffData.filter(staff => staff.id !== id);
    
    if (filteredStaff.length === staffData.length) return false;
    
    localStorage.setItem('staff', JSON.stringify(filteredStaff));
    return true;
  }

  /**
   * Filter staff records based on criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Promise<Staff[]>} - Returns a promise with filtered staff array
   */
  static async filter(criteria) {
    // This would call the API in a real implementation
    const staffData = JSON.parse(localStorage.getItem('staff') || '[]');
    
    const filtered = staffData.filter(staff => {
      return Object.entries(criteria).every(([key, value]) => {
        // Handle string case-insensitive search
        if (typeof value === 'string' && typeof staff[key] === 'string') {
          return staff[key].toLowerCase().includes(value.toLowerCase());
        }
        // Handle exact match
        return staff[key] === value;
      });
    });
    
    return filtered.map(data => new Staff(data));
  }
}

export default Staff;
