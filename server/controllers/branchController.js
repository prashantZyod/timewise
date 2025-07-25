const Branch = require('../models/Branch');
const { validationResult } = require('express-validator');

// @desc    Create a new branch
// @route   POST /api/branches
// @access  Private/Admin
exports.createBranch = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      location,
      address,
      contactInfo,
      geofence,
      operatingHours
    } = req.body;

    // Create new branch
    const branch = new Branch({
      name,
      location,
      address,
      contactInfo,
      geofence: geofence || {
        radius: 250, // Default radius in meters
        center: location
      },
      operatingHours,
      createdBy: req.user.id
    });

    await branch.save();
    res.status(201).json(branch);
  } catch (err) {
    console.error('Error in createBranch:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get all branches
// @route   GET /api/branches
// @access  Private
exports.getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find()
      .populate('createdBy', ['name', 'email'])
      .sort({ createdAt: -1 });
    
    res.json(branches);
  } catch (err) {
    console.error('Error in getAllBranches:', err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get branch by ID
// @route   GET /api/branches/:id
// @access  Private
exports.getBranchById = async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id)
      .populate('createdBy', ['name', 'email']);

    if (!branch) {
      return res.status(404).json({ msg: 'Branch not found' });
    }

    res.json(branch);
  } catch (err) {
    console.error('Error in getBranchById:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Branch not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Update branch
// @route   PUT /api/branches/:id
// @access  Private/Admin
exports.updateBranch = async (req, res) => {
  try {
    const {
      name,
      location,
      address,
      contactInfo,
      geofence,
      operatingHours,
      isActive
    } = req.body;

    // Find branch by id
    let branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ msg: 'Branch not found' });
    }

    // Build branch object
    const branchFields = {};
    if (name) branchFields.name = name;
    if (location) branchFields.location = location;
    if (address) branchFields.address = address;
    if (contactInfo) branchFields.contactInfo = contactInfo;
    if (geofence) branchFields.geofence = geofence;
    if (operatingHours) branchFields.operatingHours = operatingHours;
    if (isActive !== undefined) branchFields.isActive = isActive;

    // Update branch
    branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { $set: branchFields },
      { new: true }
    ).populate('createdBy', ['name', 'email']);

    res.json(branch);
  } catch (err) {
    console.error('Error in updateBranch:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Branch not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Delete branch
// @route   DELETE /api/branches/:id
// @access  Private/Admin
exports.deleteBranch = async (req, res) => {
  try {
    // Find branch by id
    const branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ msg: 'Branch not found' });
    }

    await Branch.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Branch removed' });
  } catch (err) {
    console.error('Error in deleteBranch:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Branch not found' });
    }
    res.status(500).send('Server error');
  }
};

// @desc    Update branch geofence
// @route   PUT /api/branches/:id/geofence
// @access  Private/Admin
exports.updateBranchGeofence = async (req, res) => {
  try {
    const { center, radius } = req.body;

    // Validate request
    if (!center || !radius) {
      return res.status(400).json({ msg: 'Center coordinates and radius are required' });
    }

    // Find branch by id
    let branch = await Branch.findById(req.params.id);
    if (!branch) {
      return res.status(404).json({ msg: 'Branch not found' });
    }

    // Update geofence
    branch = await Branch.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          'geofence.center': center,
          'geofence.radius': radius 
        } 
      },
      { new: true }
    );

    res.json(branch);
  } catch (err) {
    console.error('Error in updateBranchGeofence:', err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Branch not found' });
    }
    res.status(500).send('Server error');
  }
};
