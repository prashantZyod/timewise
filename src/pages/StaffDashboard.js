import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight, 
  RefreshCw 
} from 'lucide-react';
import { useStaff } from '../contexts';

// Import components
import StaffScheduleOverview from '../components/staff/StaffScheduleOverview';
import StaffAttendanceHistory from '../components/staff/StaffAttendanceHistory';
import QuickCheckInWidget from '../components/staff/QuickCheckInWidget';
import StaffNotifications from '../components/staff/StaffNotifications';
import ProfileOverview from '../components/staff/ProfileOverview';
import RecentActivities from '../components/staff/RecentActivities';
import Announcements from '../components/staff/Announcements';
import TimeOffRequest from '../components/staff/TimeOffRequest';
import ShiftSwapRequestForm from '../components/staff/ShiftSwapRequestForm';

export default function StaffDashboard() {
  const { 
    profile, 
    attendance, 
    schedule, 
    notifications, 
    loading, 
    unreadNotificationsCount,
    getAttendanceStats,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    requestTimeOff,
    requestShiftSwap
  } = useStaff();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const stats = getAttendanceStats();

  // Simulate a refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when a link is clicked
  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };
  
  // Handle time off request submission
  const handleTimeOffSubmit = async (timeOffData) => {
    const result = await requestTimeOff(timeOffData);
    if (result.success) {
      setActiveModal(null);
    }
  };
  
  // Handle shift swap request submission
  const handleShiftSwapSubmit = async (swapData) => {
    const result = await requestShiftSwap(swapData);
    if (result.success) {
      setActiveModal(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Clock className="text-emerald-500 mr-2" size={24} />
            <h1 className="text-xl font-semibold text-slate-800">ZyOD StaffLogs</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <button 
              className="p-2 text-slate-600 hover:text-emerald-500 transition-colors relative"
              onClick={() => setActiveModal('notifications')}
            >
              <Bell size={20} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
            <a href="/settings" className="p-2 text-slate-600 hover:text-emerald-500 transition-colors">
              <Settings size={20} />
            </a>
            <a href="/login" className="p-2 text-slate-600 hover:text-emerald-500 transition-colors">
              <LogOut size={20} />
            </a>
            <div className="flex items-center ml-4">
              <img 
                src={profile.profileImage} 
                alt={profile.name} 
                className="w-8 h-8 rounded-full border border-emerald-200"
              />
              <span className="ml-2 font-medium text-slate-700">{profile.name}</span>
            </div>
          </div>
          
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-4 py-2">
            <nav className="flex flex-col space-y-2">
              <div className="flex items-center p-2">
                <img 
                  src={profile.profileImage} 
                  alt={profile.name} 
                  className="w-8 h-8 rounded-full border border-emerald-200"
                />
                <span className="ml-2 font-medium text-slate-700">{profile.name}</span>
              </div>
              <button 
                className="flex items-center p-2 hover:bg-slate-50 rounded-md w-full"
                onClick={() => {
                  setActiveModal('notifications');
                  handleNavClick();
                }}
              >
                <Bell size={20} className="text-slate-600 mr-2" />
                <span>Notifications</span>
                {unreadNotificationsCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
              <a 
                href="/settings" 
                className="flex items-center p-2 hover:bg-slate-50 rounded-md"
                onClick={handleNavClick}
              >
                <Settings size={20} className="text-slate-600 mr-2" />
                <span>Settings</span>
              </a>
              <a 
                href="/login" 
                className="flex items-center p-2 hover:bg-slate-50 rounded-md"
                onClick={handleNavClick}
              >
                <LogOut size={20} className="text-slate-600 mr-2" />
                <span>Log Out</span>
              </a>
            </nav>
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        {/* Dashboard Header with Welcome */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome back, {profile.name.split(' ')[0]}</h1>
            <p className="text-slate-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <button 
            className="flex items-center text-sm text-slate-600 hover:text-emerald-500 transition-colors"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={`mr-1 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickCheckInWidget />
                
                <button
                  onClick={() => setActiveModal('timeoff')}
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg flex flex-col items-center justify-center transition-colors"
                >
                  <Calendar className="text-indigo-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-slate-700">Request Time Off</span>
                </button>
                
                <button
                  onClick={() => setActiveModal('shiftswap')}
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg flex flex-col items-center justify-center transition-colors"
                >
                  <RefreshCw className="text-amber-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-slate-700">Swap Shift</span>
                </button>
                
                <a
                  href="/settings" 
                  className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg flex flex-col items-center justify-center transition-colors"
                >
                  <User className="text-blue-500 mb-2" size={24} />
                  <span className="text-sm font-medium text-slate-700">My Profile</span>
                </a>
              </div>
            </div>
            
            {/* Schedule Overview */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-800">My Schedule</h2>
                  <a href="/staff-schedule-view" className="text-sm text-emerald-500 hover:text-emerald-600 font-medium flex items-center">
                    View Full Schedule
                    <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
              <StaffScheduleOverview schedule={schedule} />
            </div>
            
            {/* Attendance History */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-slate-800">Attendance History</h2>
                  <a href="/staff-profile?tab=attendance" className="text-sm text-emerald-500 hover:text-emerald-600 font-medium flex items-center">
                    View Full History
                    <ChevronRight size={16} className="ml-1" />
                  </a>
                </div>
              </div>
              <StaffAttendanceHistory attendance={attendance.slice(0, 7)} />
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            {/* Profile Overview */}
            <ProfileOverview profile={profile} />
            
            {/* Attendance Stats */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-slate-800 mb-4">Attendance Overview</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-50 rounded-lg p-3 text-center">
                  <span className="text-sm text-slate-600">Present</span>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">{stats.presentPercentage}%</div>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <span className="text-sm text-slate-600">On Time</span>
                  <div className="text-2xl font-bold text-amber-600 mt-1">{100 - stats.latePercentage}%</div>
                </div>
              </div>
            </div>
            
            {/* Announcements */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Announcements</h2>
              </div>
              <Announcements 
                announcements={notifications.filter(n => n.type === 'announcement')}
              />
            </div>
            
            {/* Recent Activities */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Recent Activities</h2>
              </div>
              <RecentActivities />
            </div>
          </div>
        </div>
      </main>
      
      {/* Modals */}
      {activeModal === 'notifications' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Notifications</h2>
              <button
                onClick={() => {
                  setActiveModal(null);
                  markAllNotificationsAsRead();
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <StaffNotifications 
              notifications={notifications}
              maxHeight="calc(100vh - 200px)"
              onMarkAsRead={markNotificationAsRead}
            />
          </div>
        </div>
      )}
      
      {activeModal === 'timeoff' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Request Time Off</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <TimeOffRequest 
              onSubmit={handleTimeOffSubmit}
              onCancel={() => setActiveModal(null)}
            />
          </div>
        </div>
      )}
      
      {activeModal === 'shiftswap' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-800">Request Shift Swap</h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            <ShiftSwapRequestForm 
              onSubmit={handleShiftSwapSubmit}
              onCancel={() => setActiveModal(null)}
              schedule={schedule}
            />
          </div>
        </div>
      )}
    </div>
  );
}
