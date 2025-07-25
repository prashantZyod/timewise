import React from 'react';
import { User, Mail, Phone, MapPin, Edit, Building, Calendar, UserCheck, Hash } from 'lucide-react';

export default function ProfileOverview({ profile, fullView = false }) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Profile header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 p-6 relative">
        <div className="flex items-center">
          <img 
            src={profile.profileImage} 
            alt={profile.name} 
            className="w-16 h-16 rounded-full border-4 border-white"
          />
          <div className="ml-4">
            <h2 className="text-xl font-bold text-white">{profile.name}</h2>
            <p className="text-emerald-50">{profile.position}</p>
          </div>
        </div>
        
        <a 
          href="/staff-profile" 
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        >
          <Edit size={18} />
        </a>
      </div>
      
      {/* Profile details */}
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex items-center">
            <Mail className="w-5 h-5 text-slate-400 mr-3" />
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm text-slate-800">{profile.email}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Phone className="w-5 h-5 text-slate-400 mr-3" />
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="text-sm text-slate-800">{profile.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-slate-400 mr-3" />
            <div>
              <p className="text-xs text-slate-500">Branch</p>
              <p className="text-sm text-slate-800">{profile.branch.name}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User className="w-5 h-5 text-slate-400 mr-3" />
            <div>
              <p className="text-xs text-slate-500">Department</p>
              <p className="text-sm text-slate-800">{profile.department}</p>
            </div>
          </div>
        </div>
        
        {/* Manager info */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <p className="text-xs text-slate-500 mb-2">Manager</p>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
              {profile.manager.name.charAt(0)}
            </div>
            <div className="ml-2">
              <p className="text-sm font-medium text-slate-800">{profile.manager.name}</p>
              <p className="text-xs text-slate-500">{profile.manager.position}</p>
            </div>
          </div>
        </div>
        
        {fullView && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 mb-2">Additional Information</p>
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-slate-400 mr-3" />
                <div>
                  <p className="text-xs text-slate-500">Join Date</p>
                  <p className="text-sm text-slate-800">{profile.joinDate}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Building className="w-5 h-5 text-slate-400 mr-3" />
                <div>
                  <p className="text-xs text-slate-500">Address</p>
                  <p className="text-sm text-slate-800">{profile.address}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Hash className="w-5 h-5 text-slate-400 mr-3" />
                <div>
                  <p className="text-xs text-slate-500">Employee ID</p>
                  <p className="text-sm text-slate-800">{profile.employeeId}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <UserCheck className="w-5 h-5 text-slate-400 mr-3" />
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="text-sm text-slate-800 capitalize">{profile.status}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
