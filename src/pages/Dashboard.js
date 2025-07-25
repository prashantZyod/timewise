import React from 'react';
import CheckInForm from '../components/attendance/CheckInForm';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Check-in component */}
        <div className="md:col-span-1">
          <CheckInForm />
        </div>
        
        {/* Other dashboard components */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Staff Overview</h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Today</p>
                  <p className="text-2xl font-bold text-green-600">18</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Attendance Today</h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">On Time</p>
                  <p className="text-2xl font-bold text-green-600">15</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Late</p>
                  <p className="text-2xl font-bold text-amber-600">3</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Absent</p>
                  <p className="text-2xl font-bold text-red-600">6</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Branches</h2>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total Branches</p>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Branches</p>
                  <p className="text-2xl font-bold text-green-600">5</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Stream */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start pb-4 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                      {i % 2 === 0 ? "JS" : "AM"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {i % 2 === 0 ? "John Smith" : "Alice Miller"} {i % 3 === 0 ? "checked in" : "checked out"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {i} hour{i !== 1 ? "s" : ""} ago at Main Branch
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Notifications */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Notifications</h2>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-3 bg-blue-50 text-blue-800 rounded-md">
                    <p className="text-sm font-medium">
                      {i === 1 ? "New staff member added" : i === 2 ? "Device registration request" : "Geofence breach detected"}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {i} hour{i !== 1 ? "s" : ""} ago
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;