const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const deviceController = require('../../controllers/deviceController');
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');

// @route   POST api/devices
// @desc    Register a new device
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('deviceId', 'Device ID is required').not().isEmpty(),
      check('type', 'Device type is required').not().isEmpty(),
      check('staffId', 'Staff ID is required').not().isEmpty()
    ]
  ],
  deviceController.registerDevice
);

// @route   GET api/devices
// @desc    Get all devices
// @access  Private/Admin
router.get('/', [auth, adminAuth], deviceController.getAllDevices);

// @route   GET api/devices/:id
// @desc    Get device by ID
// @access  Private
router.get('/:id', auth, deviceController.getDeviceById);

// @route   PUT api/devices/:id
// @desc    Update device
// @access  Private/Admin
router.put('/:id', [auth, adminAuth], deviceController.updateDevice);

// @route   DELETE api/devices/:id
// @desc    Delete device
// @access  Private/Admin
router.delete('/:id', [auth, adminAuth], deviceController.deleteDevice);

// @route   GET api/devices/staff/:staffId
// @desc    Get devices by staff ID
// @access  Private
router.get('/staff/:staffId', auth, deviceController.getDevicesByStaffId);

// @route   PUT api/devices/:id/location
// @desc    Update device last known location
// @access  Private
router.put(
  '/:id/location',
  [
    auth,
    [
      check('latitude', 'Latitude is required').not().isEmpty(),
      check('longitude', 'Longitude is required').not().isEmpty()
    ]
  ],
  deviceController.updateDeviceLocation
);

module.exports = router;
