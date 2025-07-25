import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { MapPin, Users, Clock, Edit, Trash2, MoreVertical } from "lucide-react";
import { Button } from '../ui/button';

export default function BranchOverview({ branches, onEdit, onDelete }) {
  const [openMenu, setOpenMenu] = useState(null);

  // Toggle action menu for a branch
  const toggleMenu = (branchId) => {
    setOpenMenu(openMenu === branchId ? null : branchId);
  };

  // Handle edit action
  const handleEdit = (branch) => {
    setOpenMenu(null);
    if (onEdit) {
      onEdit(branch.id);
    }
  };

  // Handle delete action
  const handleDelete = (branch) => {
    setOpenMenu(null);
    if (onDelete) {
      onDelete(branch.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Branch Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {branches.map((branch) => (
            <div key={branch.id} className="p-4 border rounded-lg hover:border-slate-300 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-slate-900">{branch.name}</h3>
                  <p className="text-sm text-slate-500">{branch.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={branch.is_active ? "default" : "secondary"}>
                    {branch.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  
                  {/* Action menu */}
                  {(onEdit || onDelete) && (
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={() => toggleMenu(branch.id)}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                      
                      {openMenu === branch.id && (
                        <div className="absolute right-0 mt-1 w-36 bg-white rounded-md shadow-lg z-10 border border-slate-200">
                          {onEdit && (
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                              onClick={() => handleEdit(branch)}
                            >
                              <Edit className="mr-2 h-4 w-4 text-slate-500" />
                              Edit Branch
                            </button>
                          )}
                          {onDelete && (
                            <button
                              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                              onClick={() => handleDelete(branch)}
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                              Delete
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{branch.staffCount || 0} staff</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{branch.location?.radius || branch.radius || 250}m radius</span>
                </div>
              </div>
            </div>
          ))}
          {branches.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No branches configured yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
