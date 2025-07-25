import React from 'react';
import { MapPin, Users, Edit, Trash, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export default function BranchCard({ branch, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden hover:border-slate-300 transition-all duration-200">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-slate-900">{branch.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{branch.address}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center text-sm text-slate-600">
                  <Users className="w-4 h-4 mr-1 text-slate-400" /> 
                  {branch.staffCount} staff
                </div>
                <div className="flex items-center text-sm text-slate-600">
                  <MapPin className="w-4 h-4 mr-1 text-slate-400" /> 
                  {branch.radius}m radius
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                branch.status === 'active' ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {branch.status === 'active' ? 'Active' : 'Inactive'}
              </div>
              
              <div className="relative mt-2">
                <button className="p-1 hover:bg-slate-100 rounded-full">
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                </button>
                {/* Dropdown menu would go here */}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex border-t border-slate-100 divide-x divide-slate-100">
          <button 
            onClick={() => onEdit && onEdit(branch)}
            className="flex-1 py-2 text-sm text-center text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Edit className="w-4 h-4 inline-block mr-1" /> Edit
          </button>
          <button 
            onClick={() => onDelete && onDelete(branch)}
            className="flex-1 py-2 text-sm text-center text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash className="w-4 h-4 inline-block mr-1" /> Delete
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
