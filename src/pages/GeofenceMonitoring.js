import React, { useState } from 'react';
import { MapPin, Search, AlertCircle } from 'lucide-react';

const GeofenceMonitoring = () => {
  const [selectedBranch, setSelectedBranch] = useState('');
  
  // Mock branches data
  const branches = [
    { id: '1', name: 'Main Office' },
    { id: '2', name: 'Downtown Branch' },
    { id: '3', name: 'West Side Location' },
  ];
  
  // Mock staff locations
  const staffLocations = [
    { id: '1', name: 'John Smith', status: 'inside', lastUpdate: '2 min ago' },
    { id: '2', name: 'Jane Doe', status: 'outside', lastUpdate: '5 min ago' },
    { id: '3', name: 'Michael Brown', status: 'inside', lastUpdate: '10 min ago' },
    { id: '4', name: 'Sarah Wilson', status: 'inside', lastUpdate: '12 min ago' },
    { id: '5', name: 'Robert Johnson', status: 'outside', lastUpdate: '15 min ago' },
  ];
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Geofence Monitoring</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Branch
            </label>
            <div className="relative z-20">
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
              >
                <option value="" className="bg-white text-gray-900">All Branches</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id} className="bg-white text-gray-900">
                    {branch.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Staff
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm overflow-hidden h-[400px]">
          <div className="h-full w-full bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500">Geofence Map View</p>
              <p className="text-sm text-gray-400 mt-2">Select a branch to view its geofence</p>
            </div>
          </div>
        </div>
        
        {/* Staff Locations */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Staff Locations</h2>
          </div>
          <div className="overflow-y-auto max-h-[328px]">
            {staffLocations.map(staff => (
              <div key={staff.id} className="p-4 border-b border-gray-100 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      staff.status === 'inside' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{staff.name}</p>
                      <p className="text-xs text-gray-500">
                        {staff.status === 'inside' 
                          ? 'Inside geofence' 
                          : (
                            <span className="flex items-center text-red-600">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Outside geofence
                            </span>
                          )
                        }
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">{staff.lastUpdate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeofenceMonitoring;