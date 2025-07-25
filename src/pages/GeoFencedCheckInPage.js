import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GeoLocationProvider, useGeoLocation } from '../contexts/GeoLocationContext';
import GeoFencedCheckIn from '../components/GeoFencedCheckIn';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { MapPin, Clock, Users, Building, ShieldCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import AttendanceService from '../services/AttendanceService';
import BranchService from '../services/BranchService';
import DeviceService from '../services/DeviceService';

// This wrapper is needed to use the GeoLocation context
const GeoFencedCheckInPageContent = () => {
  const { branchId } = useParams();
  const navigate = useNavigate();
  const [branch, setBranch] = useState(null);
  const [activeAttendance, setActiveAttendance] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // We assume user is available from auth context in the actual implementation
  // For this example, we'll use a mock user
  const user = {
    id: '123',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'staff',
    department: 'Engineering',
    position: 'Developer'
  };
  
  const { currentLocation, isWithinBranchRadius } = useGeoLocation();
  
  // Load branch and check active attendance on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get branch information
        const branchData = await BranchService.getById(branchId);
        if (!branchData) {
          throw new Error('Branch not found');
        }
        setBranch(branchData);
        
        // Check if user has an active attendance record
        const activeRecord = await AttendanceService.getActiveAttendance(user.id);
        setActiveAttendance(activeRecord);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message || 'Failed to load branch information');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [branchId, user.id]);
  
  // Handler for check-in
  const handleCheckIn = async (locationData) => {
    setError(null);
    
    try {
      // Get current device fingerprint (in real implementation)
      // For this example, we'll use a mock device ID
      const deviceId = '456';
      
      // Perform check-in with location
      const checkInData = {
        staff_id: user.id,
        branch_id: branchId,
        device_id: deviceId
      };
      
      const attendance = await AttendanceService.checkInWithLocation(checkInData, locationData);
      setActiveAttendance(attendance);
      setSuccessMessage('Successfully checked in!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      return attendance;
    } catch (err) {
      console.error('Check-in error:', err);
      setError(err.message || 'Failed to check in');
      throw err;
    }
  };
  
  // Handler for check-out
  const handleCheckOut = async (attendanceId, locationData) => {
    setError(null);
    
    try {
      // Perform check-out with location
      const attendance = await AttendanceService.checkOutWithLocation(
        attendanceId, 
        {}, // Additional data if needed
        locationData
      );
      
      // Reset active attendance
      setActiveAttendance(null);
      setSuccessMessage('Successfully checked out!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
      return attendance;
    } catch (err) {
      console.error('Check-out error:', err);
      setError(err.message || 'Failed to check out');
      throw err;
    }
  };
  
  // Format date for display
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Loading</CardTitle>
            <CardDescription>
              Please wait while we load branch information...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  if (error && !branch) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="w-full max-w-md mx-auto border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Error
            </CardTitle>
            <CardDescription>
              Could not load branch information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={() => navigate(-1)} 
              variant="default"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Back button */}
      <Button 
        variant="ghost" 
        className="mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      {/* Success message */}
      {successMessage && (
        <Alert className="mb-4 bg-emerald-500/15 text-emerald-600">
          <ShieldCheck className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      
      {/* Error message */}
      {error && (
        <Alert className="mb-4" variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* Branch info card */}
      {branch && (
        <Card className="mb-6 w-full max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  {branch.name}
                </CardTitle>
                <CardDescription>{branch.address}</CardDescription>
              </div>
              <Badge variant={branch.is_active ? "success" : "secondary"}>
                {branch.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  Radius: {branch.location.radius}m
                </span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  Staff: {branch.staffCount}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  Check-in: {branch.attendance_settings?.checkInStartTime} - {branch.attendance_settings?.checkInEndTime}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>
                  Check-out: {branch.attendance_settings?.checkOutStartTime} - {branch.attendance_settings?.checkOutEndTime}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Active attendance info */}
      {activeAttendance && (
        <Card className="mb-6 w-full max-w-md mx-auto border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">
              Current Check-in Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Checked in at:</span>
                <span className="font-medium">{formatDate(activeAttendance.check_in_time)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Location verified:</span>
                <Badge variant={activeAttendance.location_verified ? "success" : "warning"}>
                  {activeAttendance.location_verified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Geofence status:</span>
                <Badge variant={activeAttendance.is_within_geofence ? "success" : "warning"}>
                  {activeAttendance.is_within_geofence ? 'Within boundary' : 'Outside boundary'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* GeoFenced Check-in/out component */}
      <GeoFencedCheckIn
        user={user}
        branch={branch}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        attendance={activeAttendance}
        isCheckedIn={!!activeAttendance}
      />
    </div>
  );
};

// Wrapper with GeoLocationProvider
const GeoFencedCheckInPage = () => {
  return (
    <GeoLocationProvider>
      <GeoFencedCheckInPageContent />
    </GeoLocationProvider>
  );
};

export default GeoFencedCheckInPage;
