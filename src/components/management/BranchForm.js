import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Calendar 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/card';
import { Label } from '../ui/label';

/**
 * Branch Form component for adding/editing branches
 */
const BranchForm = ({ 
  branch = null, 
  onSubmit, 
  onCancel 
}) => {
  const isEditing = !!branch;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    manager: '',
    managerPhone: '',
    manager_email: '',
    latitude: '',
    longitude: '',
    radius: 250,
    is_active: true
  });

  const [errors, setErrors] = useState({});

  // Load branch data when editing
  useEffect(() => {
    if (branch) {
      setFormData({
        name: branch.name || '',
        code: branch.code || '',
        address: branch.address || '',
        city: branch.city || '',
        manager: branch.manager || '',
        managerPhone: branch.managerPhone || '',
        manager_email: branch.manager_email || '',
        latitude: branch.location?.latitude || branch.latitude || '',
        longitude: branch.location?.longitude || branch.longitude || '',
        radius: branch.location?.radius || branch.radius || 250,
        is_active: branch.is_active !== undefined ? branch.is_active : true
      });
    }
  }, [branch]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handle number inputs (latitude, longitude, radius)
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : parseFloat(value)
    }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Branch name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    // Validate latitude and longitude as required fields
    if (formData.latitude === '' || isNaN(parseFloat(formData.latitude))) {
      newErrors.latitude = 'Valid latitude is required';
    } else if (parseFloat(formData.latitude) < -90 || parseFloat(formData.latitude) > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    
    if (formData.longitude === '' || isNaN(parseFloat(formData.longitude))) {
      newErrors.longitude = 'Valid longitude is required';
    } else if (parseFloat(formData.longitude) < -180 || parseFloat(formData.longitude) > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (formData.latitude === '' || isNaN(formData.latitude)) {
      newErrors.latitude = 'Valid latitude is required';
    } else if (formData.latitude < -90 || formData.latitude > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    
    if (formData.longitude === '' || isNaN(formData.longitude)) {
      newErrors.longitude = 'Valid longitude is required';
    } else if (formData.longitude < -180 || formData.longitude > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }
    
    if (formData.radius === '' || isNaN(formData.radius) || formData.radius <= 0) {
      newErrors.radius = 'Radius must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Prepare data for submission
    const branchData = {
      ...formData,
      location: {
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        radius: parseFloat(formData.radius),
        address: formData.address
      }
    };
    
    if (isEditing) {
      branchData.id = branch.id;
    }
    
    onSubmit(branchData);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="mr-2 h-5 w-5" />
          {isEditing ? 'Edit Branch' : 'Add New Branch'}
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Branch Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Branch Name <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Main Branch"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Branch Code */}
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium">
                Branch Code
              </Label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                className="px-4 py-2 w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="MB001"
              />
            </div>
            
            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.address ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                  }`}
                  placeholder="123 Main Street"
                  rows={2}
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
            
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City <span className="text-red-500">*</span>
              </Label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className={`px-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.city ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                }`}
                placeholder="City"
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Manager */}
            <div className="space-y-2">
              <Label htmlFor="manager" className="text-sm font-medium">
                Branch Manager
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="manager"
                  name="manager"
                  type="text"
                  value={formData.manager}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            {/* Manager Phone */}
            <div className="space-y-2">
              <Label htmlFor="managerPhone" className="text-sm font-medium">
                Manager Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="managerPhone"
                  name="managerPhone"
                  type="tel"
                  value={formData.managerPhone}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1-555-123-4567"
                />
              </div>
            </div>
            
            {/* Manager Email */}
            <div className="space-y-2">
              <Label htmlFor="manager_email" className="text-sm font-medium">
                Manager Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="manager_email"
                  name="manager_email"
                  type="email"
                  value={formData.manager_email}
                  onChange={handleChange}
                  className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="manager@example.com"
                />
              </div>
            </div>
          </div>
          
          {/* Geofencing Section */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-base font-medium mb-4 flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Geofencing Settings
            </h3>
            
            {/* Use Current Location */}
            <div className="mb-4">
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setFormData(prev => ({
                          ...prev,
                          latitude: position.coords.latitude,
                          longitude: position.coords.longitude
                        }));
                        
                        // Clear any location errors
                        if (errors.latitude || errors.longitude) {
                          setErrors(prev => ({
                            ...prev,
                            latitude: null,
                            longitude: null
                          }));
                        }
                      },
                      (error) => {
                        console.error('Error getting location:', error);
                        alert('Could not get your current location. Please enter coordinates manually.');
                      },
                      {
                        enableHighAccuracy: true,
                        timeout: 5000,
                        maximumAge: 0
                      }
                    );
                  } else {
                    alert('Geolocation is not supported by this browser. Please enter coordinates manually.');
                  }
                }}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Use Current Location
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Latitude */}
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-sm font-medium">
                  Latitude <span className="text-red-500">*</span>
                </Label>
                <input
                  id="latitude"
                  name="latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={handleNumberChange}
                  className={`px-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.latitude ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                  }`}
                  placeholder="37.7749"
                />
                {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
              </div>
              
              {/* Longitude */}
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-sm font-medium">
                  Longitude <span className="text-red-500">*</span>
                </Label>
                <input
                  id="longitude"
                  name="longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={handleNumberChange}
                  className={`px-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.longitude ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                  }`}
                  placeholder="-122.4194"
                />
                {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
              </div>
              
              {/* Radius */}
              <div className="space-y-2">
                <Label htmlFor="radius" className="text-sm font-medium">
                  Radius (meters) <span className="text-red-500">*</span>
                </Label>
                <input
                  id="radius"
                  name="radius"
                  type="number"
                  min="1"
                  value={formData.radius}
                  onChange={handleNumberChange}
                  className={`px-4 py-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.radius ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
                  }`}
                  placeholder="250"
                />
                {errors.radius && <p className="text-red-500 text-xs mt-1">{errors.radius}</p>}
              </div>
            </div>
          </div>
          
          {/* Active Status */}
          <div className="flex items-center space-x-2 pt-4">
            <input
              id="is_active"
              name="is_active"
              type="checkbox"
              checked={formData.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="is_active" className="text-sm font-medium">
              Branch is active
            </Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t border-slate-200 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Branch' : 'Create Branch'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default BranchForm;
