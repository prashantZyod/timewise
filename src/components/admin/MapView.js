import React, { useState } from 'react';
import { MapPin, Users, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

export default function MapView({ branches, attendanceRecords }) {
  const [selectedBranch, setSelectedBranch] = useState(null);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <Card className="h-full">
            <CardContent className="p-0 h-full">
              {/* This would be replaced with an actual map integration */}
              <div className="relative w-full h-[600px] bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-slate-900">Interactive Map</h3>
                  <p className="text-slate-500 max-w-md mx-auto mt-2">
                    This area will display an interactive map with geofences and staff locations.
                  </p>
                  
                  {/* Mock map pins */}
                  {branches.map((branch) => (
                    <div 
                      key={branch.id}
                      className="absolute p-2 cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                      style={{ 
                        top: `${30 + Math.random() * 40}%`, 
                        left: `${30 + Math.random() * 40}%` 
                      }}
                      onClick={() => setSelectedBranch(branch)}
                    >
                      <div className={`w-4 h-4 rounded-full ${branch.status === 'active' ? 'bg-blue-500' : 'bg-slate-400'}`}>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs font-medium bg-white px-2 py-1 rounded shadow-sm">
                        {branch.name.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Branch Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedBranch ? (
                <div>
                  <h3 className="font-semibold text-slate-900">{selectedBranch.name}</h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedBranch.address}</p>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Status:</span>
                      <span className={`font-medium ${selectedBranch.status === 'active' ? 'text-green-500' : 'text-slate-500'}`}>
                        {selectedBranch.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Staff Count:</span>
                      <span className="font-medium">{selectedBranch.staffCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Geofence Radius:</span>
                      <span className="font-medium">{selectedBranch.radius}m</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Devices</h4>
                    {selectedBranch.devices && selectedBranch.devices.length > 0 ? (
                      <div className="space-y-2">
                        {selectedBranch.devices.map(device => (
                          <div key={device.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-md text-sm">
                            <span>{device.name}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              device.status === 'online' ? 'bg-green-100 text-green-700' :
                              device.status === 'maintenance' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {device.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No devices configured</p>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm transition-colors">
                      Edit Branch
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Select a branch on the map to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center">
            <Clock className="w-4 h-4 mr-2 text-slate-500" /> Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100">
            {attendanceRecords.length > 0 ? (
              attendanceRecords.map(record => (
                <div key={record.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-3">
                      {record.user.profileImage ? (
                        <img 
                          src={record.user.profileImage} 
                          alt={record.user.name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <Users className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{record.user.name}</p>
                      <p className="text-xs text-slate-500">{record.type} at {record.branch.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {record.verification.status === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                    )}
                    <span className="text-xs text-slate-500">
                      {new Date(record.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
