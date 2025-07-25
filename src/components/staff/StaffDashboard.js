import React, { useState, useContext } from 'react';
import { 
  Bell, Menu, X, User, Calendar, Clock, ClipboardCheck, 
  MessageSquare, LogOut, Settings, ChevronDown, Sun, Moon
} from 'lucide-react';
import { useStaff } from '../../contexts';

// Import our custom components
import StaffScheduleOverview from './StaffScheduleOverview';
import StaffAttendanceHistory from './StaffAttendanceHistory';
import QuickCheckInWidget from './QuickCheckInWidget';
import StaffNotifications from './StaffNotifications';
import ProfileOverview from './ProfileOverview';
import RecentActivities from './RecentActivities';
import Announcements from './Announcements';
import TimeOffRequest from './TimeOffRequest';
import ShiftSwapRequestForm from './ShiftSwapRequestForm';

// Create a mock context for theming (in a real app this would be imported)
const ThemeContext = React.createContext({ theme: 'light', toggleTheme: () => {} });

export default function StaffDashboard() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalOpen, setModalOpen] = useState(null);
  
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  // Notification badge count
  const notificationCount = 3;
  
  // Handle modal open/close
  const openModal = (modalType) => {
    setModalOpen(modalType);
  };
  
  const closeModal = () => {
    setModalOpen(null);
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Toggle notifications panel
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };
  
  // Mock user data
  const user = {
    id: 'user123',
    name: 'John Doe',
    role: 'Customer Service Representative',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    branch: 'Main Branch'
  };
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-emerald-600">ZyOD StaffLogs</h1>
              </div>
              
              {/* Desktop navigation */}
              <nav className="hidden md:ml-6 md:flex md:space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`${
                    activeTab === 'dashboard'
                      ? 'border-emerald-500 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`${
                    activeTab === 'schedule'
                      ? 'border-emerald-500 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Schedule
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`${
                    activeTab === 'attendance'
                      ? 'border-emerald-500 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Attendance
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`${
                    activeTab === 'profile'
                      ? 'border-emerald-500 text-slate-900'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Profile
                </button>
              </nav>
            </div>
            
            <div className="flex items-center">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-400 hover:text-slate-500"
              >
                {theme === 'dark' ? (
                  <Sun size={20} />
                ) : (
                  <Moon size={20} />
                )}
              </button>
              
              {/* Notifications button */}
              <div className="ml-4 relative">
                <button
                  onClick={toggleNotifications}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <span className="sr-only">View notifications</span>
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center transform -translate-y-1/4 translate-x-1/4">
                      {notificationCount}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt=""
                    />
                    <span className="hidden md:flex md:items-center ml-2">
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                        {user.name}
                      </span>
                      <ChevronDown
                        className="ml-1 h-4 w-4 text-slate-400"
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                </div>
              </div>
              
              {/* Mobile menu button */}
              <div className="flex items-center md:hidden ml-4">
                <button
                  onClick={toggleMobileMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === 'dashboard'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab('schedule');
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === 'schedule'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Schedule
              </button>
              <button
                onClick={() => {
                  setActiveTab('attendance');
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === 'attendance'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Attendance
              </button>
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeTab === 'profile'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left`}
              >
                Profile
              </button>
            </div>
            
            <div className="pt-4 pb-3 border-t border-slate-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user.avatar}
                    alt=""
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-slate-800">
                    {user.name}
                  </div>
                  <div className="text-sm font-medium text-slate-500">
                    {user.role}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 w-full text-left">
                  <div className="flex items-center">
                    <Settings size={16} className="mr-3" />
                    Settings
                  </div>
                </button>
                <button className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 w-full text-left">
                  <div className="flex items-center">
                    <LogOut size={16} className="mr-3" />
                    Sign out
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Notifications panel */}
        {notificationsOpen && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-md shadow-lg z-20 border border-slate-200 max-h-[600px] overflow-y-auto" style={{ top: '4rem', right: '1rem' }}>
            <div className="p-3 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
                <button
                  onClick={toggleNotifications}
                  className="text-slate-400 hover:text-slate-500"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <StaffNotifications />
          </div>
        )}
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="px-4 sm:px-0">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Quick check-in widget */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <h2 className="text-lg font-medium text-slate-900">Quick Check-In</h2>
                </div>
                <QuickCheckInWidget />
              </div>
              
              {/* Schedule overview */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-slate-900">My Schedule</h2>
                  <button 
                    onClick={() => setActiveTab('schedule')}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                  >
                    View All
                  </button>
                </div>
                <StaffScheduleOverview />
              </div>
              
              {/* Profile overview */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-slate-900">My Profile</h2>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                  >
                    Edit
                  </button>
                </div>
                <ProfileOverview profile={useStaff().profile} />
              </div>
              
              {/* Recent activities */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <h2 className="text-lg font-medium text-slate-900">Recent Activities</h2>
                </div>
                <RecentActivities />
              </div>
              
              {/* Announcements */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <h2 className="text-lg font-medium text-slate-900">Announcements</h2>
                </div>
                <Announcements />
              </div>
              
              {/* Quick actions */}
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                  <h2 className="text-lg font-medium text-slate-900">Quick Actions</h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => openModal('timeoff')}
                    className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Calendar className="h-6 w-6 text-emerald-500 mb-2" />
                    <span className="text-sm font-medium text-slate-700">Request Time Off</span>
                  </button>
                  
                  <button
                    onClick={() => openModal('swap')}
                    className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Clock className="h-6 w-6 text-blue-500 mb-2" />
                    <span className="text-sm font-medium text-slate-700">Swap Shift</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('attendance')}
                    className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <ClipboardCheck className="h-6 w-6 text-purple-500 mb-2" />
                    <span className="text-sm font-medium text-slate-700">View Attendance</span>
                  </button>
                  
                  <button
                    className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <MessageSquare className="h-6 w-6 text-amber-500 mb-2" />
                    <span className="text-sm font-medium text-slate-700">Message Manager</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Schedule tab */}
        {activeTab === 'schedule' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-medium text-slate-900">My Schedule</h2>
              </div>
              <div className="p-4">
                <StaffScheduleOverview fullView={true} />
              </div>
            </div>
          </div>
        )}
        
        {/* Attendance tab */}
        {activeTab === 'attendance' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-medium text-slate-900">Attendance History</h2>
              </div>
              <StaffAttendanceHistory />
            </div>
          </div>
        )}
        
        {/* Profile tab */}
        {activeTab === 'profile' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <h2 className="text-lg font-medium text-slate-900">My Profile</h2>
              </div>
              <div className="p-4">
                <ProfileOverview profile={useStaff().profile} fullView={true} />
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Modals */}
      {modalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-slate-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-slate-900">
                      {modalOpen === 'timeoff' ? 'Request Time Off' : 'Request Shift Swap'}
                    </h3>
                    <div className="mt-4">
                      {modalOpen === 'timeoff' ? <TimeOffRequest /> : <ShiftSwapRequestForm />}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
