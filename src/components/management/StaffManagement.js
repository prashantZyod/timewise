import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Check, 
  X 
} from "lucide-react";

/**
 * StaffManagement component for the management section.
 * This component handles staff listing, adding, editing and deleting.
 */
const StaffManagement = ({ 
  staffList = [], 
  onAdd, 
  onEdit, 
  onDelete, 
  onView,
  onSearch, 
  onFilter 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };
  
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (onFilter) {
      onFilter(status);
    }
  };
  
  const toggleActionMenu = (staffId) => {
    setActionMenuOpen(actionMenuOpen === staffId ? null : staffId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-500">Manage your organization's staff</p>
        </div>
        <Button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5 text-slate-600" />
              Staff Directory
            </CardTitle>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={filterStatus === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('all')}
                >
                  All
                </Button>
                <Button 
                  variant={filterStatus === 'active' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('active')}
                >
                  Active
                </Button>
                <Button 
                  variant={filterStatus === 'inactive' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleFilterChange('inactive')}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Position</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Branch</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {staffList.length > 0 ? (
                  staffList.map((staff) => (
                    <tr key={staff.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                            {staff.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{staff.name}</div>
                            <div className="text-sm text-slate-500">{staff.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {staff.position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {staff.branch}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          staff.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-800'
                        }`}>
                          {staff.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button 
                            onClick={() => toggleActionMenu(staff.id)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {actionMenuOpen === staff.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1" role="menu" aria-orientation="vertical">
                                <button
                                  onClick={() => {
                                    onView(staff.id);
                                    toggleActionMenu(null);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full text-left"
                                  role="menuitem"
                                >
                                  <Eye className="mr-3 h-4 w-4 text-slate-500" />
                                  View Profile
                                </button>
                                <button
                                  onClick={() => {
                                    onEdit(staff.id);
                                    toggleActionMenu(null);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full text-left"
                                  role="menuitem"
                                >
                                  <Edit className="mr-3 h-4 w-4 text-slate-500" />
                                  Edit Staff
                                </button>
                                <button
                                  onClick={() => {
                                    onDelete(staff.id);
                                    toggleActionMenu(null);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100 w-full text-left"
                                  role="menuitem"
                                >
                                  <Trash2 className="mr-3 h-4 w-4 text-red-500" />
                                  Delete Staff
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 mb-1">No staff records found</p>
                      <p className="text-sm text-slate-400">
                        {searchTerm ? "Try adjusting your search" : "Add staff members to get started"}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffManagement;
