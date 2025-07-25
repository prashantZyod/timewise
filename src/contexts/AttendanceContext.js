import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import AttendanceService from '../services/AttendanceService';
import { useGeoLocation } from './GeoLocationContext';
import { useBranch } from './BranchContext';

// Create the context
const AttendanceContext = createContext();

/**
 * Provider component for attendance data
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [todayRecords, setTodayRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { checkGeofence } = useGeoLocation();
  const { getBranchById } = useBranch();

  // Load initial attendance data
  useEffect(() => {
    fetchAttendanceRecords();
    fetchTodayRecords();
  }, [fetchAttendanceRecords, fetchTodayRecords]);

  /**
   * Fetch all attendance records
   * @returns {Promise<void>}
   */
  const fetchAttendanceRecords = useCallback(async () => {
    try {
      setLoading(true);
      const data = await AttendanceService.getAll();
      setAttendanceRecords(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance records:', err);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch today's attendance records
   * @returns {Promise<void>}
   */
  const fetchTodayRecords = useCallback(async () => {
    try {
      const data = await AttendanceService.getToday();
      setTodayRecords(data);
    } catch (err) {
      console.error('Error fetching today\'s records:', err);
      setError('Failed to load today\'s attendance data');
    }
  }, []);

  /**
   * Get an attendance record by ID
   * @param {string} id - Attendance ID
   * @returns {Promise<Object|null>} Attendance record or null
   */
  const getAttendanceById = useCallback(async (id) => {
    try {
      return await AttendanceService.getById(id);
    } catch (err) {
      console.error(`Error fetching attendance ${id}:`, err);
      setError(`Failed to load attendance with ID ${id}`);
      return null;
    }
  }, []);

  /**
   * Create a new attendance record
   * @param {Object} data - Attendance data
   * @returns {Promise<Object|null>} Created attendance record or null
   */
  const createAttendance = useCallback(async (data) => {
    try {
      const newAttendance = await AttendanceService.create(data);
      setAttendanceRecords(prev => [...prev, newAttendance]);
      
      // If it's today's record, update todayRecords as well
      const today = new Date().toDateString();
      const recordDate = new Date(newAttendance.check_in_time).toDateString();
      if (recordDate === today) {
        setTodayRecords(prev => [...prev, newAttendance]);
      }
      
      return newAttendance;
    } catch (err) {
      console.error('Error creating attendance record:', err);
      setError('Failed to create attendance record');
      return null;
    }
  }, []);

  /**
   * Update an attendance record
   * @param {string} id - Attendance ID
   * @param {Object} data - Updated data
   * @returns {Promise<Object|null>} Updated attendance record or null
   */
  const updateAttendance = useCallback(async (id, data) => {
    try {
      const updatedAttendance = await AttendanceService.update(id, data);
      if (updatedAttendance) {
        // Update in the main attendance records
        setAttendanceRecords(prev => 
          prev.map(item => 
            item.id === id ? updatedAttendance : item
          )
        );
        
        // Update in today's records if present
        setTodayRecords(prev => {
          const exists = prev.some(item => item.id === id);
          if (exists) {
            return prev.map(item => 
              item.id === id ? updatedAttendance : item
            );
          }
          return prev;
        });
      }
      return updatedAttendance;
    } catch (err) {
      console.error(`Error updating attendance ${id}:`, err);
      setError(`Failed to update attendance with ID ${id}`);
      return null;
    }
  }, []);

  /**
   * Delete an attendance record
   * @param {string} id - Attendance ID
   * @returns {Promise<boolean>} Success status
   */
  const deleteAttendance = useCallback(async (id) => {
    try {
      const success = await AttendanceService.delete(id);
      if (success) {
        setAttendanceRecords(prev => prev.filter(item => item.id !== id));
        setTodayRecords(prev => prev.filter(item => item.id !== id));
      }
      return success;
    } catch (err) {
      console.error(`Error deleting attendance ${id}:`, err);
      setError(`Failed to delete attendance with ID ${id}`);
      return false;
    }
  }, []);

  /**
   * Filter attendance records by criteria
   * @param {Object} criteria - Filter criteria
   * @returns {Promise<Array>} Filtered attendance records
   */
  const filterAttendance = useCallback(async (criteria) => {
    try {
      return await AttendanceService.filter(criteria);
    } catch (err) {
      console.error('Error filtering attendance records:', err);
      setError('Failed to filter attendance records');
      return [];
    }
  }, []);

  /**
   * Record check-in
   * @param {Object} data - Check-in data
   * @returns {Promise<Object|null>} Created attendance record or null
   */
  const checkIn = useCallback(async (staffId, branchId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the branch information
      const branch = getBranchById(branchId);
      
      if (!branch) {
        throw new Error('Branch not found');
      }
      
      // Check if user is within geofence
      const geofenceResult = await checkGeofence(branch);
      
      if (!geofenceResult.isWithin) {
        throw new Error(
          `You are ${geofenceResult.distance}m away from ${branch.name}. ` +
          `Please be within ${branch.geofenceRadius || 100}m to check in.`
        );
      }
      
      // If within geofence, proceed with check-in
      const checkInData = {
        staffId,
        branchId,
        checkInTime: new Date(),
        location: {
          latitude: geofenceResult.position.latitude,
          longitude: geofenceResult.position.longitude
        },
        withinGeofence: true
      };
      
      // Call API to record check-in
      // For now, simulate with local storage
      const newAttendance = {
        id: Date.now().toString(),
        ...checkInData,
        status: 'present'
      };
      
      setAttendanceRecords(prev => [...prev, newAttendance]);
      setTodayRecords(prev => [...prev, newAttendance]);
      return newAttendance;
    } catch (err) {
      console.error('Check-in error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getBranchById, checkGeofence, setAttendanceRecords, setTodayRecords, setError, setLoading]);
  
  /**
   * Record check-out
   * @param {string} id - Attendance record ID
   * @param {Object} data - Check-out data
   * @returns {Promise<Object|null>} Updated attendance record or null
   */
  const checkOut = useCallback(async (id, data) => {
    try {
      const record = await AttendanceService.checkOut(id, data);
      if (record) {
        setAttendanceRecords(prev => 
          prev.map(item => 
            item.id === id ? record : item
          )
        );
        setTodayRecords(prev => 
          prev.map(item => 
            item.id === id ? record : item
          )
        );
      }
      return record;
    } catch (err) {
      console.error('Error recording check-out:', err);
      setError('Failed to record check-out');
      return null;
    }
  }, []);

  /**
   * Get attendance records by staff member
   * @param {string} staffId - Staff ID
   * @returns {Promise<Array>} Attendance records for staff
   */
  const getAttendanceByStaff = useCallback(async (staffId) => {
    try {
      return await AttendanceService.getByStaff(staffId);
    } catch (err) {
      console.error(`Error fetching attendance for staff ${staffId}:`, err);
      setError(`Failed to load attendance for staff ${staffId}`);
      return [];
    }
  }, []);

  /**
   * Get attendance records by branch
   * @param {string} branchId - Branch ID
   * @returns {Promise<Array>} Attendance records for branch
   */
  const getAttendanceByBranch = useCallback(async (branchId) => {
    try {
      return await AttendanceService.getByBranch(branchId);
    } catch (err) {
      console.error(`Error fetching attendance for branch ${branchId}:`, err);
      setError(`Failed to load attendance for branch ${branchId}`);
      return [];
    }
  }, []);

  /**
   * Get attendance records by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise<Array>} Attendance records within date range
   */
  const getAttendanceByDateRange = useCallback(async (startDate, endDate) => {
    try {
      return await AttendanceService.getByDateRange(startDate, endDate);
    } catch (err) {
      console.error('Error fetching attendance by date range:', err);
      setError('Failed to load attendance for date range');
      return [];
    }
  }, []);

  /**
   * Verify an attendance record
   * @param {string} id - Attendance record ID
   * @param {string} verifiedBy - ID of staff who verified
   * @returns {Promise<Object|null>} Updated attendance record or null
   */
  const verifyAttendance = useCallback(async (id, verifiedBy) => {
    try {
      const record = await AttendanceService.verify(id, verifiedBy);
      if (record) {
        setAttendanceRecords(prev => 
          prev.map(item => 
            item.id === id ? record : item
          )
        );
        setTodayRecords(prev => 
          prev.map(item => 
            item.id === id ? record : item
          )
        );
      }
      return record;
    } catch (err) {
      console.error(`Error verifying attendance ${id}:`, err);
      setError(`Failed to verify attendance with ID ${id}`);
      return null;
    }
  }, []);

  /**
   * Approve an attendance record
   * @param {string} id - Attendance record ID
   * @returns {Promise<Object|null>} Updated attendance record or null
   */
  const approveAttendance = useCallback(async (id) => {
    try {
      const record = await AttendanceService.approve(id);
      if (record) {
        setAttendanceRecords(prev => 
          prev.map(item => 
            item.id === id ? record : item
          )
        );
        setTodayRecords(prev => 
          prev.map(item => 
            item.id === id ? record : item
          )
        );
      }
      return record;
    } catch (err) {
      console.error(`Error approving attendance ${id}:`, err);
      setError(`Failed to approve attendance with ID ${id}`);
      return null;
    }
  }, []);

  // Context value
  const value = {
    attendanceRecords,
    todayRecords,
    loading,
    error,
    fetchAttendanceRecords,
    fetchTodayRecords,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance,
    filterAttendance,
    checkIn,
    checkOut,
    getAttendanceByStaff,
    getAttendanceByBranch,
    getAttendanceByDateRange,
    verifyAttendance,
    approveAttendance
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

/**
 * Hook for using attendance context
 * @returns {Object} Attendance context value
 */
export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export default AttendanceContext;
