/**
 * Attendance Entity
 * Represents the data structure and operations for attendance records
 */
class Attendance {
  /**
   * Create a new Attendance instance
   * @param {Object} data - Attendance data
   * @param {string} data.id - Unique identifier for the attendance record
   * @param {string} data.staff_id - ID of the staff member
   * @param {string} data.branch_id - ID of the branch where attendance was recorded
   * @param {string} data.device_id - ID of the device used to record attendance
   * @param {Date} data.check_in_time - Check-in timestamp
   * @param {Date} data.check_out_time - Check-out timestamp (null if not checked out)
   * @param {string} data.check_in_photo - URL/base64 of check-in photo verification
   * @param {string} data.check_out_photo - URL/base64 of check-out photo verification
   * @param {string} data.status - Status of the attendance (e.g., "present", "late", "absent")
   * @param {Object} data.location - Geolocation coordinates
   * @param {string} data.notes - Additional notes
   */
  constructor(data) {
    this.id = data.id || crypto.randomUUID();
    this.staff_id = data.staff_id || data.user_id || '';
    this.branch_id = data.branch_id || '';
    this.device_id = data.device_id || '';
    this.check_in_time = data.check_in_time ? new Date(data.check_in_time) : null;
    this.check_out_time = data.check_out_time ? new Date(data.check_out_time) : null;
    this.check_in_photo = data.check_in_photo || data.check_in_photo_url || '';
    this.check_out_photo = data.check_out_photo || data.check_out_photo_url || '';
    this.check_in_location = data.check_in_location || { latitude: 0, longitude: 0 };
    this.check_out_location = data.check_out_location || null;
    this.status = data.status || 'present';
    this.notes = data.notes || '';
    this.is_verified = data.is_verified !== undefined ? data.is_verified : false;
    this.is_approved = data.is_approved !== undefined ? data.is_approved : false;
    this.verified_by = data.verified_by || null;
    this.verified_date = data.verified_date ? new Date(data.verified_date) : null;
    this.created_at = data.created_at || data.created_date ? new Date(data.created_at || data.created_date) : new Date();
    this.updated_at = data.updated_at || data.updated_date ? new Date(data.updated_at || data.updated_date) : new Date();
    
    // Enhanced geo-fencing properties
    this.is_within_geofence = data.is_within_geofence !== undefined ? data.is_within_geofence : false;
    this.distance_from_branch = data.distance_from_branch || null; // Distance in meters
    this.geofence_radius = data.geofence_radius || null; // Radius in meters
    this.location_verified = data.location_verified !== undefined ? data.location_verified : false;
    this.location_accuracy = data.location_accuracy || null;
  }

  /**
   * Get an attendance record by ID
   * @param {string} id - The attendance ID
   * @returns {Promise<Attendance|null>} - Returns a promise with attendance or null
   */
  static async getById(id) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const attendanceData = JSON.parse(localStorage.getItem('attendance') || '[]');
        const attendance = attendanceData.find(a => a.id === id);
        resolve(attendance ? new Attendance(attendance) : null);
      }, 300);
    });
  }

  /**
   * Get all attendance records
   * @returns {Promise<Attendance[]>} - Returns a promise with attendance array
   */
  static async getAll() {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const attendanceData = JSON.parse(localStorage.getItem('attendance') || '[]');
        resolve(attendanceData.map(data => new Attendance(data)));
      }, 300);
    });
  }

  /**
   * List attendance records with pagination
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @param {string} sort - Sort field and direction (e.g., '-created_at')
   * @returns {Promise<{data: Attendance[], total: number, page: number, limit: number}>} - Paginated result
   */
  static async list(page = 1, limit = 10, sort = '-created_at') {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        let attendanceData = JSON.parse(localStorage.getItem('attendance') || '[]');
        
        // If no data in localStorage, create sample data for demo
        if (attendanceData.length === 0) {
          attendanceData = Array.from({ length: 5 }, (_, i) => ({
            id: (i + 1).toString(),
            staff_id: '1',
            branch_id: '1',
            device_id: '1',
            check_in_time: new Date().toISOString(),
            check_out_time: i % 2 === 0 ? new Date().toISOString() : null,
            check_in_location: {
              latitude: 37.7749,
              longitude: -122.4194
            },
            check_out_location: i % 2 === 0 ? {
              latitude: 37.7749,
              longitude: -122.4194
            } : null,
            check_in_photo: 'https://via.placeholder.com/300',
            check_out_photo: i % 2 === 0 ? 'https://via.placeholder.com/300' : null,
            status: i % 3 === 0 ? 'late' : 'present',
            is_verified: i < 2,
            is_approved: i < 2,
            verified_by: i < 2 ? '2' : null,
            verified_date: i < 2 ? new Date().toISOString() : null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));
        }
        
        // Sort the data
        const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
        const sortOrder = sort.startsWith('-') ? -1 : 1;
        
        attendanceData.sort((a, b) => {
          if (a[sortField] < b[sortField]) return -1 * sortOrder;
          if (a[sortField] > b[sortField]) return 1 * sortOrder;
          return 0;
        });
        
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedData = attendanceData.slice(startIndex, endIndex);
        
        resolve({
          data: paginatedData.map(data => new Attendance(data)),
          total: attendanceData.length,
          page,
          limit
        });
      }, 300);
    });
  }

  /**
   * Create a new attendance record
   * @param {Object} data - Attendance data
   * @returns {Promise<Attendance>} - Created attendance
   */
  static async create(data) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const attendance = new Attendance(data);
        const attendanceData = JSON.parse(localStorage.getItem('attendance') || '[]');
        attendanceData.push(attendance);
        localStorage.setItem('attendance', JSON.stringify(attendanceData));
        resolve(attendance);
      }, 300);
    });
  }

  /**
   * Update an attendance record
   * @param {string} id - The attendance ID
   * @param {Object} data - The data to update
   * @returns {Promise<Attendance>} Updated attendance
   */
  static async update(id, data) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const attendanceData = JSON.parse(localStorage.getItem('attendance') || '[]');
        const index = attendanceData.findIndex(attendance => attendance.id === id);
        
        if (index === -1) {
          resolve(null);
          return;
        }
        
        // Update the attendance data
        const updatedAttendance = {
          ...attendanceData[index],
          ...data,
          updated_at: new Date()
        };
        
        attendanceData[index] = updatedAttendance;
        localStorage.setItem('attendance', JSON.stringify(attendanceData));
        
        resolve(new Attendance(updatedAttendance));
      }, 300);
    });
  }

  /**
   * Delete an attendance record
   * @param {string} id - The attendance ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id) {
    // This would call the API in a real implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        const attendanceData = JSON.parse(localStorage.getItem('attendance') || '[]');
        const filteredAttendance = attendanceData.filter(attendance => attendance.id !== id);
        
        if (filteredAttendance.length === attendanceData.length) {
          resolve(false);
          return;
        }
        
        localStorage.setItem('attendance', JSON.stringify(filteredAttendance));
        resolve(true);
      }, 300);
    });
  }
  
  /**
   * Filter attendance records based on criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Promise<Attendance[]>} - Returns a promise with filtered attendance array
   */
  static async filter(criteria) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let attendanceData = JSON.parse(localStorage.getItem('attendance') || '[]');
        
        if (criteria) {
          if (criteria.staff_id) {
            attendanceData = attendanceData.filter(a => a.staff_id === criteria.staff_id);
          }
          
          if (criteria.branch_id) {
            attendanceData = attendanceData.filter(a => a.branch_id === criteria.branch_id);
          }
          
          if (criteria.device_id) {
            attendanceData = attendanceData.filter(a => a.device_id === criteria.device_id);
          }
          
          if (criteria.status) {
            attendanceData = attendanceData.filter(a => a.status === criteria.status);
          }
          
          if (criteria.dateRange) {
            const { start, end } = criteria.dateRange;
            
            if (start) {
              const startDate = new Date(start);
              attendanceData = attendanceData.filter(a => {
                const checkInDate = a.check_in_time ? new Date(a.check_in_time) : null;
                return checkInDate && checkInDate >= startDate;
              });
            }
            
            if (end) {
              const endDate = new Date(end);
              attendanceData = attendanceData.filter(a => {
                const checkInDate = a.check_in_time ? new Date(a.check_in_time) : null;
                return checkInDate && checkInDate <= endDate;
              });
            }
          }
          
          if (criteria.is_within_geofence !== undefined) {
            attendanceData = attendanceData.filter(a => 
              a.is_within_geofence === criteria.is_within_geofence
            );
          }
        }
        
        resolve(attendanceData.map(data => new Attendance(data)));
      }, 300);
    });
  }
  
  /**
   * Get attendance records by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Attendance[]>} - Returns a promise with attendance array
   */
  static async getByDateRange(startDate, endDate) {
    return await this.filter({
      dateRange: { start: startDate, end: endDate }
    });
  }
  
  /**
   * Get today's attendance records
   * @returns {Promise<Attendance[]>} - Returns a promise with attendance array
   */
  static async getToday() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    return Attendance.getByDateRange(startOfDay, endOfDay);
  }
  
  /**
   * Verify an attendance record
   * @param {string} id - Attendance record ID
   * @param {string} verifiedBy - ID of staff who verified
   * @returns {Promise<Attendance>} - Updated attendance record
   */
  static async verify(id, verifiedBy) {
    return Attendance.update(id, {
      is_verified: true,
      verified_by: verifiedBy,
      verified_date: new Date()
    });
  }
  
  /**
   * Approve an attendance record
   * @param {string} id - Attendance record ID
   * @returns {Promise<Attendance>} - Updated attendance record
   */
  static async approve(id) {
    return Attendance.update(id, {
      is_approved: true
    });
  }
  
  /**
   * Check if the attendance record is complete (has both check-in and check-out)
   * @returns {Boolean} 
   */
  isComplete() {
    return Boolean(this.check_in_time && this.check_out_time);
  }

  /**
   * Get the duration of attendance in minutes
   * @returns {Number|null} Duration in minutes or null if incomplete
   */
  getDuration() {
    if (!this.isComplete()) return null;
    
    const checkIn = new Date(this.check_in_time);
    const checkOut = new Date(this.check_out_time);
    
    return Math.round((checkOut - checkIn) / (1000 * 60));
  }

  /**
   * Check if the geo-location for this attendance is valid and verified
   * @returns {Boolean}
   */
  isLocationVerified() {
    return this.location_verified && (
      (this.check_in_location && this.check_in_location.latitude && this.check_in_location.longitude) ||
      (this.check_out_location && this.check_out_location.latitude && this.check_out_location.longitude)
    );
  }

  /**
   * Format duration as a human-readable string (e.g., "8h 30m")
   * @returns {String|null} Formatted duration or null if incomplete
   */
  getFormattedDuration() {
    const minutes = this.getDuration();
    if (minutes === null) return null;
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) return `${remainingMinutes}m`;
    if (remainingMinutes === 0) return `${hours}h`;
    
    return `${hours}h ${remainingMinutes}m`;
  }

  /**
   * Get status of the check-in/out
   * @returns {String} Status text
   */
  getStatusText() {
    if (!this.check_in_time) return 'Not checked in';
    if (!this.check_out_time) return 'Checked in';
    return 'Completed';
  }

  /**
   * Get location verification status text
   * @returns {String} Location status text
   */
  getLocationStatusText() {
    if (!this.check_in_location) return 'No location data';
    if (!this.location_verified) return 'Unverified location';
    if (this.is_within_geofence) return 'Within geofence';
    return 'Outside geofence';
  }

  /**
   * Record check-in with location data
   * @param {Object} data - Check-in data
   * @param {Object} locationData - Location data {latitude, longitude, accuracy, isWithinGeofence, distance}
   * @returns {Promise<Attendance>} - Created attendance record
   */
  static async checkInWithLocation(data, locationData) {
    const now = new Date();
    return Attendance.create({
      ...data,
      check_in_time: now,
      status: 'present',
      check_in_location: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy
      },
      is_within_geofence: locationData.isWithinGeofence,
      distance_from_branch: locationData.distance,
      geofence_radius: locationData.radius,
      location_verified: locationData.isWithinGeofence,
      location_accuracy: locationData.accuracy
    });
  }
  
  /**
   * Record check-out with location data
   * @param {string} id - Attendance record ID
   * @param {Object} data - Check-out data
   * @param {Object} locationData - Location data {latitude, longitude, accuracy, isWithinGeofence, distance}
   * @returns {Promise<Attendance>} - Updated attendance record
   */
  static async checkOutWithLocation(id, data, locationData) {
    const now = new Date();
    return Attendance.update(id, {
      ...data,
      check_out_time: now,
      check_out_location: {
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        accuracy: locationData.accuracy
      },
      // Only update geofence status if it was previously false or not set
      ...((!data.is_within_geofence) ? {
        is_within_geofence: locationData.isWithinGeofence,
        distance_from_branch: locationData.distance,
        location_verified: locationData.isWithinGeofence
      } : {})
    });
  }
}

export default Attendance;
