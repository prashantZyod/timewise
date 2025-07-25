import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Users, 
  Building, 
  Layers, 
  BarChart2, 
  Settings, 
  Shield, 
  MapPin 
} from 'lucide-react';

/**
 * Admin Navigation Menu
 * Provides navigation links for administrative functions
 */
const AdminNavMenu = () => {
  const location = useLocation();
  
  // Navigation items for admin
  const navItems = [
    { 
      icon: <Users className="w-5 h-5" />, 
      label: 'Staff Management', 
      path: '/staff-management' 
    },
    { 
      icon: <Building className="w-5 h-5" />, 
      label: 'Branch Management', 
      path: '/admin/branches' 
    },
    { 
      icon: <Layers className="w-5 h-5" />, 
      label: 'Device Management', 
      path: '/admin/devices' 
    },
    { 
      icon: <BarChart2 className="w-5 h-5" />, 
      label: 'Attendance Reports', 
      path: '/admin/reports' 
    },
    { 
      icon: <MapPin className="w-5 h-5" />, 
      label: 'Geofence Monitoring', 
      path: '/admin/geofence-monitoring' 
    },
    { 
      icon: <Shield className="w-5 h-5" />, 
      label: 'Security Settings', 
      path: '/admin/security' 
    },
    { 
      icon: <Settings className="w-5 h-5" />, 
      label: 'System Settings', 
      path: '/admin/settings' 
    }
  ];
  
  return (
    <nav className="py-4">
      <ul className="space-y-2">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminNavMenu;
