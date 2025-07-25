import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { 
  MapPin, Users, UserCheck, AlertTriangle, RefreshCw, Calendar, ChevronLeft, ChevronRight,
  Clock, CheckCircle, XCircle
} from 'lucide-react';
import { format, parseISO, addDays, subDays, isValid } from 'date-fns';
import BranchService from '../../services/BranchService';
import AttendanceService from '../../services/AttendanceService';
import GeofenceMapView from './GeofenceMapView';

/**
 * Geofence Monitoring Dashboard Component
 * Displays real-time attendance information with geofence compliance
 */
const GeofenceMonitoringDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branches, setBranches] = useState([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [geofenceStats, setGeofenceStats] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  
  // Load branches on component mount
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const branchList = await BranchService.getAll();
        setBranches(branchList);
        
        if (branchList.length > 0) {
          setSelectedBranchId(branchList[0].id);
          setSelectedBranch(branchList[0]);
        }
      } catch (err) {
        setError('Failed to load branches');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadBranches();
  }, []);
  
  // Load geofence stats when branch or date changes
  useEffect(() => {
    if (!selectedBranchId) return;
    
    const loadGeofenceStats = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const stats = await AttendanceService.getGeofenceStats(selectedBranchId, selectedDate);
        setGeofenceStats(stats);
        
        // Get attendance records for this date and branch
        const startDate = new Date(selectedDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(selectedDate);
        endDate.setHours(23, 59, 59, 999);
        
        const records = await AttendanceService.filter({
          branch_id: selectedBranchId,
          dateRange: { start: startDate, end: endDate }
        });
        
        // Clean up and validate the records before setting them
        const validatedRecords = records.map(record => ({
          ...record,
          // Ensure check_in_time and check_out_time are valid or null
          check_in_time: record.check_in_time ? record.check_in_time : null,
          check_out_time: record.check_out_time ? record.check_out_time : null
        }));
        
        setAttendanceRecords(validatedRecords);
      } catch (err) {
        setError('Failed to load geofence statistics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadGeofenceStats();
  }, [selectedBranchId, selectedDate]);
  
  // Handle branch selection change
  const handleBranchChange = (branchId) => {
    setSelectedBranchId(branchId);
    const branch = branches.find(b => b.id === branchId);
    setSelectedBranch(branch);
  };
  
  // Navigate to previous day
  const goToPreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1));
  };
  
  // Navigate to next day
  const goToNextDay = () => {
    setSelectedDate(prev => addDays(prev, 1));
  };
  
  // Go to today
  const goToToday = () => {
    setSelectedDate(new Date());
  };
  
  // Format date for display
  const formatDate = (date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };
  
  // Format time for display
  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      // Validate the date string format
      const date = parseISO(dateStr);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid time';
      }
      return format(date, 'h:mm a');
    } catch (error) {
      console.warn('Invalid date format:', dateStr, error);
      return 'Invalid time';
    }
  };
  
  // Render loading state
  if (loading && !selectedBranch) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Geofence Monitoring</CardTitle>
          <CardDescription>Loading branch information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-8">
          <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }
  
  // Render error state
  if (error && !selectedBranch) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Geofence Monitoring</CardTitle>
          <CardDescription>An error occurred</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="mt-4 w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Branch selector and date navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Geofence Monitoring Dashboard</CardTitle>
          <CardDescription>
            Monitor attendance with location verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 sm:items-end">
            <div className="w-full sm:w-1/2">
              <Label htmlFor="branch-select" className="mb-2 block">Select Branch</Label>
              <Select value={selectedBranchId} onValueChange={handleBranchChange}>
                <SelectTrigger id="branch-select">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-1/2">
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={goToPreviousDay}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="flex-1" onClick={goToToday}>
                  <Calendar className="mr-2 h-4 w-4" />
                  {formatDate(selectedDate)}
                </Button>
                <Button variant="outline" size="icon" onClick={goToNextDay}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Stats cards */}
      {selectedBranch && geofenceStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <UserCheck className="h-8 w-8 text-primary mr-4" />
                <div>
                  <p className="text-3xl font-bold">{geofenceStats.totalRecords}</p>
                  <p className="text-sm text-muted-foreground">Staff check-ins today</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Within Geofence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-emerald-500 mr-4" />
                <div>
                  <p className="text-3xl font-bold">{geofenceStats.withinGeofence}</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="text-emerald-500 font-medium">
                      {geofenceStats.complianceRate.toFixed(1)}%
                    </span> compliance rate
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Outside Geofence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertTriangle className="h-8 w-8 text-amber-500 mr-4" />
                <div>
                  <p className="text-3xl font-bold">{geofenceStats.outsideGeofence}</p>
                  <p className="text-sm text-muted-foreground">
                    Requires verification
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Geofence Map Visualization */}
      {selectedBranch && (
        <GeofenceMapView 
          branch={selectedBranch} 
          attendanceRecords={attendanceRecords} 
        />
      )}
      
      {/* Attendance records */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>
            Location-verified attendance for {selectedBranch?.name || 'Selected Branch'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {attendanceRecords.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
              <p className="text-muted-foreground">No attendance records found for this date</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <div className="grid grid-cols-6 gap-2 p-3 bg-muted font-medium text-xs">
                <div className="col-span-2">Staff</div>
                <div>Check-in</div>
                <div>Check-out</div>
                <div>Location</div>
                <div>Status</div>
              </div>
              
              <div className="divide-y">
                {attendanceRecords.map(record => (
                  <div key={record.id} className="grid grid-cols-6 gap-2 p-3 text-sm hover:bg-muted/50">
                    <div className="col-span-2">
                      <p className="font-medium">Staff #{record.staff_id}</p>
                      <p className="text-xs text-muted-foreground">Device #{record.device_id}</p>
                    </div>
                    <div className="flex items-center">
                      {record.check_in_time ? (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{formatTime(record.check_in_time)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {record.check_out_time ? (
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span>{formatTime(record.check_out_time)}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                    <div>
                      {record.is_within_geofence ? (
                        <div className="flex items-center text-emerald-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          <span className="text-xs">Within</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-600">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          <span className="text-xs">Outside</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
                        record.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                        record.status === 'late' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {record.status === 'present' ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : record.status === 'late' ? (
                          <Clock className="h-3 w-3 mr-1" />
                        ) : (
                          <XCircle className="h-3 w-3 mr-1" />
                        )}
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex justify-center items-center py-4">
              <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GeofenceMonitoringDashboard;
