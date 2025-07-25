const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const branchController = require('../../controllers/branchController');
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');

// @route   POST api/branches
// @desc    Create a new branch
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    adminAuth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('location', 'Location coordinates are required').not().isEmpty(),
      check('location.latitude', 'Latitude is required').not().isEmpty(),
      check('location.longitude', 'Longitude is required').not().isEmpty(),
      check('address', 'Address is required').not().isEmpty()
    ]
  ],
  branchController.createBranch
);

// @route   GET api/branches
// @desc    Get all branches
// @access  Private
router.get('/', auth, branchController.getAllBranches);

// @route   GET api/branches/:id
// @desc    Get branch by ID
// @access  Private
router.get('/:id', auth, branchController.getBranchById);

// @route   PUT api/branches/:id
// @desc    Update branch
// @access  Private/Admin
router.put('/:id', [auth, adminAuth], branchController.updateBranch);

// @route   DELETE api/branches/:id
// @desc    Delete branch
// @access  Private/Admin
router.delete('/:id', [auth, adminAuth], branchController.deleteBranch);

// @route   PUT api/branches/:id/geofence
// @desc    Update branch geofence
// @access  Private/Admin
router.put('/:id/geofence', [auth, adminAuth], branchController.updateBranchGeofence);

module.exports = router;
