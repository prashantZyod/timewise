import React from 'react';
// Import your context providers
import { StaffProvider } from './StaffContext';
import { BranchProvider } from './BranchContext';
import { GeoLocationProvider } from './GeoLocationContext';
// Import the actual contexts
import StaffContextObj from './StaffContext';
import BranchContextObj from './BranchContext';
// Import other hooks you've defined
import { useStaff } from './StaffContext';
import { useBranch } from './BranchContext';
import { useDevice } from './DeviceContext';
import { useAttendance } from './AttendanceContext';
import { useGeoLocation } from './GeoLocationContext';
import { AuthProvider, useAuth } from './AuthContext';

/**
 * Combined provider component that wraps all context providers
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AppProviders = ({ children }) => {
  return (
    <StaffProvider>
      <BranchProvider>
        <GeoLocationProvider>
          <AuthProvider>
            {/* Other providers can be nested here */}
            {children}
          </AuthProvider>
        </GeoLocationProvider>
      </BranchProvider>
    </StaffProvider>
  );
};

// Export the actual context objects
export const StaffContext = StaffContextObj;
export const BranchContext = BranchContextObj;

// Export your custom hooks
export { 
  useStaff,
  useBranch,
  useDevice,
  useAttendance,
  useGeoLocation,
  useAuth,
};

// server/controllers/geofenceController.js
const Branch = require('../models/Branch');
const { calculateDistance } = require('../utils/geoUtils');

// Verify if a user is within the geofence of a branch
exports.verifyLocation = async (req, res) => {
  try {
    const { branchId, latitude, longitude } = req.body;
    
    if (!branchId || !latitude || !longitude) {
      return res.status(400).json({ 
        message: 'Branch ID, latitude, and longitude are required'
      });
    }
    
    const branch = await Branch.findById(branchId);
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    if (!branch.latitude || !branch.longitude) {
      return res.status(400).json({ 
        message: 'Branch location information is missing'
      });
    }
    
    const distance = calculateDistance(
      latitude,
      longitude,
      branch.latitude,
      branch.longitude
    );
    
    const geofenceRadius = branch.geofenceRadius || 100;
    const isWithinGeofence = distance <= geofenceRadius;
    
    return res.json({
      isWithin: isWithinGeofence,
      distance: Math.round(distance),
      branchName: branch.name,
      geofenceRadius
    });
  } catch (err) {
    console.error('Error verifying location:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get geofence information for a branch
exports.getBranchGeofence = async (req, res) => {
  try {
    const { branchId } = req.params;
    
    const branch = await Branch.findById(branchId);
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    return res.json({
      branchId: branch._id,
      branchName: branch.name,
      latitude: branch.latitude,
      longitude: branch.longitude,
      geofenceRadius: branch.geofenceRadius || 100
    });
  } catch (err) {
    console.error('Error getting branch geofence:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// server/utils/geoUtils.js
// Calculate distance between two points using the Haversine formula
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c * 1000; // Convert to meters
  
  return distance;
};

// Validate coordinates
exports.validateCoordinates = (latitude, longitude) => {
  if (isNaN(latitude) || isNaN(longitude)) {
    return false;
  }
  
  if (latitude < -90 || latitude > 90) {
    return false;
  }
  
  if (longitude < -180 || longitude > 180) {
    return false;
  }
  
  return true;
};

// server/controllers/attendanceController.js
const Attendance = require('../models/Attendance');
const Staff = require('../models/Staff');
const Branch = require('../models/Branch');
const { calculateDistance, validateCoordinates } = require('../utils/geoUtils');

// Record check-in
exports.checkIn = async (req, res) => {
  try {
    const { staffId, branchId, location } = req.body;
    
    if (!staffId || !branchId || !location || !location.latitude || !location.longitude) {
      return res.status(400).json({ 
        message: 'Staff ID, branch ID, and location coordinates are required'
      });
    }
    
    // Validate the coordinates
    if (!validateCoordinates(location.latitude, location.longitude)) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }
    
    // Check if staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    // Check if branch exists
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingAttendance = await Attendance.findOne({
      staffId,
      checkInTime: { $gte: today }
    });
    
    if (existingAttendance) {
      return res.status(400).json({ 
        message: 'You have already checked in today'
      });
    }
    
    // Check if within geofence
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      branch.latitude,
      branch.longitude
    );
    
    const geofenceRadius = branch.geofenceRadius || 100;
    const withinGeofence = distance <= geofenceRadius;
    
    if (!withinGeofence) {
      return res.status(400).json({
        message: `You are ${Math.round(distance)}m away from ${branch.name}. ` +
          `Please be within ${geofenceRadius}m to check in.`,
        distance: Math.round(distance),
        geofenceRadius
      });
    }
    
    // Create new attendance record
    const newAttendance = new Attendance({
      staffId,
      branchId,
      checkInTime: new Date(),
      status: 'present',
      withinGeofence: true,
      location: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    });
    
    await newAttendance.save();
    
    return res.status(201).json(newAttendance);
  } catch (err) {
    console.error('Check-in error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Record check-out (similar implementation with geofence check)
exports.checkOut = async (req, res) => {
  try {
    const { staffId, branchId, location } = req.body;
    
    if (!staffId || !branchId || !location || !location.latitude || !location.longitude) {
      return res.status(400).json({ 
        message: 'Staff ID, branch ID, and location coordinates are required'
      });
    }
    
    // Validate the coordinates
    if (!validateCoordinates(location.latitude, location.longitude)) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }
    
    // Check if staff exists
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    
    // Check if branch exists
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    // Check if checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      staffId,
      branchId,
      checkInTime: { $gte: today }
    });
    
    if (!attendance) {
      return res.status(400).json({ 
        message: 'You need to check in before checking out'
      });
    }
    
    // Check if within geofence
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      branch.latitude,
      branch.longitude
    );
    
    const geofenceRadius = branch.geofenceRadius || 100;
    const withinGeofence = distance <= geofenceRadius;
    
    if (!withinGeofence) {
      return res.status(400).json({
        message: `You are ${Math.round(distance)}m away from ${branch.name}. ` +
          `Please be within ${geofenceRadius}m to check out.`,
        distance: Math.round(distance),
        geofenceRadius
      });
    }
    
    // Update attendance record
    attendance.checkOutTime = new Date();
    attendance.status = 'present';
    attendance.withinGeofence = true;
    attendance.checkOutLocation = {
      latitude: location.latitude,
      longitude: location.longitude
    };
    
    await attendance.save();
    
    return res.json(attendance);
  } catch (err) {
    console.error('Check-out error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get attendance records
exports.getAttendance = async (req, res) => {
  try {
    const { staffId } = req.query;
    
    const query = {};
    if (staffId) {
      query.staffId = staffId;
    }
    
    const attendanceRecords = await Attendance.find(query)
      .populate('staffId', 'name email')
      .populate('branchId', 'name location');
    
    return res.json(attendanceRecords);
  } catch (err) {
    console.error('Error fetching attendance records:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get attendance reports (e.g., for a specific date range)
exports.getReports = async (req, res) => {
  try {
    const { startDate, endDate, branchId } = req.query;
    
    const query = {
      checkInTime: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    if (branchId) {
      query.branchId = branchId;
    }
    
    const attendanceRecords = await Attendance.find(query)
      .populate('staffId', 'name email')
      .populate('branchId', 'name location');
    
    return res.json(attendanceRecords);
  } catch (err) {
    console.error('Error fetching attendance reports:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// server/routes/geofence.js
const express = require('express');
const router = express.Router();
const geofenceController = require('../controllers/geofenceController');
const auth = require('../middleware/auth');

// Verify location
router.post('/verify', auth, geofenceController.verifyLocation);

// Get branch geofence
router.get('/:branchId', auth, geofenceController.getBranchGeofence);

module.exports = router;

// server/routes/attendance.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const auth = require('../middleware/auth');

// Check in
router.post('/check-in', auth, attendanceController.checkIn);

// Check out
router.post('/check-out', auth, attendanceController.checkOut);

// Get attendance records
router.get('/', auth, attendanceController.getAttendance);

// Get attendance reports
router.get('/reports', auth, attendanceController.getReports);

module.exports = router;

// server/models/Attendance.js
const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date
  },
  status: {
    type: String,
    enum: ['present', 'late', 'absent'],
    default: 'present'
  },
  withinGeofence: {
    type: Boolean,
    default: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  checkOutLocation: {
    latitude: Number,
    longitude: Number
  },
  deviceId: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Attendance', AttendanceSchema);

<!-- public/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Other head elements -->
    <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY" async defer></script>
  </head>
  <body>
    <!-- Body content -->
  </body>
</html>
