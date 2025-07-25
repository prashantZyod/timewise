/**
 * Attendance Service
 * Handles API communication for attendance-related operations
 */
import Attendance from '../entities/Attendance';

class AttendanceService {
  /**
   * Base API endpoint for attendance operations
   * @type {string}
   */
  static baseUrl = '/api/attendance';

  /**
   * Get an attendance record by ID
   * @param {string} id - The attendance ID
   * @returns {Promise<Attendance|null>} - Returns a promise with attendance or null
   */
  static async getById(id) {
    try {
      // In a real implementation, this would make an API call
      // For now, we'll use the entity's localStorage implementation
      return await Attendance.getById(id);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  }

  /**
   * Get all attendance records
   * @returns {Promise<Attendance[]>} - Returns a promise with attendance array
   */
  static async getAll() {
    try {
      // In a real implementation, this would make an API call
      return await Attendance.getAll();
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
   * @returns {Promise<{data: Attendance[], total: number, page: number, limit: number}>} - Paginated result
   */
  static async list(page = 1, limit = 10, sort = '-created_at') {
    try {
      // In a real implementation, this would make an API call
      return await Attendance.list(page, limit, sort);
    } catch (error) {
      console.error('Error listing attendance records:', error);
      throw error;
    }
  }

  /**
   * Create a new attendance record
   * @param {Object} data - Attendance data
   * @returns {Promise<Attendance>} - Created attendance
   */
  static async create(data) {
    try {
      // In a real implementation, this would make an API call
      return await Attendance.create(data);
    } catch (error) {
      console.error('Error creating attendance record:', error);
      throw error;
    }
  }

  /**
   * Update an attendance record
   * @param {string} id - The attendance ID
   * @param {Object} data - The data to update
   * @returns {Promise<Attendance>} Updated attendance
   */
  static async update(id, data) {
    try {
      // In a real implementation, this would make an API call
      return await Attendance.update(id, data);
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
      // In a real implementation, this would make an API call
      return await Attendance.delete(id);
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      throw error;
    }
  }
  
  /**
   * Filter attendance records based on criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Promise<Attendance[]>} - Returns a promise with filtered attendance array
   */
  static async filter(criteria) {
    try {
      // In a real implementation, this would make an API call
      return await Attendance.filter(criteria);
    } catch (error) {
      console.error('Error filtering attendance records:', error);
      throw error;
    }
  }
  
  /**
   * Record check-in
   * @param {Object} data - Check-in data
   * @returns {Promise<Attendance>} - Created attendance record
   */
  static async checkIn(data) {
    try {
      return await Attendance.checkIn(data);
    } catch (error) {
      console.error('Error recording check-in:', error);
      throw error;
    }
  }
  
  /**
   * Record check-out for an existing attendance record
   * @param {string} id - Attendance record ID
   * @param {Object} data - Check-out data
   * @returns {Promise<Attendance>} - Updated attendance record
   */
  static async checkOut(id, data) {
    try {
      return await Attendance.checkOut(id, data);
    } catch (error) {
      console.error('Error recording check-out:', error);
      throw error;
    }
  }
  
  /**
   * Get attendance records by staff member
   * @param {string} staffId - Staff ID
   * @returns {Promise<Attendance[]>} - Returns a promise with attendance array
   */
  static async getByStaff(staffId) {
    try {
      return await Attendance.getByStaff(staffId);
    } catch (error) {
      console.error('Error fetching attendance by staff:', error);
      throw error;
    }
  }
  
  /**
   * Get attendance records by branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Attendance[]>} - Returns a promise with attendance array
   */
  static async getByBranch(branchId) {
    try {
      return await Attendance.getByBranch(branchId);
    } catch (error) {
      console.error('Error fetching attendance by branch:', error);
      throw error;
    }
  }
  
  /**
   * Get attendance records by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Attendance[]>} - Returns a promise with attendance array
   */
  static async getByDateRange(startDate, endDate) {
    try {
      return await Attendance.getByDateRange(startDate, endDate);
    } catch (error) {
      console.error('Error fetching attendance by date range:', error);
      throw error;
    }
  }
  
  /**
   * Get today's attendance records
   * @returns {Promise<Attendance[]>} - Returns a promise with attendance array
   */
  static async getToday() {
    try {
      return await Attendance.getToday();
    } catch (error) {
      console.error('Error fetching today\'s attendance:', error);
      throw error;
    }
  }
  
  /**
   * Verify an attendance record
   * @param {string} id - Attendance record ID
   * @param {string} verifiedBy - ID of staff who verified
   * @returns {Promise<Attendance>} - Updated attendance record
   */
  static async verify(id, verifiedBy) {
    try {
      return await Attendance.verify(id, verifiedBy);
    } catch (error) {
      console.error('Error verifying attendance:', error);
      throw error;
    }
  }
  
  /**
   * Approve an attendance record
   * @param {string} id - Attendance record ID
   * @returns {Promise<Attendance>} - Updated attendance record
   */
  static async approve(id) {
    try {
      return await Attendance.approve(id);
    } catch (error) {
      console.error('Error approving attendance:', error);
      throw error;
    }
  }

  /**
   * Check if a user is already checked in but not checked out
   * @param {string} staffId - Staff ID to check
   * @returns {Promise<Attendance|null>} - Active attendance record or null
   */
  static async getActiveAttendance(staffId) {
    try {
      // Get today's attendance records for this staff member
      const todayRecords = await Attendance.filter({ 
        staff_id: staffId,
        dateRange: {
          start: new Date(new Date().setHours(0, 0, 0, 0)),
          end: new Date(new Date().setHours(23, 59, 59, 999))
        }
      });
      
      // Find records where staff is checked in but not checked out
      const activeRecord = todayRecords.find(record => 
        record.check_in_time && !record.check_out_time
      );
      
      return activeRecord || null;
    } catch (error) {
      console.error('Error getting active attendance:', error);
      throw error;
    }
  }
  
  /**
   * Check in a staff member with location verification
   * @param {Object} checkInData - Check-in data
   * @param {string} checkInData.staff_id - Staff ID
   * @param {string} checkInData.branch_id - Branch ID
   * @param {string} checkInData.device_id - Device ID
   * @param {Object} locationData - Location data
   * @returns {Promise<Attendance>} - Created attendance record
   */
  static async checkInWithLocation(checkInData, locationData) {
    try {
      // First check if staff is already checked in
      const activeAttendance = await this.getActiveAttendance(checkInData.staff_id);
      if (activeAttendance) {
        throw new Error('You are already checked in. Please check out first.');
      }
      
      // Proceed with check-in
      return await Attendance.checkInWithLocation(checkInData, locationData);
    } catch (error) {
      console.error('Error checking in:', error);
      throw error;
    }
  }
  
  /**
   * Check out a staff member with location verification
   * @param {string} attendanceId - Attendance record ID
   * @param {Object} checkOutData - Additional check-out data
   * @param {Object} locationData - Location data
   * @returns {Promise<Attendance>} - Updated attendance record
   */
  static async checkOutWithLocation(attendanceId, checkOutData = {}, locationData) {
    try {
      // Get the attendance record
      const attendance = await Attendance.getById(attendanceId);
      if (!attendance) {
        throw new Error('Attendance record not found');
      }
      
      // Verify that check-in exists
      if (!attendance.check_in_time) {
        throw new Error('Cannot check out: No check-in record found');
      }
      
      // Verify that check-out doesn't already exist
      if (attendance.check_out_time) {
        throw new Error('Already checked out for this session');
      }
      
      // Proceed with check-out
      return await Attendance.checkOutWithLocation(
        attendanceId, 
        checkOutData, 
        locationData
      );
    } catch (error) {
      console.error('Error checking out:', error);
      throw error;
    }
  }
  
  /**
   * Get attendance records within geofence
   * @param {string} branchId - Branch ID
   * @param {Date} date - Date to check
   * @returns {Promise<Object>} - Statistics about geofence compliance
   */
  static async getGeofenceStats(branchId, date = new Date()) {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      
      // Get attendance records for this branch and date
      const records = await Attendance.filter({
        branch_id: branchId,
        dateRange: { start: startDate, end: endDate }
      });
      
      // Calculate stats
      const totalRecords = records.length;
      const withinGeofence = records.filter(r => r.is_within_geofence).length;
      const outsideGeofence = totalRecords - withinGeofence;
      const complianceRate = totalRecords > 0 ? (withinGeofence / totalRecords) * 100 : 0;
      
      return {
        totalRecords,
        withinGeofence,
        outsideGeofence,
        complianceRate,
        date: date.toISOString().split('T')[0]
      };
    } catch (error) {
      console.error('Error getting geofence stats:', error);
      throw error;
    }
  }
}

export default AttendanceService;
