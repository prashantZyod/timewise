/**
 * Branch Entity
 * Represents the data structure and operations for organization branches
 */
class Branch {
  /**
   * Create a new Branch instance
   * @param {Object} data - Branch data
   * @param {string} data.id - Unique identifier for the branch
   * @param {string} data.name - Branch name
   * @param {string} data.code - Branch code (short identifier)
   * @param {string} data.address - Physical address
   * @param {string} data.city - City
   * @param {string} data.manager - Name of branch manager
   * @param {string} data.managerPhone - Contact number for manager
   * @param {number} data.staffCount - Number of staff assigned to branch
   * @param {number} data.deviceCount - Number of devices assigned to branch
   * @param {number} data.latitude - Geographical latitude coordinate
   * @param {number} data.longitude - Geographical longitude coordinate
   * @param {number} data.radius - Geofencing radius in meters
   * @param {boolean} data.is_active - Whether the branch is active
   */
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.name = data.name || '';
    this.code = data.code || '';
    this.address = data.address || '';
    this.city = data.city || '';
    this.manager = data.manager || '';
    this.managerPhone = data.managerPhone || '';
    this.manager_email = data.manager_email || '';
    this.staffCount = data.staffCount || 0;
    this.deviceCount = data.deviceCount || 0;
    
    // Enhanced geo-fencing properties
    this.location = {
      latitude: data.latitude || (data.location ? data.location.latitude : 0),
      longitude: data.longitude || (data.location ? data.location.longitude : 0),
      radius: data.radius || (data.location ? data.location.radius : 250),
      address: data.address || (data.location ? data.location.address : ''),
      lastUpdated: data.location?.lastUpdated || new Date().toISOString()
    };
    
    // Legacy support for direct properties
    this.latitude = this.location.latitude;
    this.longitude = this.location.longitude;
    this.radius = this.location.radius;
    
    // Branch configuration for attendance
    this.attendance_settings = data.attendance_settings || {
      requireGeofencing: true,
      requirePhotoVerification: false, // Disable photo verification
      maxDistanceOutside: 50, // meters outside geofence that still allows check-in with warning
      checkInStartTime: '08:00',
      checkInEndTime: '10:00',
      checkOutStartTime: '16:00',
      checkOutEndTime: '18:00',
      allowWeekendCheckin: false,
      overrideHolidays: false
    };
    
    this.is_active = data.is_active !== undefined ? data.is_active : true;
    this.created_at = data.created_at || data.created_date ? new Date(data.created_at || data.created_date) : new Date();
    this.updated_at = data.updated_at || data.updated_date ? new Date(data.updated_at || data.updated_date) : new Date();
  }

  /**
   * Get a branch by ID
   * @param {string} id - The branch ID
   * @returns {Promise<Branch>} The branch object
   */
  static async getById(id) {
    // Mock implementation - in a real app, this would call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(new Branch({
          id,
          name: `Branch ${id}`,
          address: '123 Main Street, City',
          latitude: 37.7749,
          longitude: -122.4194,
          radius: 100,
          is_active: true,
          manager_email: 'manager@example.com',
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        }));
      }, 300);
    });
  }

  /**
   * Get all branch records
   * @param {string} sort - Sort field and direction (e.g., '-created_date')
   * @param {number} limit - Maximum number of records to return
   * @returns {Promise<Branch[]>} - Returns a promise with array of all branches
   */
  static async getAll(sort = 'name', limit = 50) {
    // Try to get branches from localStorage first
    try {
      const storedBranches = localStorage.getItem('branches');
      if (storedBranches) {
        const parsedBranches = JSON.parse(storedBranches);
        return parsedBranches.map(branchData => new Branch(branchData));
      }
    } catch (error) {
      console.error('Error retrieving branches from localStorage:', error);
    }
    
    // Fallback to mock data if localStorage fails or is empty
    return new Promise((resolve) => {
      setTimeout(() => {
        const sampleBranches = [
          {
            id: "1",
            name: "Downtown Branch",
            code: "DT01",
            address: "123 Main Street, Downtown",
            city: "Metropolis",
            manager: "John Smith",
            managerPhone: "+1-555-123-4567",
            manager_email: "john.smith@timewise.com",
            staffCount: 15,
            deviceCount: 8,
            latitude: 37.7749,
            longitude: -122.4194,
            radius: 100,
            is_active: true,
            attendance_settings: {
              requireGeofencing: true,
              requirePhotoVerification: true,
              maxDistanceOutside: 500,
              checkInStartTime: '08:00',
              checkInEndTime: '10:00',
              checkOutStartTime: '16:00',
              checkOutEndTime: '18:00'
            }
          },
          {
            id: "2",
            name: "Uptown Office",
            code: "UT02",
            address: "456 Park Avenue, Uptown",
            city: "Metropolis",
            manager: "Sarah Johnson",
            managerPhone: "+1-555-987-6543",
            manager_email: "sarah.johnson@timewise.com",
            staffCount: 12,
            deviceCount: 6,
            latitude: 37.7848,
            longitude: -122.4294,
            radius: 150,
            is_active: true,
            attendance_settings: {
              requireGeofencing: true,
              requirePhotoVerification: false,
              maxDistanceOutside: 300,
              checkInStartTime: '09:00',
              checkInEndTime: '11:00',
              checkOutStartTime: '17:00',
              checkOutEndTime: '19:00'
            }
          },
          {
            id: "3",
            name: "Westside Hub",
            code: "WS03",
            address: "789 Ocean Drive, Westside",
            city: "Metropolis",
            manager: "David Lee",
            managerPhone: "+1-555-456-7890",
            manager_email: "david.lee@timewise.com",
            staffCount: 8,
            deviceCount: 4,
            latitude: 37.7649,
            longitude: -122.4394,
            radius: 120,
            is_active: true,
            attendance_settings: {
              requireGeofencing: true,
              requirePhotoVerification: true,
              maxDistanceOutside: 400,
              checkInStartTime: '08:30',
              checkInEndTime: '10:30',
              checkOutStartTime: '16:30',
              checkOutEndTime: '18:30'
            }
          }
        ];
        
        const branches = sampleBranches.map(data => new Branch(data));
        resolve(branches);
      }, 300);
    });
  }
  
  /**
   * List all branches (alias for getAll for backward compatibility)
   * @param {string} sort - Sort field and direction (e.g., '-created_date')
   * @param {number} limit - Maximum number of records to return
   * @returns {Promise<Branch[]>} List of branch objects
   */
  static async list(sort = 'name', limit = 50) {
    return this.getAll(sort, limit);
  }

  /**
   * Create a new branch record
   * @param {Object} data - Branch data
   * @returns {Promise<Branch>} - Returns a promise with the created branch
   */
  static async create(data) {
    // Mock implementation - in a real app, this would call an API
    return new Promise((resolve) => {
      setTimeout(() => {
        const branch = new Branch({
          id: Math.floor(Math.random() * 1000).toString(),
          ...data,
          created_date: new Date().toISOString(),
          updated_date: new Date().toISOString()
        });
        
        // Simulate API call with localStorage for demo
        const existingBranches = JSON.parse(localStorage.getItem('branches') || '[]');
        existingBranches.push(branch);
        localStorage.setItem('branches', JSON.stringify(existingBranches));
        
        resolve(branch);
      }, 300);
    });
  }

  /**
   * Update an existing branch
   * @param {string} id - The branch ID
   * @param {Object} data - Updated branch data
   * @returns {Promise<Branch|null>} The updated branch or null if not found
   */
  static async update(id, data) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const branchData = JSON.parse(localStorage.getItem('branches') || '[]');
        const index = branchData.findIndex(branch => branch.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        const updatedBranch = { 
          ...branchData[index], 
          ...data,
          updated_at: new Date().toISOString()
        };
        
        branchData[index] = updatedBranch;
        localStorage.setItem('branches', JSON.stringify(branchData));
        
        resolve(new Branch(updatedBranch));
      }, 300);
    });
  }

  /**
   * Delete a branch
   * @param {string} id - The branch ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const branchData = JSON.parse(localStorage.getItem('branches') || '[]');
        const filteredBranches = branchData.filter(branch => branch.id !== id);
        
        if (filteredBranches.length === branchData.length) {
          resolve(false);
          return;
        }
        
        localStorage.setItem('branches', JSON.stringify(filteredBranches));
        resolve(true);
      }, 300);
    });
  }
  
  /**
   * Filter branch records based on criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Promise<Branch[]>} - Returns a promise with filtered branch array
   */
  static async filter(criteria) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const branchData = JSON.parse(localStorage.getItem('branches') || '[]');
        
        const filtered = branchData.filter(branch => {
          return Object.entries(criteria).every(([key, value]) => {
            // Handle string case-insensitive search
            if (typeof value === 'string' && typeof branch[key] === 'string') {
              return branch[key].toLowerCase().includes(value.toLowerCase());
            }
            // Handle exact match
            return branch[key] === value;
          });
        });
        
        resolve(filtered.map(data => new Branch(data)));
      }, 300);
    });
  }
  
  /**
   * Get staff assigned to a branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Array>} - Returns a promise with staff array
   */
  static async getStaff(branchId) {
    // In a real implementation, this would use the Staff entity
    // and filter by branch_id
    return new Promise((resolve) => {
      setTimeout(() => {
        const staffData = JSON.parse(localStorage.getItem('staff') || '[]');
        resolve(staffData.filter(staff => staff.branch_id === branchId));
      }, 300);
    });
  }

  /**
   * Get devices assigned to a branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Array>} - Returns a promise with devices array
   */
  static async getDevices(branchId) {
    // In a real implementation, this would use the Device entity
    // and filter by branch_id
    return new Promise((resolve) => {
      setTimeout(() => {
        const deviceData = JSON.parse(localStorage.getItem('devices') || '[]');
        resolve(deviceData.filter(device => device.branch_id === branchId));
      }, 300);
    });
  }

  /**
   * Check if coordinates are within this branch's geofence
   * @param {Object} coordinates - The coordinates to check {latitude, longitude}
   * @returns {Object} Result with isWithin flag, distance and radius
   */
  isWithinGeofence(coordinates) {
    if (!coordinates || !coordinates.latitude || !coordinates.longitude) {
      return { isWithin: false, distance: null, radius: this.location.radius };
    }

    // Calculate distance using Haversine formula
    const R = 6371e3; // Earth radius in meters
    const φ1 = coordinates.latitude * Math.PI/180;
    const φ2 = this.location.latitude * Math.PI/180;
    const Δφ = (this.location.latitude - coordinates.latitude) * Math.PI/180;
    const Δλ = (this.location.longitude - coordinates.longitude) * Math.PI/180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    const distance = R * c; // distance in meters
    
    return {
      isWithin: distance <= this.location.radius,
      distance,
      radius: this.location.radius
    };
  }

  /**
   * Get formatted location string
   * @returns {String} Formatted location
   */
  getFormattedLocation() {
    if (!this.location.latitude || !this.location.longitude) {
      return 'No location set';
    }
    
    return `${this.location.latitude.toFixed(6)}, ${this.location.longitude.toFixed(6)}`;
  }

  /**
   * Check if a staff member can check in at this branch right now
   * @param {Date} time - The time to check (defaults to now)
   * @returns {Object} Result with canCheckIn flag and reason
   */
  canCheckInNow(time = new Date()) {
    const settings = this.attendance_settings;
    const day = time.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Check if weekends are allowed
    if ((day === 0 || day === 6) && !settings.allowWeekendCheckin) {
      return { canCheckIn: false, reason: 'Check-ins not allowed on weekends' };
    }
    
    // Check time restrictions
    const timeStr = time.toTimeString().substring(0, 5); // Get HH:MM
    
    if (timeStr < settings.checkInStartTime || timeStr > settings.checkInEndTime) {
      return { 
        canCheckIn: false, 
        reason: `Check-in only allowed between ${settings.checkInStartTime} and ${settings.checkInEndTime}` 
      };
    }
    
    return { canCheckIn: true };
  }

  /**
   * Check if a staff member can check out at this branch right now
   * @param {Date} time - The time to check (defaults to now)
   * @returns {Object} Result with canCheckOut flag and reason
   */
  canCheckOutNow(time = new Date()) {
    const settings = this.attendance_settings;
    const day = time.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Check if weekends are allowed
    if ((day === 0 || day === 6) && !settings.allowWeekendCheckin) {
      return { canCheckOut: false, reason: 'Check-outs not allowed on weekends' };
    }
    
    // Check time restrictions
    const timeStr = time.toTimeString().substring(0, 5); // Get HH:MM
    
    if (timeStr < settings.checkOutStartTime || timeStr > settings.checkOutEndTime) {
      return { 
        canCheckOut: false, 
        reason: `Check-out only allowed between ${settings.checkOutStartTime} and ${settings.checkOutEndTime}` 
      };
    }
    
    return { canCheckOut: true };
  }
  
  /**
   * Update branch location
   * @param {Object} locationData - New location data
   * @returns {Promise<Branch>} Updated branch
   */
  static async updateLocation(id, locationData) {
    return Branch.update(id, {
      location: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        radius: locationData.radius || 100,
        address: locationData.address || '',
        lastUpdated: new Date().toISOString()
      }
    });
  }

  /**
   * Save all branches to localStorage
   * @param {Branch[]} branches - Array of branches to save
   * @returns {Promise<boolean>} Success status
   */
  static async saveAllToLocalStorage(branches) {
    try {
      localStorage.setItem('branches', JSON.stringify(branches));
      return true;
    } catch (error) {
      console.error('Error saving branches to localStorage:', error);
      return false;
    }
  }
}

export default Branch;
