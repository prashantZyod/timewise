import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { 
  Smartphone, 
  X, 
  Check, 
  XCircle,
  User,
  Clock,
  ChevronRight,
  Loader2
} from "lucide-react";

const DeviceApprovalQueue = ({ devices, onApprove, onReject, onClose }) => {
  const [loadingStates, setLoadingStates] = useState({});
  
  const handleApprove = async (deviceId) => {
    setLoadingStates(prev => ({ ...prev, [deviceId]: 'approve' }));
    try {
      await onApprove(deviceId);
    } finally {
      setLoadingStates(prev => ({ ...prev, [deviceId]: null }));
    }
  };
  
  const handleReject = async (deviceId) => {
    setLoadingStates(prev => ({ ...prev, [deviceId]: 'reject' }));
    try {
      await onReject(deviceId);
    } finally {
      setLoadingStates(prev => ({ ...prev, [deviceId]: null }));
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2 relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardTitle className="flex items-center text-lg">
          <Clock className="mr-2 h-5 w-5" />
          Pending Device Approvals
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {devices.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No devices pending approval
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Browser / OS
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {devices.map(device => (
                  <tr key={device._id || device.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Smartphone className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{device.name}</div>
                          <div className="text-xs text-gray-500">{device.deviceId}</div>
                          <div className="text-xs text-gray-500">{device.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-500 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {device.owner?.name || "Unknown"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {device.owner?.email || "No email"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {device.createdAt ? new Date(device.createdAt).toLocaleDateString() : "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {device.createdAt ? new Date(device.createdAt).toLocaleTimeString() : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {device.browserInfo?.name || "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {device.osInfo?.name || "Unknown OS"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                          onClick={() => handleReject(device._id || device.id)}
                          disabled={!!loadingStates[device._id || device.id]}
                        >
                          {loadingStates[device._id || device.id] === 'reject' ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                          onClick={() => handleApprove(device._id || device.id)}
                          disabled={!!loadingStates[device._id || device.id]}
                        >
                          {loadingStates[device._id || device.id] === 'approve' ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Check className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500"
                          onClick={() => {
                            // Open device detail view - we can implement this later
                          }}
                        >
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceApprovalQueue;
