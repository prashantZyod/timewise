const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const attendanceController = require('../../controllers/attendanceController');
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');

// @route   POST api/attendance/check-in
// @desc    Staff check-in
// @access  Private
router.post(
  '/check-in',
  [
    auth,
    [
      check('staffId', 'Staff ID is required').not().isEmpty(),
      check('branchId', 'Branch ID is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('location.latitude', 'Latitude is required').not().isEmpty(),
      check('location.longitude', 'Longitude is required').not().isEmpty()
    ]
  ],
  attendanceController.checkIn
);

// @route   POST api/attendance/check-out
// @desc    Staff check-out
// @access  Private
router.post(
  '/check-out',
  [
    auth,
    [
      check('staffId', 'Staff ID is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('location.latitude', 'Latitude is required').not().isEmpty(),
      check('location.longitude', 'Longitude is required').not().isEmpty()
    ]
  ],
  attendanceController.checkOut
);

// @route   POST api/attendance/update-location
// @desc    Update location tracking data
// @access  Private
router.post(
  '/update-location',
  [
    auth,
    [
      check('staffId', 'Staff ID is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('location.latitude', 'Latitude is required').not().isEmpty(),
      check('location.longitude', 'Longitude is required').not().isEmpty()
    ]
  ],
  attendanceController.updateLocation
);

// @route   GET api/attendance/staff/:staffId
// @desc    Get attendance for a staff member by date range
// @access  Private
router.get('/staff/:staffId', auth, attendanceController.getStaffAttendance);

// @route   GET api/attendance/today/staff/:staffId
// @desc    Get today's attendance for a staff member
// @access  Private
router.get('/today/staff/:staffId', auth, attendanceController.getTodayAttendance);

// @route   GET api/attendance/branch/:branchId
// @desc    Get attendance by branch and date range
// @access  Private/Admin
router.get('/branch/:branchId', [auth, adminAuth], attendanceController.getBranchAttendance);

// @route   GET api/attendance/today/branch/:branchId
// @desc    Get today's attendance by branch
// @access  Private/Admin
router.get('/today/branch/:branchId', [auth, adminAuth], attendanceController.getTodayBranchAttendance);

module.exports = router;
