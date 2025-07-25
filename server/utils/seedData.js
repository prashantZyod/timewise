const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');
const Staff = require('../models/Staff');
const Branch = require('../models/Branch');
const Device = require('../models/Device');
const Geofence = require('../models/Geofence');
const Attendance = require('../models/Attendance');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/timewise')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data
const createSampleData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Staff.deleteMany({});
    await Branch.deleteMany({});
    await Device.deleteMany({});
    await Geofence.deleteMany({});
    await Attendance.deleteMany({});

    console.log('Previous data cleared');

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('Admin user created');

    // Create staff users
    const staffUser1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      role: 'staff'
    });

    const staffUser2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      role: 'staff'
    });

    console.log('Staff users created');

    // Create branches
    const branch1 = await Branch.create({
      name: 'Main Factory',
      location: {
        latitude: 28.6139,
        longitude: 77.2090
      },
      address: {
        street: '123 Main St',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110001',
        country: 'India'
      },
      contactInfo: {
        phone: '+91 9876543210',
        email: 'main@factory.com'
      },
      geofence: {
        center: {
          latitude: 28.6139,
          longitude: 77.2090
        },
        radius: 250 // in meters
      },
      operatingHours: {
        monday: { start: '09:00', end: '18:00', isActive: true },
        tuesday: { start: '09:00', end: '18:00', isActive: true },
        wednesday: { start: '09:00', end: '18:00', isActive: true },
        thursday: { start: '09:00', end: '18:00', isActive: true },
        friday: { start: '09:00', end: '18:00', isActive: true },
        saturday: { start: '10:00', end: '16:00', isActive: true },
        sunday: { start: '00:00', end: '00:00', isActive: false }
      },
      createdBy: adminUser._id
    });

    const branch2 = await Branch.create({
      name: 'South Factory',
      location: {
        latitude: 28.5355,
        longitude: 77.2410
      },
      address: {
        street: '456 South St',
        city: 'New Delhi',
        state: 'Delhi',
        postalCode: '110020',
        country: 'India'
      },
      contactInfo: {
        phone: '+91 9876543211',
        email: 'south@factory.com'
      },
      geofence: {
        center: {
          latitude: 28.5355,
          longitude: 77.2410
        },
        radius: 250 // in meters
      },
      operatingHours: {
        monday: { start: '09:00', end: '18:00', isActive: true },
        tuesday: { start: '09:00', end: '18:00', isActive: true },
        wednesday: { start: '09:00', end: '18:00', isActive: true },
        thursday: { start: '09:00', end: '18:00', isActive: true },
        friday: { start: '09:00', end: '18:00', isActive: true },
        saturday: { start: '10:00', end: '16:00', isActive: true },
        sunday: { start: '00:00', end: '00:00', isActive: false }
      },
      createdBy: adminUser._id
    });

    console.log('Branches created');

    // Create staff records
    const staff1 = await Staff.create({
      user: staffUser1._id,
      employeeId: 'EMP001',
      position: 'Factory Worker',
      department: 'Production',
      branch: branch1._id,
      contactInfo: {
        phone: '+91 9876543212',
        email: 'john@example.com',
        address: {
          street: '789 Worker St',
          city: 'New Delhi',
          state: 'Delhi',
          postalCode: '110001',
          country: 'India'
        }
      },
      emergencyContact: {
        name: 'Mary Doe',
        relationship: 'Spouse',
        phone: '+91 9876543213'
      },
      joinDate: new Date('2022-01-15')
    });

    const staff2 = await Staff.create({
      user: staffUser2._id,
      employeeId: 'EMP002',
      position: 'Supervisor',
      department: 'Quality Control',
      branch: branch2._id,
      contactInfo: {
        phone: '+91 9876543214',
        email: 'jane@example.com',
        address: {
          street: '101 Supervisor St',
          city: 'New Delhi',
          state: 'Delhi',
          postalCode: '110020',
          country: 'India'
        }
      },
      emergencyContact: {
        name: 'Bob Smith',
        relationship: 'Spouse',
        phone: '+91 9876543215'
      },
      joinDate: new Date('2021-10-10')
    });

    console.log('Staff records created');

    // Create devices
    const device1 = await Device.create({
      deviceId: 'DEV001',
      name: 'John\'s Phone',
      type: 'mobile',
      owner: staff1._id,
      isApproved: true,
      approvedBy: adminUser._id,
      approvedAt: new Date(),
      browserInfo: {
        name: 'Chrome',
        version: '96.0.4664.110',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      },
      osInfo: {
        name: 'iOS',
        version: '14.0'
      },
      lastKnownLocation: {
        latitude: 28.6140,
        longitude: 77.2090,
        accuracy: 15,
        timestamp: new Date()
      }
    });

    const device2 = await Device.create({
      deviceId: 'DEV002',
      name: 'Jane\'s Phone',
      type: 'mobile',
      owner: staff2._id,
      isApproved: true,
      approvedBy: adminUser._id,
      approvedAt: new Date(),
      browserInfo: {
        name: 'Safari',
        version: '14.0',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
      },
      osInfo: {
        name: 'iOS',
        version: '14.0'
      },
      lastKnownLocation: {
        latitude: 28.5356,
        longitude: 77.2411,
        accuracy: 10,
        timestamp: new Date()
      }
    });

    console.log('Devices created');

    // Update staff records with devices
    await Staff.findByIdAndUpdate(staff1._id, {
      $push: { devices: device1._id }
    });

    await Staff.findByIdAndUpdate(staff2._id, {
      $push: { devices: device2._id }
    });

    console.log('Staff records updated with devices');

    // Create geofences
    const geofence1 = await Geofence.create({
      name: 'Main Factory Geofence',
      branch: branch1._id,
      center: {
        latitude: 28.6139,
        longitude: 77.2090
      },
      radius: 250,
      isActive: true,
      operatingHours: {
        monday: { start: '09:00', end: '18:00', isActive: true },
        tuesday: { start: '09:00', end: '18:00', isActive: true },
        wednesday: { start: '09:00', end: '18:00', isActive: true },
        thursday: { start: '09:00', end: '18:00', isActive: true },
        friday: { start: '09:00', end: '18:00', isActive: true },
        saturday: { start: '10:00', end: '16:00', isActive: true },
        sunday: { start: '00:00', end: '00:00', isActive: false }
      },
      createdBy: adminUser._id
    });

    const geofence2 = await Geofence.create({
      name: 'South Factory Geofence',
      branch: branch2._id,
      center: {
        latitude: 28.5355,
        longitude: 77.2410
      },
      radius: 250,
      isActive: true,
      operatingHours: {
        monday: { start: '09:00', end: '18:00', isActive: true },
        tuesday: { start: '09:00', end: '18:00', isActive: true },
        wednesday: { start: '09:00', end: '18:00', isActive: true },
        thursday: { start: '09:00', end: '18:00', isActive: true },
        friday: { start: '09:00', end: '18:00', isActive: true },
        saturday: { start: '10:00', end: '16:00', isActive: true },
        sunday: { start: '00:00', end: '00:00', isActive: false }
      },
      createdBy: adminUser._id
    });

    console.log('Geofences created');

    // Create custom premise geofence
    const customGeofence = await Geofence.create({
      name: 'Custom Premise',
      branch: branch1._id,
      center: {
        latitude: 28.6150,
        longitude: 77.2100
      },
      radius: 250,
      isActive: true,
      customPremise: true,
      createdBy: adminUser._id
    });

    console.log('Custom geofence created');

    // Create sample attendance records
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const attendance1 = await Attendance.create({
      staff: staff1._id,
      branch: branch1._id,
      date: today,
      checkIn: {
        time: new Date(today.getTime() + 9 * 60 * 60 * 1000), // 9 AM
        location: {
          latitude: 28.6140,
          longitude: 77.2091,
          accuracy: 15,
          isWithinGeofence: true,
          distance: 20, // 20 meters from center
          radius: 250,
          locationName: 'Main Factory'
        },
        deviceInfo: {
          deviceId: 'DEV001',
          browser: 'Chrome',
          os: 'iOS'
        }
      },
      status: 'present',
      locationTrackingData: [
        {
          timestamp: new Date(today.getTime() + 9 * 60 * 60 * 1000),
          latitude: 28.6140,
          longitude: 77.2091,
          isWithinGeofence: true,
          distance: 20
        },
        {
          timestamp: new Date(today.getTime() + 12 * 60 * 60 * 1000),
          latitude: 28.6141,
          longitude: 77.2092,
          isWithinGeofence: true,
          distance: 30
        }
      ]
    });

    console.log('Attendance records created');

    console.log('Sample data created successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error creating sample data:', err);
    process.exit(1);
  }
};

// Run the seed function
createSampleData();
