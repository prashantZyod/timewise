const Attendance = require('../models/Attendance');
const Staff = require('../models/Staff');
const Branch = require('../models/Branch');
const Geofence = require('../models/Geofence');
const { validationResult } = require('express-validator');

// Helper function to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
           Math.cos(φ1) * Math.cos(φ2) *
           Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
};

// @desc    Staff check-in
// @route   POST /api/attendance/check-in
// @access  Private
exports.checkIn = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      staffId,
      branchId,
      location,
      deviceInfo,
      notes,
      customPremiseData
    } = req.body;

    // Find staff
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ msg: 'Staff not found' });
    }

    // Find branch
    const branch = await Branch.findById(branchId);
    if (!branch) {
      return res.status(404).json({ msg: 'Branch not found' });
    }

    // Check if already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let attendance = await Attendance.findOne({
      staff: staffId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    // Use custom premise location or branch geofence
    let checkLocation = branch.geofence.center;
    let checkRadius = branch.geofence.radius;
    let locationName = branch.name;
    let customPremiseUsed = false;

    if (customPremiseData && customPremiseData.latitude && customPremiseData.longitude) {
      checkLocation = {
        latitude: customPremiseData.latitude,
        longitude: customPremiseData.longitude
      };
      checkRadius = customPremiseData.radius || 250; // Default to 250m if not specified
      locationName = customPremiseData.name || 'Custom Premise';
      customPremiseUsed = true;
    }

    // Calculate distance and check if within geofence
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      checkLocation.latitude,
      checkLocation.longitude
    );
    
    const isWithinGeofence = distance <= checkRadius;

    if (attendance) {
      // Already has an attendance record for today, update check-in if not already checked in
      if (attendance.checkIn.time) {
        return res.status(400).json({ msg: 'Already checked in today' });
      }

      attendance.checkIn = {
        time: new Date(),
        location: {
          ...location,
          isWithinGeofence,
          distance,
          radius: checkRadius,
          locationName
        },
        deviceInfo,
        notes
      };

      attendance.status = isWithinGeofence ? 'present' : 'pending';
      attendance.customPremiseUsed = customPremiseUsed;
      
      if (customPremiseUsed) {
        attendance.customPremiseData = customPremiseData;
      }

      attendance.locationTrackingData.push({
        timestamp: new Date(),
        latitude: location.latitude,
        longitude: location.longitude,
        isWithinGeofence,
        distance
      });

      await attendance.save();
    } else {
      // Create new attendance record
      attendance = new Attendance({
        staff: staffId,
        branch: branchId,
        date: today,
        checkIn: {
          time: new Date(),
          location: {
            ...location,
            isWithinGeofence,
            distance,
            radius: checkRadius,
            locationName
          },
          deviceInfo,
          notes
        },
        status: isWithinGeofence ? 'present' : 'pending',
        customPremiseUsed,
        customPremiseData: customPremiseUsed ? customPremiseData : undefined,
        locationTrackingData: [{
          timestamp: new Date(),
          latitude: location.latitude,
          longitude: location.longitude,
          isWithinGeofence,
          distance
        }]
      });

      await attendance.save();
    }

    // Update staff's lastCheckIn
    await Staff.findByIdAndUpdate(staffId, {
      $set: {
        lastCheckIn: new Date(),
        lastKnownLocation: location
      }
    });

    res.json(attendance);
  } catch (err) {
    console.error('Error in checkIn:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Staff check-out
// @route   POST /api/attendance/check-out
// @access  Private
exports.checkOut = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      staffId,
      location,
      deviceInfo,
      notes
    } = req.body;

    // Find staff
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ msg: 'Staff not found' });
    }

    // Check if checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      staff: staffId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!attendance) {
      return res.status(400).json({ msg: 'No check-in record found for today' });
    }

    if (!attendance.checkIn.time) {
      return res.status(400).json({ msg: 'Must check in before checking out' });
    }

    if (attendance.checkOut.time) {
      return res.status(400).json({ msg: 'Already checked out today' });
    }

    // Use the same geofence settings as check-in
    let checkLocation, checkRadius;
    
    if (attendance.customPremiseUsed && attendance.customPremiseData) {
      checkLocation = {
        latitude: attendance.customPremiseData.latitude,
        longitude: attendance.customPremiseData.longitude
      };
      checkRadius = attendance.customPremiseData.radius || 250;
    } else {
      // Get branch geofence info
      const branch = await Branch.findById(attendance.branch);
      if (!branch) {
        return res.status(404).json({ msg: 'Branch not found' });
      }
      
      checkLocation = branch.geofence.center;
      checkRadius = branch.geofence.radius;
    }

    // Calculate distance and check if within geofence
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      checkLocation.latitude,
      checkLocation.longitude
    );
    
    const isWithinGeofence = distance <= checkRadius;

    // Update attendance with check-out
    attendance.checkOut = {
      time: new Date(),
      location: {
        ...location,
        isWithinGeofence,
        distance,
        radius: checkRadius
      },
      deviceInfo,
      notes
    };

    // Calculate total hours
    const checkInTime = new Date(attendance.checkIn.time);
    const checkOutTime = new Date();
    const totalHours = (checkOutTime - checkInTime) / (1000 * 60 * 60);
    
    attendance.totalHours = parseFloat(totalHours.toFixed(2));

    // Add location tracking data
    attendance.locationTrackingData.push({
      timestamp: new Date(),
      latitude: location.latitude,
      longitude: location.longitude,
      isWithinGeofence,
      distance
    });

    await attendance.save();

    // Update staff's lastCheckOut
    await Staff.findByIdAndUpdate(staffId, {
      $set: {
        lastCheckOut: new Date(),
        lastKnownLocation: location
      }
    });

    res.json(attendance);
  } catch (err) {
    console.error('Error in checkOut:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update location tracking data
// @route   POST /api/attendance/update-location
// @access  Private
exports.updateLocation = async (req, res) => {
  try {
    const { staffId, location } = req.body;

    // Find today's attendance record
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      staff: staffId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (!attendance) {
      return res.status(400).json({ msg: 'No attendance record found for today' });
    }

    // Use the same geofence settings as check-in
    let checkLocation, checkRadius;
    
    if (attendance.customPremiseUsed && attendance.customPremiseData) {
      checkLocation = {
        latitude: attendance.customPremiseData.latitude,
        longitude: attendance.customPremiseData.longitude
      };
      checkRadius = attendance.customPremiseData.radius || 250;
    } else {
      // Get branch geofence info
      const branch = await Branch.findById(attendance.branch);
      if (!branch) {
        return res.status(404).json({ msg: 'Branch not found' });
      }
      
      checkLocation = branch.geofence.center;
      checkRadius = branch.geofence.radius;
    }

    // Calculate distance and check if within geofence
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      checkLocation.latitude,
      checkLocation.longitude
    );
    
    const isWithinGeofence = distance <= checkRadius;

    // Add to location tracking data
    attendance.locationTrackingData.push({
      timestamp: new Date(),
      latitude: location.latitude,
      longitude: location.longitude,
      isWithinGeofence,
      distance
    });

    await attendance.save();

    // Update staff's lastKnownLocation
    await Staff.findByIdAndUpdate(staffId, {
      $set: {
        lastKnownLocation: location
      }
    });

    res.json({ success: true, isWithinGeofence, distance });
  } catch (err) {
    console.error('Error in updateLocation:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get attendance for a staff member by date range
// @route   GET /api/attendance/staff/:staffId
// @access  Private
exports.getStaffAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else if (startDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate)
        }
      };
    } else if (endDate) {
      dateFilter = {
        date: {
          $lte: new Date(endDate)
        }
      };
    }

    const attendance = await Attendance.find({
      staff: req.params.staffId,
      ...dateFilter
    })
    .populate('branch', ['name', 'location'])
    .sort({ date: -1 });

    res.json(attendance);
  } catch (err) {
    console.error('Error in getStaffAttendance:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get today's attendance for a staff member
// @route   GET /api/attendance/today/staff/:staffId
// @access  Private
exports.getTodayAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.findOne({
      staff: req.params.staffId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    }).populate('branch', ['name', 'location']);

    if (!attendance) {
      return res.json(null);
    }

    res.json(attendance);
  } catch (err) {
    console.error('Error in getTodayAttendance:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get attendance by branch and date range
// @route   GET /api/attendance/branch/:branchId
// @access  Private/Admin
exports.getBranchAttendance = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let dateFilter = {};
    
    if (startDate && endDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else if (startDate) {
      dateFilter = {
        date: {
          $gte: new Date(startDate)
        }
      };
    } else if (endDate) {
      dateFilter = {
        date: {
          $lte: new Date(endDate)
        }
      };
    }

    const attendance = await Attendance.find({
      branch: req.params.branchId,
      ...dateFilter
    })
    .populate('staff', ['_id'])
    .populate({
      path: 'staff',
      populate: {
        path: 'user',
        select: 'name email'
      }
    })
    .sort({ date: -1 });

    res.json(attendance);
  } catch (err) {
    console.error('Error in getBranchAttendance:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get today's attendance by branch
// @route   GET /api/attendance/today/branch/:branchId
// @access  Private/Admin
exports.getTodayBranchAttendance = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance = await Attendance.find({
      branch: req.params.branchId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    })
    .populate({
      path: 'staff',
      populate: {
        path: 'user',
        select: 'name email'
      }
    });

    res.json(attendance);
  } catch (err) {
    console.error('Error in getTodayBranchAttendance:', err.message);
    res.status(500).send('Server error');
  }
};
