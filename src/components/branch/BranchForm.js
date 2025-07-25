import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBranch } from '../../contexts';
import { ChevronLeft, Save, MapPin, Loader2 } from 'lucide-react';

const BranchForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Call useBranch unconditionally at the top level
  const { getBranchById, createBranch, updateBranch, loading, error: contextError } = useBranch();
  
  // Local state for form data and errors
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    geofenceRadius: 100,
    latitude: '',
    longitude: '',
    active: true
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  // Fetch branch data if in edit mode
  useEffect(() => {
    if (isEditMode && id && getBranchById) {
      try {
        const branch = getBranchById(id);
        if (branch) {
          setFormData({
            name: branch.name || '',
            address: branch.address || '',
            phone: branch.phone || '',
            email: branch.email || '',
            geofenceRadius: branch.geofenceRadius || 100,
            latitude: branch.latitude || '',
            longitude: branch.longitude || '',
            active: branch.active !== undefined ? branch.active : true
          });
        } else {
          setLocalError("Branch not found. Please try again.");
        }
      } catch (err) {
        console.error("Error fetching branch details:", err);
        setLocalError("Could not load branch details. Please try again.");
      }
    }
  }, [id, isEditMode, getBranchById]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Branch name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.latitude && (isNaN(formData.latitude) || formData.latitude < -90 || formData.latitude > 90)) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    
    if (formData.longitude && (isNaN(formData.longitude) || formData.longitude < -180 || formData.longitude > 180)) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    
    if (!validateForm()) {
      return;
    }
    
    if (!createBranch || !updateBranch) {
      setLocalError("Branch service is not available. Please try again later.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode) {
        await updateBranch(id, formData);
      } else {
        await createBranch(formData);
      }
      navigate('/branches');
    } catch (error) {
      console.error('Error saving branch:', error);
      setLocalError("Failed to save branch. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Determine which error to display - context error or local error
  const displayError = localError || contextError;
  
  if (loading && isEditMode) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/branches')}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditMode ? 'Edit Branch' : 'Add New Branch'}
        </h1>
      </div>
      
      {displayError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {displayError}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Branch Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address*
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.address && (
                <p className="mt-1 text-sm text-red-500">{errors.address}</p>
              )}
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Geofence Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geofence Radius (meters)
              </label>
              <input
                type="number"
                name="geofenceRadius"
                min="10"
                max="1000"
                value={formData.geofenceRadius}
                onChange={handleNumberChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Coordinates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="e.g. 40.7128"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.latitude ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.latitude && (
                <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="e.g. -74.0060"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.longitude ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.longitude && (
                <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>
              )}
            </div>
            
            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/branches')}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Branch
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BranchForm;