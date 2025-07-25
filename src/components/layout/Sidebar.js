import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  BarChart2, 
  MapPin, 
  Building, 
  Smartphone,
  ClipboardList,
  Clock 
} from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="fixed w-64 h-screen bg-white shadow-md z-20 overflow-y-auto">
      <div className="p-6 flex items-center">
        <Clock className="h-8 w-8 text-blue-600 mr-2" />
        <span className="text-xl font-bold text-blue-600">TimeWise</span>
      </div>
      
      <nav className="mt-6">
        <div className="px-6 py-2">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Dashboard
          </h2>
        </div>
        
        <ul className="mt-2">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive 
                  ? "flex items-center px-6 py-2.5 text-blue-600 bg-blue-50 border-l-4 border-blue-600" 
                  : "flex items-center px-6 py-2.5 text-gray-700 hover:bg-gray-100 border-l-4 border-transparent"
              }
              end
            >
              <BarChart2 className="w-5 h-5 mr-3" />
              Dashboard
            </NavLink>
          </li>
        </ul>
        
        <div className="px-6 py-2 mt-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Management
          </h2>
        </div>
        
        <ul className="mt-2">
          <li>
            <NavLink 
              to="/staff" 
              className={({ isActive }) => 
                isActive 
                  ? "flex items-center px-6 py-2.5 text-blue-600 bg-blue-50 border-l-4 border-blue-600" 
                  : "flex items-center px-6 py-2.5 text-gray-700 hover:bg-gray-100 border-l-4 border-transparent"
              }
            >
              <Users className="w-5 h-5 mr-3" />
              Staff Management
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/branches" 
              className={({ isActive }) => 
                isActive 
                  ? "flex items-center px-6 py-2.5 text-blue-600 bg-blue-50 border-l-4 border-blue-600" 
                  : "flex items-center px-6 py-2.5 text-gray-700 hover:bg-gray-100 border-l-4 border-transparent"
              }
            >
              <Building className="w-5 h-5 mr-3" />
              Branch Management
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/devices" 
              className={({ isActive }) => 
                isActive 
                  ? "flex items-center px-6 py-2.5 text-blue-600 bg-blue-50 border-l-4 border-blue-600" 
                  : "flex items-center px-6 py-2.5 text-gray-700 hover:bg-gray-100 border-l-4 border-transparent"
              }
            >
              <Smartphone className="w-5 h-5 mr-3" />
              Device Management
            </NavLink>
          </li>
        </ul>
        
        <div className="px-6 py-2 mt-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Monitoring
          </h2>
        </div>
        
        <ul className="mt-2">
          <li>
            <NavLink 
              to="/geofence" 
              className={({ isActive }) => 
                isActive 
                  ? "flex items-center px-6 py-2.5 text-blue-600 bg-blue-50 border-l-4 border-blue-600" 
                  : "flex items-center px-6 py-2.5 text-gray-700 hover:bg-gray-100 border-l-4 border-transparent"
              }
            >
              <MapPin className="w-5 h-5 mr-3" />
              Geofence Monitoring
            </NavLink>
          </li>
          
          <li>
            <NavLink 
              to="/attendance" 
              className={({ isActive }) => 
                isActive 
                  ? "flex items-center px-6 py-2.5 text-blue-600 bg-blue-50 border-l-4 border-blue-600" 
                  : "flex items-center px-6 py-2.5 text-gray-700 hover:bg-gray-100 border-l-4 border-transparent"
              }
            >
              <ClipboardList className="w-5 h-5 mr-3" />
              Attendance Reports
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;