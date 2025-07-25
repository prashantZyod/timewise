const Staff = require('../models/Staff');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create a new staff member
// @route   POST /api/staff
// @access  Private/Admin
exports.createStaff = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      userId,
      employeeId,
      position,
      department,
      branch,
      contactInfo,
      emergencyContact,
      joinDate
    } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if staff with this userId already exists
    let staffExists = await Staff.findOne({ user: userId });
    if (staffExists) {
      return res.status(400).json({ msg: 'Staff record already exists for this user' });
    }

    // Create new staff
    const staff = new Staff({
      user: userId,
      employeeId,
      position,
      department,
      branch,
      contactInfo,
      emergencyContact,
      joinDate: joinDate || Date.now()
    });

    await staff.save();
    res.status(201).json(staff);
  } catch (err) {
    console.error('Error in createStaff:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private/Admin
exports.getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find()
      .populate('user', ['name', 'email', 'role'])
      .populate('branch', ['name', 'location'])
      .sort({ createdAt: -1 });
    
    res.json(staff);
  } catch (err) {
    console.error('Error in getAllStaff:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get staff by ID
// @route   GET /api/staff/:id
// @access  Private
exports.getStaffById = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id)
      .populate('user', ['name', 'email', 'role'])
      .populate('branch', ['name', 'location', 'geofence'])
      .populate({
        path: 'devices',
        select: 'deviceId name type isApproved lastActive'
      });

    if (!staff) {
      return res.status(404).json({ msg: 'Staff not found' });
    }

    // Check if user is admin or the staff member themselves
    if (req.user.role !== 'admin' && staff.user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(staff);
  } catch (err) {
    console.error('Error in getStaffById:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Staff not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Update staff
// @route   PUT /api/staff/:id
// @access  Private/Admin
exports.updateStaff = async (req, res) => {
  try {
    const {
      position,
      department,
      branch,
      contactInfo,
      emergencyContact,
      status
    } = req.body;

    // Find staff by id
    let staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ msg: 'Staff not found' });
    }

    // Build staff object
    const staffFields = {};
    if (position) staffFields.position = position;
    if (department) staffFields.department = department;
    if (branch) staffFields.branch = branch;
    if (contactInfo) staffFields.contactInfo = contactInfo;
    if (emergencyContact) staffFields.emergencyContact = emergencyContact;
    if (status) staffFields.status = status;

    // Update staff
    staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: staffFields },
      { new: true }
    ).populate('user', ['name', 'email', 'role'])
     .populate('branch', ['name', 'location']);

    res.json(staff);
  } catch (err) {
    console.error('Error in updateStaff:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Staff not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Delete staff
// @route   DELETE /api/staff/:id
// @access  Private/Admin
exports.deleteStaff = async (req, res) => {
  try {
    // Find staff by id
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ msg: 'Staff not found' });
    }

    await Staff.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Staff removed' });
  } catch (err) {
    console.error('Error in deleteStaff:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Staff not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Get staff by user ID
// @route   GET /api/staff/user/:userId
// @access  Private
exports.getStaffByUserId = async (req, res) => {
  try {
    const staff = await Staff.findOne({ user: req.params.userId })
      .populate('user', ['name', 'email', 'role'])
      .populate('branch', ['name', 'location', 'geofence'])
      .populate({
        path: 'devices',
        select: 'deviceId name type isApproved lastActive'
      });

    if (!staff) {
      return res.status(404).json({ msg: 'Staff not found' });
    }

    // Check if user is admin or the staff member themselves
    if (req.user.role !== 'admin' && req.params.userId !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(staff);
  } catch (err) {
    console.error('Error in getStaffByUserId:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Staff not found' });
    }
    res.status(500).send('Server error');
  }
};
