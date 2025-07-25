const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop', 'other'],
    default: 'mobile'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  browserInfo: {
    name: String,
    version: String,
    userAgent: String
  },
  osInfo: {
    name: String,
    version: String
  },
  lastKnownLocation: {
    latitude: Number,
    longitude: Number,
    accuracy: Number,
    timestamp: Date
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  blockedReason: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Indexes for efficient querying
DeviceSchema.index({ owner: 1 });
DeviceSchema.index({ deviceId: 1 }, { unique: true });

module.exports = mongoose.model('Device', DeviceSchema);
