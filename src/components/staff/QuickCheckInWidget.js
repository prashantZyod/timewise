import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, MapPin, Camera, Loader2, X } from 'lucide-react';
import { useStaff } from '../../contexts';

export default function QuickCheckInWidget() {
  const { checkIn, checkOut, attendance, loading } = useStaff();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [checkInStatus, setCheckInStatus] = useState(null);
  
  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time as HH:MM
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Check if user is already checked in today
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = attendance.find(record => record.date === today);
  const isCheckedIn = todayRecord && todayRecord.status === 'present' && !todayRecord.checkOutTime;
  const isCheckedOut = todayRecord && todayRecord.status === 'present' && todayRecord.checkOutTime;
  
  // Get user's location
  const getLocation = () => {
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        
        // If we have the location, proceed to the camera
        setShowCamera(true);
      },
      (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enable location services.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out.");
            break;
          default:
            setLocationError("An unknown error occurred.");
            break;
        }
      }
    );
  };
  
  // Handle check in
  const handleCheckIn = async () => {
    if (!capturedImage || !location) {
      return;
    }
    
    const result = await checkIn(capturedImage, location);
    setCheckInStatus(result);
    
    if (result.success) {
      // Reset the form after successful check-in
      setTimeout(() => {
        setCapturedImage(null);
        setShowCamera(false);
        setCheckInStatus(null);
      }, 3000);
    }
  };
  
  // Handle check out
  const handleCheckOut = async () => {
    const result = await checkOut();
    setCheckInStatus(result);
    
    if (result.success) {
      // Reset the status after successful check-out
      setTimeout(() => {
        setCheckInStatus(null);
      }, 3000);
    }
  };
  
  // Simulate camera capture
  const simulateCameraCapture = () => {
    // In a real app, this would use the device camera
    // For this demo, we'll just use a placeholder image
    setCapturedImage("https://i.pravatar.cc/300?img=" + Math.floor(Math.random() * 70));
  };
  
  return (
    <div className="p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-lg flex flex-col items-center justify-center relative">
      {/* Current time */}
      <div className="text-xl font-semibold text-slate-800 mb-2">
        {formatTime(currentTime)}
      </div>
      
      {/* Check in/out status */}
      {isCheckedIn && !isCheckedOut ? (
        <div className="text-xs text-emerald-600 font-medium mb-3 flex items-center">
          <CheckCircle size={14} className="mr-1" />
          Checked in at {todayRecord.checkInTime}
        </div>
      ) : isCheckedOut ? (
        <div className="text-xs text-blue-600 font-medium mb-3 flex items-center">
          <CheckCircle size={14} className="mr-1" />
          Checked out at {todayRecord.checkOutTime}
        </div>
      ) : (
        <div className="text-xs text-slate-500 mb-3">Not checked in yet</div>
      )}
      
      {/* Check in/out button */}
      {!showCamera && !capturedImage && !checkInStatus && (
        <button
          onClick={isCheckedIn && !isCheckedOut ? handleCheckOut : getLocation}
          disabled={loading || isCheckedOut}
          className={`w-full py-3 rounded-md flex items-center justify-center font-medium transition-colors ${
            isCheckedIn && !isCheckedOut
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : isCheckedOut
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white'
          }`}
        >
          {loading ? (
            <Loader2 size={20} className="animate-spin mr-2" />
          ) : isCheckedIn && !isCheckedOut ? (
            <>
              <Clock size={18} className="mr-2" />
              Check Out
            </>
          ) : isCheckedOut ? (
            'Already Checked Out'
          ) : (
            <>
              <Clock size={18} className="mr-2" />
              Check In
            </>
          )}
        </button>
      )}
      
      {/* Location error */}
      {locationError && (
        <div className="mt-2 text-xs text-red-500">
          {locationError}
        </div>
      )}
      
      {/* Camera UI */}
      {showCamera && !capturedImage && (
        <div className="w-full">
          <div className="aspect-video bg-slate-200 rounded-md mb-2 flex items-center justify-center">
            <Camera size={48} className="text-slate-400" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCamera(false)}
              className="flex-1 py-2 bg-slate-200 rounded-md text-slate-700 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={simulateCameraCapture}
              className="flex-1 py-2 bg-emerald-500 text-white rounded-md text-sm font-medium"
            >
              Take Photo
            </button>
          </div>
        </div>
      )}
      
      {/* Captured photo */}
      {capturedImage && !checkInStatus && (
        <div className="w-full">
          <div className="aspect-video bg-slate-200 rounded-md mb-2 overflow-hidden">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCapturedImage(null)}
              className="flex-1 py-2 bg-slate-200 rounded-md text-slate-700 text-sm font-medium"
            >
              Retake
            </button>
            <button
              onClick={handleCheckIn}
              className="flex-1 py-2 bg-emerald-500 text-white rounded-md text-sm font-medium flex items-center justify-center"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin mr-1" />
              ) : (
                <CheckCircle size={16} className="mr-1" />
              )}
              Confirm
            </button>
          </div>
          
          {/* Location display */}
          {location && (
            <div className="mt-2 text-xs text-slate-500 flex items-center">
              <MapPin size={12} className="mr-1" />
              Location captured: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </div>
          )}
        </div>
      )}
      
      {/* Check in/out status message */}
      {checkInStatus && (
        <div className={`w-full p-3 rounded-md mt-2 ${
          checkInStatus.success ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          <div className="flex items-center">
            {checkInStatus.success ? (
              <CheckCircle size={16} className="mr-2" />
            ) : (
              <X size={16} className="mr-2" />
            )}
            <span className="text-sm font-medium">{checkInStatus.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
