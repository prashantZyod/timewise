import React, { useState, useEffect } from 'react';
import { useDevice } from "../../contexts/DeviceContext";
import { useStaff } from "../../contexts";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Alert } from "../../components/ui/alert";
import { Smartphone, X, Loader2 } from "lucide-react";

const DeviceRegistrationForm = ({ onClose, onDeviceAdded }) => {
  const { registerDevice } = useDevice();
  const { fetchStaffMembers } = useStaff();
  
  const [formData, setFormData] = useState({
    deviceId: '',
    name: '',
    type: 'mobile',
    staffId: '',
    browserInfo: {
      name: navigator.userAgent.includes('Chrome') ? 'Chrome' : 
            navigator.userAgent.includes('Firefox') ? 'Firefox' : 
            navigator.userAgent.includes('Safari') ? 'Safari' : 'Unknown',
      version: '',
      userAgent: navigator.userAgent
    },
    osInfo: {
      name: navigator.platform,
      version: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [staffLoading, setStaffLoading] = useState(true);
  
  // State to store fetched staff members
  const [availableStaff, setAvailableStaff] = useState([]);
  
  // Fetch staff members if not already loaded
  useEffect(() => {
    const loadStaffMembers = async () => {
      try {
        setStaffLoading(true);
        // If fetchStaffMembers exists and is a function, call it
        if (typeof fetchStaffMembers === 'function') {
          const staffData = await fetchStaffMembers();
          setAvailableStaff(staffData || []);
        } else {
          console.warn('fetchStaffMembers is not available in the StaffContext');
          setAvailableStaff([]); // Set empty array as fallback
        }
      } catch (err) {
        console.error('Error loading staff members:', err);
        setError('Failed to load staff members. Please try again.');
        setAvailableStaff([]);
      } finally {
        setStaffLoading(false);
      }
    };
    
    loadStaffMembers();
  }, [fetchStaffMembers]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await registerDevice(formData);
      onDeviceAdded();
    } catch (err) {
      console.error('Error registering device:', err);
      setError(err.response?.data?.msg || 'Failed to register device');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-lg my-2 sm:my-0">
        <CardHeader className="relative py-3 sm:py-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 sm:right-2 sm:top-2 h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center text-base sm:text-lg pr-8">
            <Smartphone className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Register New Device
          </CardTitle>
        </CardHeader>
        
        <CardContent className="px-3 py-2 sm:px-6 sm:py-4">
          {error && (
            <Alert variant="destructive" className="mb-4 text-sm">
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Device ID *
                  </label>
                  <input
                    type="text"
                    name="deviceId"
                    required
                    className="w-full p-2 border rounded-md text-sm"
                    value={formData.deviceId}
                    onChange={handleChange}
                    placeholder="Unique device identifier"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This should be a unique identifier for the device (e.g., IMEI, Serial Number)
                  </p>
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Device Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full p-2 border rounded-md text-sm"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.g., John's Phone"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Device Type *
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full p-2 border rounded-md text-sm"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="mobile">Mobile</option>
                    <option value="tablet">Tablet</option>
                    <option value="desktop">Desktop</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="col-span-1 sm:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Staff Member *
                  </label>
                  {staffLoading ? (
                    <div className="flex items-center justify-center p-2 border rounded-md text-sm">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading staff...
                    </div>
                  ) : (
                    <select
                      name="staffId"
                      required
                      className="w-full p-2 border rounded-md text-sm"
                      value={formData.staffId}
                      onChange={handleChange}
                    >
                      <option value="">Select Staff Member</option>
                      {availableStaff && availableStaff.length > 0 ? (
                        availableStaff.map(staff => (
                          <option key={staff._id || staff.id} value={staff._id || staff.id}>
                            {staff.name}
                          </option>
                        ))
                      ) : (
                        <option disabled value="">No staff members available</option>
                      )}
                    </select>
                  )}
                </div>
                
                <div className="col-span-1 sm:col-span-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Additional Information
                  </h3>
                  <div className="bg-gray-50 p-2 sm:p-3 rounded-md text-xs sm:text-sm">
                    <p><strong>Browser:</strong> {formData.browserInfo.name}</p>
                    <p><strong>Platform:</strong> {formData.osInfo.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      This information is automatically detected and will be stored with the device.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2 px-3 py-2 sm:px-6 sm:py-4">
          <Button
            variant="outline"
            onClick={onClose}
            size="sm"
            className="text-xs sm:text-sm h-8 sm:h-10"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            size="sm"
            className="text-xs sm:text-sm h-8 sm:h-10"
          >
            {loading && <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />}
            Register Device
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeviceRegistrationForm;
