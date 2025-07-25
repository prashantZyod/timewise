import React, { useState, useEffect } from "react";
import { useDevice } from "../contexts/DeviceContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import { 
  Smartphone, 
  PlusCircle, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Filter
} from "lucide-react";
import DeviceRegistrationForm from "../components/management/DeviceRegistrationForm";
import DeviceDetailView from "../components/management/DeviceDetailView";
import DeviceApprovalQueue from "../components/management/DeviceApprovalQueue";

export default function DeviceManagement() {
  const { 
    devices, 
    loading, 
    error, 
    fetchDevices, 
    approveDevice, 
    rejectDevice, 
    deleteDevice 
  } = useDevice();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [showApprovalQueue, setShowApprovalQueue] = useState(false);
  const [operationResult, setOperationResult] = useState({ type: "", message: "" });

  // Filter devices based on search term and status filter
  const filteredDevices = devices.filter(device => {
    const matchesSearch = 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.owner?.name && device.owner.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === "all") return matchesSearch;
    if (filterStatus === "approved") return matchesSearch && device.isApproved;
    if (filterStatus === "pending") return matchesSearch && !device.isApproved;
    return matchesSearch;
  });

  // Count pending approvals
  const pendingApprovalsCount = devices.filter(device => !device.isApproved).length;

  // Handle device operations
  const handleApproveDevice = async (deviceId) => {
    try {
      await approveDevice(deviceId);
      setOperationResult({
        type: "success",
        message: "Device approved successfully"
      });
    } catch (err) {
      setOperationResult({
        type: "error",
        message: `Failed to approve device: ${err.message}`
      });
    }
  };

  const handleRejectDevice = async (deviceId) => {
    try {
      await rejectDevice(deviceId);
      setOperationResult({
        type: "success",
        message: "Device rejected successfully"
      });
    } catch (err) {
      setOperationResult({
        type: "error",
        message: `Failed to reject device: ${err.message}`
      });
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      await deleteDevice(deviceId);
      setOperationResult({
        type: "success",
        message: "Device deleted successfully"
      });
    } catch (err) {
      setOperationResult({
        type: "error",
        message: `Failed to delete device: ${err.message}`
      });
    }
  };

  const handleDeviceAdded = () => {
    setIsAddModalOpen(false);
    fetchDevices();
    setOperationResult({
      type: "success",
      message: "Device registered successfully"
    });
  };

  // Clear result message after 5 seconds
  useEffect(() => {
    if (operationResult.message) {
      const timer = setTimeout(() => {
        setOperationResult({ type: "", message: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [operationResult]);

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Device Management</h1>
        <Button 
          variant="outline" 
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 md:mt-0 inline-flex items-center"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Register New Device
        </Button>
      </div>
      
      {/* Result message */}
      {operationResult.message && (
        <Alert 
          variant={operationResult.type === "error" ? "destructive" : "default"}
          className="mb-4"
        >
          {operationResult.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 mr-2 inline" />
          ) : (
            <XCircle className="h-4 w-4 mr-2 inline" />
          )}
          {operationResult.message}
        </Alert>
      )}

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search devices..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-64">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Approval Queue */}
      {showApprovalQueue && (
        <DeviceApprovalQueue
          devices={devices.filter(device => !device.isApproved)}
          onApprove={handleApproveDevice}
          onReject={handleRejectDevice}
          onClose={() => setShowApprovalQueue(false)}
        />
      )}
      
      {/* Device List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registered
                </th>
                <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDevices.map(device => (
                <tr key={device._id || device.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Smartphone className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {device.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {device.deviceId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {device.owner?.name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {device.staffId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(device.status)}`}>
                      {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {device.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(device.registeredOn).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {device.status === 'pending' ? (
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1 h-8"
                          onClick={() => handleApproveDevice(device._id || device.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="text-xs px-2 py-1 h-8"
                          onClick={() => handleRejectDevice(device._id || device.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-xs px-2 py-1 h-8"
                        onClick={() => {
                          setSelectedDevice(device);
                          setIsDetailViewOpen(true);
                        }}
                      >
                        Details
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Device Registration Modal */}
      {isAddModalOpen && (
        <DeviceRegistrationForm
          onClose={() => setIsAddModalOpen(false)}
          onDeviceAdded={handleDeviceAdded}
        />
      )}
      
      {/* Device Detail Modal */}
      {isDetailViewOpen && selectedDevice && (
        <DeviceDetailView
          device={selectedDevice}
          onClose={() => {
            setIsDetailViewOpen(false);
            setSelectedDevice(null);
          }}
          onApprove={handleApproveDevice}
          onReject={handleRejectDevice}
          onDelete={handleDeleteDevice}
        />
      )}
    </div>
  );
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
