import React, { useState, useEffect } from 'react';
import { useAttendance } from '../../contexts/AttendanceContext';
import { useGeoLocation } from '../../contexts/GeoLocationContext';
import { useBranch } from '../../contexts/BranchContext';
import { useStaff } from '../../contexts/StaffContext';
import { MapPin, Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const CheckInForm = () => {
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  
  const { branches } = useBranch();
  const { currentUser } = useStaff();
  const { checkIn, loading: attendanceLoading, error: attendanceError } = useAttendance();
  const { 
    permissionGranted, 
    loading: geoLoading, 
    error: geoError,
    requestPermission 
  } = useGeoLocation();
  
  // Set default branch if user has an assigned branch
  useEffect(() => {
    if (currentUser?.branchId) {
      setSelectedBranchId(currentUser.branchId);
    } else if (branches && branches.length > 0) {
      setSelectedBranchId(branches[0].id);
    }
  }, [currentUser, branches]);

  useEffect(() => {
    // Handle any errors
    if (attendanceError) {
      setStatus({
        type: 'error',
        message: attendanceError
      });
    } else if (geoError) {
      setStatus({
        type: 'error',
        message: geoError
      });
    }
  }, [attendanceError, geoError]);

  const handleCheckIn = async () => {
    if (!selectedBranchId) {
      setStatus({
        type: 'error',
        message: 'Please select a branch'
      });
      return;
    }
    
    setStatus({ type: '', message: '' });
    
    try {
      // If permission is not granted, request it first
      if (permissionGranted === false) {
        const granted = await requestPermission();
        if (!granted) {
          setStatus({
            type: 'error',
            message: 'Location permission is required to check in. Please enable location in your browser settings.'
          });
          return;
        }
      }
      
      // Proceed with check-in
      await checkIn(currentUser.id, selectedBranchId);
      
      setIsCheckedIn(true);
      setStatus({
        type: 'success',
        message: 'You have successfully checked in!'
      });
      
      // Reset after 5 seconds
      setTimeout(() => {
        setIsCheckedIn(false);
        setStatus({ type: '', message: '' });
      }, 5000);
      
    } catch (error) {
      console.error('Check-in failed:', error);
      setStatus({
        type: 'error',
        message: error.message
      });
    }
  };

  const isLoading = attendanceLoading || geoLoading;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Attendance Check-In</h2>
      
      {status.message && (
        <div className={`p-4 mb-4 rounded-md ${
          status.type === 'error' 
            ? 'bg-red-50 text-red-700' 
            : status.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-blue-50 text-blue-700'
        }`}>
          <div className="flex items-start">
            {status.type === 'error' ? (
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <p>{status.message}</p>
          </div>
        </div>
      )}
      
      {!isCheckedIn && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch Location
            </label>
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="">Select a branch</option>
              {branches && branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} - {branch.address}
                </option>
              ))}
            </select>
          </div>
          
          {permissionGranted === false && (
            <div className="mb-4 p-3 bg-yellow-50 text-yellow-700 rounded-md">
              <p className="text-sm">
                Location permission is required for check-in. Please allow location access when prompted.
              </p>
              <button
                onClick={requestPermission}
                className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Request Permission
              </button>
            </div>
          )}
          
          <button
            onClick={handleCheckIn}
            disabled={isLoading || !selectedBranchId}
            className="w-full flex justify-center items-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Clock className="w-5 h-5 mr-2" />
                Check In
              </>
            )}
          </button>
          
          <div className="mt-4 text-sm text-gray-500 flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
            <span>
              You must be within {selectedBranchId && branches ? 
                branches.find(b => b.id === selectedBranchId)?.geofenceRadius || 100 
                : 100}m of the selected branch to check in.
            </span>
          </div>
        </>
      )}
      
      {isCheckedIn && (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Check-In Successful!
          </h3>
          <p className="text-gray-500">
            {new Date().toLocaleTimeString()} - {new Date().toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default CheckInForm;