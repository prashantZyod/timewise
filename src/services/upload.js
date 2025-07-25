import api from './api';

export const uploadService = {
  uploadImage: async (file, type = 'profile') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data.url;
  }
};

export default uploadService;

// In StaffForm.js
import { uploadService } from '../services/upload';

// Inside the form submit handler:
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    let profileImageUrl = formData.profileImage;
    
    // If a new image file was selected
    if (imageFile) {
      profileImageUrl = await uploadService.uploadImage(imageFile);
    }
    
    // Create/update staff with the image URL
    await staffService.create({
      ...formData,
      profileImage: profileImageUrl
    });
    
    navigate('/staff');
  } catch (error) {
    setError('Error saving staff member');
  }
};

// .env.development
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000

// .env.production
REACT_APP_API_URL=https://api.timewise-app.com/api
REACT_APP_SOCKET_URL=https://api.timewise-app.com

// server/routes/branches.js
const express = require('express');
const router = express.Router();
const Branch = require('../models/Branch');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   GET api/branches
// @desc    Get all branches
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/branches/:id
// @desc    Get branch by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const branch = await Branch.findById(req.params.id);
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    res.json(branch);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   POST api/branches
// @desc    Create a branch
// @access  Private/Admin
router.post('/', [
  auth,
  [
    check('name', 'Name is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  // Verify user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  try {
    const newBranch = new Branch({
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      geofenceRadius: req.body.geofenceRadius || 100,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      active: req.body.active !== undefined ? req.body.active : true
    });
    
    const branch = await newBranch.save();
    res.json(branch);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/branches/:id
// @desc    Update a branch
// @access  Private/Admin
router.put('/:id', auth, async (req, res) => {
  // Verify user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  try {
    const branch = await Branch.findById(req.params.id);
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    // Update fields
    if (req.body.name) branch.name = req.body.name;
    if (req.body.address) branch.address = req.body.address;
    if (req.body.phone !== undefined) branch.phone = req.body.phone;
    if (req.body.email !== undefined) branch.email = req.body.email;
    if (req.body.geofenceRadius !== undefined) branch.geofenceRadius = req.body.geofenceRadius;
    if (req.body.latitude !== undefined) branch.latitude = req.body.latitude;
    if (req.body.longitude !== undefined) branch.longitude = req.body.longitude;
    if (req.body.active !== undefined) branch.active = req.body.active;
    
    await branch.save();
    res.json(branch);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/branches/:id
// @desc    Delete a branch
// @access  Private/Admin
router.delete('/:id', auth, async (req, res) => {
  // Verify user is admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }
  
  try {
    const branch = await Branch.findById(req.params.id);
    
    if (!branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    await branch.remove();
    res.json({ message: 'Branch removed' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Branch not found' });
    }
    
    res.status(500).send('Server error');
  }
});

module.exports = router;

// server/models/Branch.js
const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  geofenceRadius: {
    type: Number,
    default: 100
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  active: {
    type: Boolean,
    default: true
  },
  staffCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Branch', BranchSchema);