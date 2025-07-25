const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const staffController = require('../../controllers/staffController');
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');

// @route   POST api/staff
// @desc    Create a new staff member
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    adminAuth,
    [
      check('userId', 'User ID is required').not().isEmpty(),
      check('employeeId', 'Employee ID is required').not().isEmpty(),
      check('position', 'Position is required').not().isEmpty(),
      check('branch', 'Branch is required').not().isEmpty()
    ]
  ],
  staffController.createStaff
);

// @route   GET api/staff
// @desc    Get all staff members
// @access  Private/Admin
router.get('/', [auth, adminAuth], staffController.getAllStaff);

// @route   GET api/staff/:id
// @desc    Get staff by ID
// @access  Private
router.get('/:id', auth, staffController.getStaffById);

// @route   PUT api/staff/:id
// @desc    Update staff
// @access  Private/Admin
router.put('/:id', [auth, adminAuth], staffController.updateStaff);

// @route   DELETE api/staff/:id
// @desc    Delete staff
// @access  Private/Admin
router.delete('/:id', [auth, adminAuth], staffController.deleteStaff);

// @route   GET api/staff/user/:userId
// @desc    Get staff by user ID
// @access  Private
router.get('/user/:userId', auth, staffController.getStaffByUserId);

module.exports = router;
