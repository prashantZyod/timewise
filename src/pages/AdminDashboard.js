import React, { useState, useEffect, useMemo } from "react";
import AttendanceStats from "../components/admin/AttendanceStats";
import AttendanceTable from "../components/admin/AttendanceTable";
import BranchCard from "../components/admin/BranchCard";
import SecurityAlertCard from "../components/admin/SecurityAlertCard";
import MapView from "../components/admin/MapView";
import AnalyticsView from "../components/admin/AnalyticsView";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { 
  Users, 
  Clock, 
  Calendar, 
  Building, 
  MapPin, 
  RefreshCw, 
  Shield, 
  X, 
  UserCheck,
  Search,
  Filter,
  Download
} from "lucide-react";

export default function AdminDashboard() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [viewMode, setViewMode] = useState('dashboard'); // 'dashboard', 'map', 'analytics'
  const [isLoading, setIsLoading] = useState(false);
  const [exportingReport, setExportingReport] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filterCriteria, setFilterCriteria] = useState({ 
    status: '', // 'on-time', 'late'
    verificationType: '', // 'verified', 'warning'
    checkType: '' // 'check-in', 'check-out' 
  });
  
  // Set up a real-time clock that updates every second
  useEffect(() => {
    // Update time immediately on mount
    setCurrentTime(new Date());
    
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(clockInterval);
  }, []);
  
  // Handle clicks outside the filter dropdown
  useEffect(() => {
    if (!showFilterOptions) return;
    
    const handleClickOutside = (event) => {
      if (event.target.closest('.filter-dropdown')) return;
      setShowFilterOptions(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterOptions]);
  
  const [securityAlerts, setSecurityAlerts] = useState([
    {
      id: 1,
      title: "Suspicious login attempt",
      description: "Multiple failed login attempts from unknown device",
      severity: "critical",
      timestamp: new Date().toISOString(),
      user: {
        id: 5,
        name: "Rahul Sharma"
      },
      location: "New Delhi (Outside geofence)"
    },
    {
      id: 2,
      title: "Face verification failed",
      description: "User attempted to check in with failed face verification",
      severity: "warning",
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      user: {
        id: 8,
        name: "Priya Patel"
      },
      location: "ZyOD 7-P (Main Branch)"
    }
  ]);
  
  // Toggle to show/hide security alerts for demo purposes
  const [showSecurityAlerts, setShowSecurityAlerts] = useState(false);
  
  const [branches, setBranches] = useState([
    {
      id: 1,
      name: "ZyOD 7-P (Main Branch)",
      address: "PLOT NO. 7p block B, sector 34, Gurgaon,122004",
      staffCount: 24,
      radius: 100,
      status: "active",
      coordinates: {
        lat: 28.4595,
        lng: 77.0266
      },
      description: "Headquarters and main development center",
      devices: [
        { id: 1, name: "Main Entrance", type: "face-recognition", status: "online" },
        { id: 2, name: "Back Entrance", type: "face-recognition", status: "online" }
      ]
    },
    {
      id: 2,
      name: "ZyOD 580 Factory (Branch Office)",
      address: "PLOT NO. 580 Pace City 2, sector 37, Gurgaon,122004.",
      staffCount: 18,
      radius: 100,
      status: "active",
      coordinates: {
        lat: 28.4394,
        lng: 77.0465
      },
      description: "Manufacturing and R&D facility",
      devices: [
        { id: 3, name: "Main Gate", type: "face-recognition", status: "online" },
        { id: 4, name: "Staff Entrance", type: "face-recognition", status: "maintenance" }
      ]
    },
    {
      id: 3,
      name: "ZyOD Commerce Pvt.Ltd (Branch Office)",
      address: "F-258-B, near Galaxy cinemas, RIICO Industrial Area, Mansarovar, Jaipur Rajasthan",
      staffCount: 0,
      radius: 150,
      status: "inactive",
      coordinates: {
        lat: 26.8526,
        lng: 75.8118
      },
      description: "New branch opening next month",
      devices: []
    },
    {
      id: 4,
      name: "ZyOD Mumbai Office",
      address: "402, Windfall, Sahar Plaza, Andheri East, Mumbai, Maharashtra 400069",
      staffCount: 12,
      radius: 75,
      status: "active",
      coordinates: {
        lat: 19.1136,
        lng: 72.8697
      },
      description: "Sales and marketing office",
      devices: [
        { id: 5, name: "Office Entry", type: "face-recognition", status: "online" }
      ]
    }
  ]);
  
  const [attendanceStats, setAttendanceStats] = useState({
    totalEmployees: 42,
    presentToday: 36,
    absentToday: 5,
    lateToday: 1
  });
  
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      user: {
        id: 3,
        name: "Aditya Kumar",
        position: "Senior Developer",
        profileImage: null
      },
      timestamp: new Date().toISOString(),
      type: "check-in",
      branch: {
        id: 1,
        name: "ZyOD 7-P (Main Branch)"
      },
      status: "on-time",
      verification: {
        status: "verified",
        confidence: 0.98
      }
    },
    {
      id: 2,
      user: {
        id: 7,
        name: "Neha Singh",
        position: "UI/UX Designer",
        profileImage: null
      },
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      type: "check-in",
      branch: {
        id: 1,
        name: "ZyOD 7-P (Main Branch)"
      },
      status: "late",
      verification: {
        status: "verified",
        confidence: 0.95
      }
    },
    {
      id: 3,
      user: {
        id: 12,
        name: "Vikram Reddy",
        position: "Project Manager",
        profileImage: null
      },
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      type: "check-out",
      branch: {
        id: 2,
        name: "ZyOD 580 Factory (Branch Office)"
      },
      status: "on-time",
      verification: {
        status: "warning",
        confidence: 0.82
      }
    }
  ]);
  
  // Memoize filtered records to avoid unnecessary filtering on every render
  const filteredAttendanceRecords = useMemo(() => {
    return attendanceRecords.filter(record => {
      // Search query filter
      const matchesSearch = !searchQuery || 
        record.user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        record.branch.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = !filterCriteria.status || 
        record.status === filterCriteria.status;
      
      // Verification type filter
      const matchesVerification = !filterCriteria.verificationType || 
        record.verification.status === filterCriteria.verificationType;
        
      // Check type filter
      const matchesCheckType = !filterCriteria.checkType || 
        record.type === filterCriteria.checkType;
      
      return matchesSearch && matchesStatus && matchesVerification && matchesCheckType;
    });
  }, [attendanceRecords, searchQuery, filterCriteria]);
  
  // Toggle to show/hide attendance records for demo purposes
  const [showAttendanceRecords, setShowAttendanceRecords] = useState(true);
  
  const handleRefresh = () => {
    // In a real app, this would fetch fresh data from an API
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLastUpdated(new Date());
      
      // Don't automatically toggle alerts - that should be user-controlled
      
      setIsLoading(false);
    }, 800);
  };
  
  const handleExportReport = () => {
    setExportingReport(true);
    
    // Simulate export process
    setTimeout(() => {
      console.log('Exporting report for:', viewMode);
      
      // In a real app, this would trigger a download
      // Using console.log instead of alert for now
      console.log('Report exported successfully!');
      
      setExportingReport(false);
    }, 1500);
  };
  
  const handleEditBranch = (branch) => {
    // In a real app, this would open a modal to edit the branch
    console.log("Edit branch:", branch);
  };
  
  const handleDeleteBranch = (branch) => {
    // In a real app, this would open a confirmation dialog
    console.log("Delete branch:", branch);
  };
  
  const handleDismissAlert = (alertId) => {
    // In a real app, this would make an API call to dismiss the alert
    setSecurityAlerts(securityAlerts.filter(alert => alert.id !== alertId));
  };
  
  const handleViewAlertDetails = (alertId) => {
    // In a real app, this would navigate to the alert details page
    console.log("View alert details:", alertId);
  };
  
  const navigateToStaffCheckIn = () => {
    // In a real app, this would use React Router to navigate
    window.location.href = '/staff-check-in';
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <div className="flex items-center space-x-2">
            <p className="text-slate-500">Real-time attendance monitoring and security management</p>
            <div className="bg-slate-100 px-3 py-1 rounded-full text-sm font-medium text-slate-700 flex items-center">
              <Clock className="w-4 h-4 text-emerald-500 mr-1.5" />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Staff Check In Button */}
          <button
            onClick={navigateToStaffCheckIn}
            className="inline-flex items-center justify-center px-4 py-2 bg-emerald-500 text-white font-medium rounded-md hover:bg-emerald-600 transition-colors"
          >
            <Clock className="w-4 h-4 mr-2" /> Staff Check In
          </button>
        
          {/* View Mode Selector */}
          <div className="bg-slate-100 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('dashboard')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'dashboard' 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map' 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Map View
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'analytics' 
                  ? 'bg-white shadow-sm text-slate-900' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Analytics
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">
              <span className="font-medium">Last updated:</span>{' '}
              {lastUpdated.toLocaleDateString([], {day: '2-digit', month: 'short', year: 'numeric'})}
              {' at '}
              {lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true})}
            </div>
            <button 
              onClick={handleRefresh}
              disabled={isLoading}
              className={`inline-flex items-center justify-center px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} /> 
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
            
            <button 
              onClick={handleExportReport}
              disabled={exportingReport}
              className={`inline-flex items-center justify-center px-3 py-1.5 bg-slate-800 text-white rounded-md hover:bg-slate-700 transition-colors ${exportingReport ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Download className="w-4 h-4 mr-1" /> 
              {exportingReport ? 'Exporting...' : 'Export'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Current Date and Time Display */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-3 md:mb-0">
              <Calendar className="w-6 h-6 text-slate-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-slate-500">Current Date</p>
                <h3 className="text-xl font-bold text-slate-900">
                  {currentTime.toLocaleDateString([], {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}
                </h3>
              </div>
            </div>
            
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-emerald-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-slate-500">Current Time</p>
                <h3 className="text-xl font-bold text-emerald-600">
                  {currentTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true})}
                </h3>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-4 flex items-start">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Staff</p>
              <h3 className="text-2xl font-bold text-slate-900">{attendanceStats.totalEmployees}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-start">
            <div className="bg-green-50 p-3 rounded-full mr-4">
              <UserCheck className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Present Today</p>
              <h3 className="text-2xl font-bold text-slate-900">{attendanceStats.presentToday}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-start">
            <div className="bg-red-50 p-3 rounded-full mr-4">
              <X className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Absent Today</p>
              <h3 className="text-2xl font-bold text-slate-900">{attendanceStats.absentToday}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-start">
            <div className="bg-yellow-50 p-3 rounded-full mr-4">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Late Today</p>
              <h3 className="text-2xl font-bold text-slate-900">{attendanceStats.lateToday}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conditional rendering based on viewMode */}
      {viewMode === 'dashboard' && (
        <>
          {/* Security Alerts Section */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-slate-500" /> Security Alerts
                </CardTitle>
                <button 
                  onClick={() => setShowSecurityAlerts(!showSecurityAlerts)}
                  className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                >
                  {showSecurityAlerts ? 'Hide Alerts' : 'Show Alerts'}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {showSecurityAlerts && securityAlerts.length > 0 ? (
                <div className="space-y-3">
                  {securityAlerts.map(alert => (
                    <SecurityAlertCard 
                      key={alert.id} 
                      alert={alert} 
                      onDismiss={handleDismissAlert}
                      onViewDetails={handleViewAlertDetails}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No security alerts at this time</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Branch Overview Section */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-slate-500" /> Branch Overview
                </CardTitle>
                <button 
                  onClick={() => {
                    console.log("Add New Branch clicked");
                    // In a real app, this would open a modal to add a new branch
                  }}
                  className="inline-flex items-center justify-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  <Building className="w-4 h-4 mr-1" /> Add New Branch
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {branches.map(branch => (
                  <BranchCard 
                    key={branch.id} 
                    branch={branch} 
                    onEdit={handleEditBranch}
                    onDelete={handleDeleteBranch}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Real-time Attendance Section */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-slate-500" /> Real-time Attendance
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search staff..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                    />
                  </div>
                  <div className="relative filter-dropdown">
                    <button 
                      onClick={() => setShowFilterOptions(!showFilterOptions)}
                      className={`inline-flex items-center justify-center px-3 py-1.5 ${
                        Object.values(filterCriteria).some(value => value !== '') 
                          ? 'bg-blue-50 border-blue-200 text-blue-600' 
                          : 'bg-white border-slate-200'
                      } border rounded-md hover:bg-slate-50 transition-colors`}
                    >
                      <Filter className="w-4 h-4 mr-1" /> 
                      {Object.values(filterCriteria).some(value => value !== '') ? 'Filters Active' : 'Filter'}
                    </button>
                    
                    {showFilterOptions && (
                      <div className="absolute right-0 mt-2 bg-white rounded-md shadow-lg border border-slate-200 z-10 w-64 p-3 filter-dropdown">
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select 
                              value={filterCriteria.status}
                              onChange={(e) => setFilterCriteria({...filterCriteria, status: e.target.value})}
                              className="w-full text-sm border border-slate-200 rounded-md p-1.5"
                            >
                              <option value="">All</option>
                              <option value="on-time">On Time</option>
                              <option value="late">Late</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Verification</label>
                            <select 
                              value={filterCriteria.verificationType}
                              onChange={(e) => setFilterCriteria({...filterCriteria, verificationType: e.target.value})}
                              className="w-full text-sm border border-slate-200 rounded-md p-1.5"
                            >
                              <option value="">All</option>
                              <option value="verified">Verified</option>
                              <option value="warning">Warning</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Check Type</label>
                            <select 
                              value={filterCriteria.checkType}
                              onChange={(e) => setFilterCriteria({...filterCriteria, checkType: e.target.value})}
                              className="w-full text-sm border border-slate-200 rounded-md p-1.5"
                            >
                              <option value="">All</option>
                              <option value="check-in">Check In</option>
                              <option value="check-out">Check Out</option>
                            </select>
                          </div>
                          <div className="flex justify-between">
                            <button 
                              onClick={() => {
                                setFilterCriteria({ status: '', verificationType: '', checkType: '' });
                                setShowFilterOptions(false);
                              }}
                              className="text-sm text-slate-600 hover:text-slate-900"
                            >
                              Clear Filters
                            </button>
                            <button 
                              onClick={() => setShowFilterOptions(false)}
                              className="text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setShowAttendanceRecords(!showAttendanceRecords)}
                    className="inline-flex items-center justify-center px-3 py-1.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    {showAttendanceRecords ? 'Hide' : 'Show'} Records
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {showAttendanceRecords && filteredAttendanceRecords.length > 0 ? (
                <AttendanceTable 
                  records={filteredAttendanceRecords} 
                  onApprove={(id) => console.log('Approve record:', id)}
                  onReject={(id) => console.log('Reject record:', id)}
                  onDetails={(id) => console.log('View details:', id)}
                />
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">
                    {searchQuery && attendanceRecords.length > 0 
                      ? "No matches found for your search. Try a different query." 
                      : "No attendance records found"}
                  </p>
                  {searchQuery && attendanceRecords.length > 0 ? (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="mt-4 inline-flex items-center justify-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Clear Search
                    </button>
                  ) : (
                    <button 
                      onClick={() => setShowAttendanceRecords(true)}
                      className="mt-4 inline-flex items-center justify-center px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Show Demo Records
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
      
      {viewMode === 'map' && (
        <MapView 
          branches={branches} 
          attendanceRecords={attendanceRecords}
        />
      )}
      
      {viewMode === 'analytics' && (
        <AnalyticsView 
          attendanceStats={attendanceStats}
          branches={branches}
        />
      )}
    </div>
  );
}
