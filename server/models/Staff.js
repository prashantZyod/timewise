const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  joiningDate: {
    type: Date,
    required: true
  },
  assignedBranch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  status: {
    type: String,
    enum: ['active', 'on_leave', 'terminated', 'suspended'],
    default: 'active'
  },
  profileImage: {
    type: String,
    default: null
  },
  devices: [{
    deviceId: String,
    deviceName: String,
    isApproved: {
      type: Boolean,
      default: false
    },
    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  attendance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendance'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Staff', StaffSchema);
