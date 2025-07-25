const Geofence = require('../models/Geofence');
const Branch = require('../models/Branch');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all geofences
// @route   GET /api/geofences
// @access  Private/Admin & Staff
exports.getGeofences = asyncHandler(async (req, res, next) => {
  // Query parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const search = req.query.search;

  // Build query
  let query = {};
  
  // Search by name
  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  // Execute query
  const total = await Geofence.countDocuments(query);
  
  const geofences = await Geofence.find(query)
    .populate('branch', 'name location')
    .skip(startIndex)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res.status(200).json({
    success: true,
    count: geofences.length,
    pagination,
    total,
    data: geofences
  });
});

// @desc    Get single geofence
// @route   GET /api/geofences/:id
// @access  Private/Admin & Staff
exports.getGeofence = asyncHandler(async (req, res, next) => {
  const geofence = await Geofence.findById(req.params.id).populate('branch', 'name location');

  if (!geofence) {
    return next(new ErrorResponse(`Geofence not found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: geofence
  });
});

// @desc    Create a new geofence
// @route   POST /api/geofences
// @access  Private/Admin
exports.createGeofence = asyncHandler(async (req, res, next) => {
  const { name, branch, coordinates, radius, isActive } = req.body;

  // Check if branch exists
  const branchExists = await Branch.findById(branch);
  if (!branchExists) {
    return next(new ErrorResponse(`Branch not found with id ${branch}`, 404));
  }

  // Create geofence
  const geofence = await Geofence.create({
    name,
    branch,
    coordinates,
    radius,
    isActive: isActive !== undefined ? isActive : true,
    createdBy: req.user.id
  });

  res.status(201).json({
    success: true,
    data: geofence
  });
});

// @desc    Update geofence
// @route   PUT /api/geofences/:id
// @access  Private/Admin
exports.updateGeofence = asyncHandler(async (req, res, next) => {
  let geofence = await Geofence.findById(req.params.id);

  if (!geofence) {
    return next(new ErrorResponse(`Geofence not found with id ${req.params.id}`, 404));
  }

  // If branch is being updated, check if it exists
  if (req.body.branch) {
    const branchExists = await Branch.findById(req.body.branch);
    if (!branchExists) {
      return next(new ErrorResponse(`Branch not found with id ${req.body.branch}`, 404));
    }
  }

  // Update geofence
  geofence = await Geofence.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: geofence
  });
});

// @desc    Delete geofence
// @route   DELETE /api/geofences/:id
// @access  Private/Admin
exports.deleteGeofence = asyncHandler(async (req, res, next) => {
  const geofence = await Geofence.findById(req.params.id);

  if (!geofence) {
    return next(new ErrorResponse(`Geofence not found with id ${req.params.id}`, 404));
  }

  await geofence.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get geofences for a specific branch
// @route   GET /api/geofences/branch/:branchId
// @access  Private/Admin & Staff
exports.getBranchGeofences = asyncHandler(async (req, res, next) => {
  const { branchId } = req.params;

  // Check if branch exists
  const branchExists = await Branch.findById(branchId);
  if (!branchExists) {
    return next(new ErrorResponse(`Branch not found with id ${branchId}`, 404));
  }

  const geofences = await Geofence.find({ branch: branchId });

  res.status(200).json({
    success: true,
    count: geofences.length,
    data: geofences
  });
});
