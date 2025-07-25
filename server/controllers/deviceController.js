const Device = require('../models/Device');
const Staff = require('../models/Staff');
const { validationResult } = require('express-validator');

// @desc    Register a new device
// @route   POST /api/devices
// @access  Private
exports.registerDevice = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      deviceId,
      name,
      type,
      staffId,
      browserInfo,
      osInfo,
      lastKnownLocation
    } = req.body;

    // Check if device already exists
    let device = await Device.findOne({ deviceId });
    if (device) {
      return res.status(400).json({ msg: 'Device already registered' });
    }

    // Find staff
    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.status(404).json({ msg: 'Staff not found' });
    }

    // Create new device
    device = new Device({
      deviceId,
      name: name || `${type} device`,
      type,
      owner: staffId,
      browserInfo,
      osInfo,
      lastKnownLocation
    });

    await device.save();

    // Add device to staff's devices array
    await Staff.findByIdAndUpdate(
      staffId,
      { $addToSet: { devices: device._id } }
    );

    res.status(201).json(device);
  } catch (err) {
    console.error('Error in registerDevice:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all devices
// @route   GET /api/devices
// @access  Private/Admin
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.find()
      .populate('owner', ['_id'])
      .populate({
        path: 'owner',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .populate('approvedBy', ['name', 'email'])
      .sort({ createdAt: -1 });
    
    res.json(devices);
  } catch (err) {
    console.error('Error in getAllDevices:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get device by ID
// @route   GET /api/devices/:id
// @access  Private
exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findById(req.params.id)
      .populate('owner', ['_id'])
      .populate({
        path: 'owner',
        populate: {
          path: 'user',
          select: 'name email'
        }
      })
      .populate('approvedBy', ['name', 'email']);

    if (!device) {
      return res.status(404).json({ msg: 'Device not found' });
    }

    // Check if user is admin or the staff member who owns the device
    const staff = await Staff.findOne({ user: req.user.id });
    if (req.user.role !== 'admin' && (!staff || device.owner._id.toString() !== staff._id.toString())) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(device);
  } catch (err) {
    console.error('Error in getDeviceById:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Device not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Update device
// @route   PUT /api/devices/:id
// @access  Private/Admin
exports.updateDevice = async (req, res) => {
  try {
    const {
      name,
      lastKnownLocation,
      isApproved,
      isBlocked,
      blockedReason
    } = req.body;

    // Find device by id
    let device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ msg: 'Device not found' });
    }

    // Build device object
    const deviceFields = {};
    if (name) deviceFields.name = name;
    if (lastKnownLocation) deviceFields.lastKnownLocation = {
      ...lastKnownLocation,
      timestamp: new Date()
    };
    if (isBlocked !== undefined) deviceFields.isBlocked = isBlocked;
    if (isBlocked && blockedReason) deviceFields.blockedReason = blockedReason;

    // Handle approval separately
    if (isApproved !== undefined && isApproved !== device.isApproved) {
      deviceFields.isApproved = isApproved;
      if (isApproved) {
        deviceFields.approvedBy = req.user.id;
        deviceFields.approvedAt = new Date();
      } else {
        deviceFields.approvedBy = null;
        deviceFields.approvedAt = null;
      }
    }

    // Update device
    device = await Device.findByIdAndUpdate(
      req.params.id,
      { $set: deviceFields },
      { new: true }
    )
    .populate('owner', ['_id'])
    .populate({
      path: 'owner',
      populate: {
        path: 'user',
        select: 'name email'
      }
    })
    .populate('approvedBy', ['name', 'email']);

    res.json(device);
  } catch (err) {
    console.error('Error in updateDevice:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Device not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Delete device
// @route   DELETE /api/devices/:id
// @access  Private/Admin
exports.deleteDevice = async (req, res) => {
  try {
    // Find device by id
    const device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ msg: 'Device not found' });
    }

    // Remove device from staff's devices array
    await Staff.findByIdAndUpdate(
      device.owner,
      { $pull: { devices: device._id } }
    );

    // Delete device
    await Device.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Device removed' });
  } catch (err) {
    console.error('Error in deleteDevice:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Device not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Get devices by staff ID
// @route   GET /api/devices/staff/:staffId
// @access  Private
exports.getDevicesByStaffId = async (req, res) => {
  try {
    const devices = await Device.find({ owner: req.params.staffId })
      .populate('approvedBy', ['name', 'email'])
      .sort({ createdAt: -1 });

    // Check if user is admin or the staff member who owns the devices
    const staff = await Staff.findOne({ user: req.user.id });
    if (req.user.role !== 'admin' && (!staff || req.params.staffId !== staff._id.toString())) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(devices);
  } catch (err) {
    console.error('Error in getDevicesByStaffId:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update device last known location
// @route   PUT /api/devices/:id/location
// @access  Private
exports.updateDeviceLocation = async (req, res) => {
  try {
    const { latitude, longitude, accuracy } = req.body;

    // Find device by id
    let device = await Device.findById(req.params.id);
    if (!device) {
      return res.status(404).json({ msg: 'Device not found' });
    }

    // Check if user is authorized
    const staff = await Staff.findOne({ user: req.user.id });
    if (req.user.role !== 'admin' && (!staff || device.owner.toString() !== staff._id.toString())) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Update location
    device = await Device.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          lastKnownLocation: {
            latitude,
            longitude,
            accuracy,
            timestamp: new Date()
          },
          lastActive: new Date()
        }
      },
      { new: true }
    );

    res.json(device);
  } catch (err) {
    console.error('Error in updateDeviceLocation:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Device not found' });
    }
    res.status(500).send('Server error');
  }
};
