import Branch from '../entities/Branch';
import Attendance from '../entities/Attendance';
import { initializeSampleDevices } from '../entities/Device';
import GeoLocationService from '../services/GeoLocationService';

/**
 * Generate sample branches with geofence data for testing purposes
 */
const setupSampleBranches = async () => {
  const branches = [
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
      radius: 250,
      is_active: true,
      attendance_settings: {
        requireGeofencing: true,
        requirePhotoVerification: false,
        maxDistanceOutside: 50,
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
      radius: 250,
      is_active: true,
      attendance_settings: {
        requireGeofencing: true,
        requirePhotoVerification: false,
        maxDistanceOutside: 50,
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
      radius: 250,
      is_active: true,
      attendance_settings: {
        requireGeofencing: true,
        requirePhotoVerification: false,
        maxDistanceOutside: 50,
        checkInStartTime: '08:30',
        checkInEndTime: '10:30',
        checkOutStartTime: '16:30',
        checkOutEndTime: '18:30'
      }
    }
  ];
  
  // Store in localStorage for our mock implementation
  localStorage.setItem('branches', JSON.stringify(branches));
  console.log('Sample branches created:', branches.length);
  
  return branches;
};

/**
 * Generate sample attendance records with geofence data for testing
 */
const setupSampleAttendance = async () => {
  // Fetch sample branches
  const branches = JSON.parse(localStorage.getItem('branches') || '[]');
  
  if (branches.length === 0) {
    console.error('No branches found. Please run setupSampleBranches first.');
    return [];
  }
  
  // Sample staff IDs
  const staffIds = ['101', '102', '103', '104', '105', '106'];
  
  // Sample device IDs
  const deviceIds = ['D1001', 'D1002', 'D1003', 'D1004'];
  
  // Generate attendance records for each branch
  const allAttendanceRecords = [];
  
  for (const branch of branches) {
    // Create records for today
    const today = new Date();
    
    // Create some records for within geofence
    for (let i = 0; i < 5; i++) {
      const staffId = staffIds[Math.floor(Math.random() * staffIds.length)];
      const deviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
      
      // Generate a random location within the geofence
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * (branch.radius * 0.8); // 80% of radius to ensure within
      
      const lat = branch.latitude + (distance / 111320) * Math.cos(angle); // 111320 meters per degree latitude
      const lng = branch.longitude + (distance / (111320 * Math.cos(branch.latitude * Math.PI/180))) * Math.sin(angle);
      
      // Random time between 8 AM and 10 AM for check-in
      const checkInHour = 8 + Math.floor(Math.random() * 2);
      const checkInMinute = Math.floor(Math.random() * 60);
      const checkInTime = new Date(today);
      checkInTime.setHours(checkInHour, checkInMinute, 0, 0);
      
      // Some will have check-out, some won't
      let checkOutTime = null;
      if (Math.random() > 0.3) { // 70% chance of having checkout
        // Random time between 5 PM and 6 PM for check-out
        const checkOutHour = 17 + Math.floor(Math.random() * 1);
        const checkOutMinute = Math.floor(Math.random() * 60);
        checkOutTime = new Date(today);
        checkOutTime.setHours(checkOutHour, checkOutMinute, 0, 0);
      }
      
      const attendanceRecord = {
        id: crypto.randomUUID(),
        staff_id: staffId,
        branch_id: branch.id,
        device_id: deviceId,
        check_in_time: checkInTime.toISOString(),
        check_out_time: checkOutTime ? checkOutTime.toISOString() : null,
        check_in_location: {
          latitude: lat,
          longitude: lng
        },
        check_out_location: checkOutTime ? {
          latitude: lat + (Math.random() * 0.0002 - 0.0001), // Slight variation
          longitude: lng + (Math.random() * 0.0002 - 0.0001)
        } : null,
        is_within_geofence: true,
        distance_from_branch: distance,
        status: checkInHour <= 9 ? 'present' : 'late',
        is_verified: Math.random() > 0.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      allAttendanceRecords.push(attendanceRecord);
    }
    
    // Create some records for outside geofence
    for (let i = 0; i < 2; i++) {
      const staffId = staffIds[Math.floor(Math.random() * staffIds.length)];
      const deviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)];
      
      // Generate a random location outside the geofence
      const angle = Math.random() * 2 * Math.PI;
      const distance = branch.radius + 50 + Math.random() * 200; // 50-250m outside
      
      const lat = branch.latitude + (distance / 111320) * Math.cos(angle);
      const lng = branch.longitude + (distance / (111320 * Math.cos(branch.latitude * Math.PI/180))) * Math.sin(angle);
      
      // Random time for check-in
      const checkInHour = 8 + Math.floor(Math.random() * 3);
      const checkInMinute = Math.floor(Math.random() * 60);
      const checkInTime = new Date(today);
      checkInTime.setHours(checkInHour, checkInMinute, 0, 0);
      
      const attendanceRecord = {
        id: crypto.randomUUID(),
        staff_id: staffId,
        branch_id: branch.id,
        device_id: deviceId,
        check_in_time: checkInTime.toISOString(),
        check_out_time: null, // No check-out for these records
        check_in_location: {
          latitude: lat,
          longitude: lng
        },
        check_out_location: null,
        is_within_geofence: false,
        distance_from_branch: distance,
        status: 'present', // Still marked present but needs verification
        is_verified: false, // Not verified
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      allAttendanceRecords.push(attendanceRecord);
    }
  }
  
  // Store in localStorage for our mock implementation
  localStorage.setItem('attendance', JSON.stringify(allAttendanceRecords));
  console.log('Sample attendance records created:', allAttendanceRecords.length);
  
  return allAttendanceRecords;
};

/**
 * Setup sample device data
 */
const setupSampleDevices = async () => {
  const devices = initializeSampleDevices();
  console.log('Sample device data created:', devices.length);
  return devices;
};

/**
 * Initialize all sample data for the application
 */
const initializeSampleData = async () => {
  console.log('Initializing sample data...');
  await setupSampleBranches();
  await setupSampleAttendance();
  await setupSampleDevices();
  console.log('Sample data initialization complete!');
};

export default initializeSampleData;
