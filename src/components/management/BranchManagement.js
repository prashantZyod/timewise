import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  Building2, 
  PlusCircle, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Map, 
  Users,
  Smartphone
} from "lucide-react";

/**
 * BranchManagement component for the management section.
 * This component handles branch listing, adding, editing and deleting.
 */
const BranchManagement = ({ 
  branchList = [], 
  onAdd, 
  onEdit, 
  onDelete, 
  onSearch 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
  };
  
  const toggleActionMenu = (branchId) => {
    setActionMenuOpen(actionMenuOpen === branchId ? null : branchId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Branch Management</h1>
          <p className="text-slate-500">Manage your organization's branches</p>
        </div>
        <Button onClick={onAdd} className="bg-emerald-600 hover:bg-emerald-700">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Branch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold">{branchList.length}</h3>
              <p className="text-slate-500">Total Branches</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold">
                {branchList.reduce((total, branch) => total + (branch.staffCount || 0), 0)}
              </h3>
              <p className="text-slate-500">Total Staff</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold">
                {branchList.reduce((total, branch) => total + (branch.deviceCount || 0), 0)}
              </h3>
              <p className="text-slate-500">Total Devices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle className="text-lg font-medium flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-slate-600" />
              Branch Directory
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search branches..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full md:w-60"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Branch Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Manager</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Devices</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {branchList.length > 0 ? (
                  branchList.map((branch) => (
                    <tr key={branch.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                            {branch.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{branch.name}</div>
                            <div className="text-sm text-slate-500">{branch.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start">
                          <Map className="h-4 w-4 text-slate-500 mt-0.5 mr-1.5 flex-shrink-0" />
                          <div>
                            <div className="text-sm text-slate-900">{branch.city}</div>
                            <div className="text-xs text-slate-500">{branch.address}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{branch.manager}</div>
                        <div className="text-xs text-slate-500">{branch.managerPhone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1.5 text-blue-500" />
                          {branch.staffCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex items-center">
                          <Smartphone className="h-4 w-4 mr-1.5 text-purple-500" />
                          {branch.deviceCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="relative">
                          <button 
                            onClick={() => toggleActionMenu(branch.id)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <MoreVertical className="h-5 w-5" />
                          </button>
                          {actionMenuOpen === branch.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1" role="menu" aria-orientation="vertical">
                                <button
                                  onClick={() => {
                                    onEdit(branch.id);
                                    toggleActionMenu(null);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 w-full text-left"
                                  role="menuitem"
                                >
                                  <Edit className="mr-3 h-4 w-4 text-slate-500" />
                                  Edit Branch
                                </button>
                                <button
                                  onClick={() => {
                                    onDelete(branch.id);
                                    toggleActionMenu(null);
                                  }}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100 w-full text-left"
                                  role="menuitem"
                                >
                                  <Trash2 className="mr-3 h-4 w-4 text-red-500" />
                                  Delete Branch
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
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 mb-1">No branch records found</p>
                      <p className="text-sm text-slate-400">
                        {searchTerm ? "Try adjusting your search" : "Add branches to get started"}
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

export default BranchManagement;
