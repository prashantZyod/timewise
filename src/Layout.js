import React, { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Clock, Users, MapPin, BarChart3, Settings, LogOut, Smartphone, Camera, FileText, Shield } from "lucide-react";
import { User } from "./entities/User";
import DeviceApprovalGate from "./components/DeviceApprovalGate";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarContext,
} from "./components/ui/sidebar";

// Mobile overlay component
const MobileOverlay = () => {
  const { isOpen, closeSidebar } = React.useContext(SidebarContext);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden transition-opacity duration-200"
      onClick={closeSidebar}
      aria-hidden="true"
    />
  );
};

// Navigation items organized by groups
const navigationGroups = {
  staff: {
    label: "STAFF",
    items: []
  },
  administration: {
    label: "ADMINISTRATION",
    items: [
      {
        title: "Admin Dashboard",
        url: createPageUrl("AdminDashboard"),
        icon: BarChart3,
        roles: ["admin"]
      },
      {
        title: "Geofence Monitoring",
        url: "/geofence-monitoring",
        icon: MapPin,
        roles: ["admin"]
      },
    ]
  },
  management: {
    label: "MANAGEMENT",
    items: [
      {
        title: "Staff Management",
        url: "/staff-management",
        icon: Users,
        roles: ["admin"]
      },
      {
        title: "Device Management",
        url: createPageUrl("DeviceManagement"),
        icon: Smartphone,
        roles: ["admin"]
      },
      {
        title: "Branch Management",
        url: createPageUrl("BranchManagement"),
        icon: MapPin,
        roles: ["admin"]
      },
    ]
  },
  reports: {
    label: "ANALYTICS",
    items: [
      {
        title: "Reports",
        url: createPageUrl("Reports"),
        icon: FileText,
        roles: ["admin"]
      },
    ]
  },
  settings: {
    label: "SYSTEM",
    items: [
      {
        title: "Settings",
        url: createPageUrl("Settings"),
        icon: Settings,
        roles: ["admin", "user"]
      },
      {
        title: "Factory Location",
        url: "/custom-premise-settings",
        icon: MapPin,
        roles: ["admin", "user"]
      },
      {
        title: "Location Demo",
        url: "/location-demo",
        icon: MapPin,
        roles: ["admin", "user"]
      }
    ]
  }
};

// Flatten navigation items for legacy code compatibility
const navigationItems = Object.values(navigationGroups).flatMap(group => group.items);

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await User.logout();
    window.location.reload();
  };

  const filteredNavItems = useMemo(() => navigationItems.filter(item => 
    item.roles.includes(user?.role || "user")
  ), [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      {/* Overlay for mobile when sidebar is open */}
      <MobileOverlay />
      <div className="flex h-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <Sidebar className="border-r border-slate-100 z-30 shadow-sm sidebar-compact">
          <SidebarHeader className="border-b border-slate-100 p-4">              
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-base">ZyOD StaffLogs</h2>
                <p className="text-xs text-slate-500">Attendance Management</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-2">
            {/* Render each navigation group separately */}
            {Object.entries(navigationGroups).map(([groupKey, group]) => {
              // Filter items by user role
              const groupItems = group.items.filter(item => 
                item.roles.includes(user?.role || "user")
              );
              
              // Don't render empty groups
              if (groupItems.length === 0) return null;
              
              return (
                <SidebarGroup key={groupKey} className="mb-2">
                  <SidebarGroupLabel className="text-xs font-medium text-slate-400 px-2 py-1">
                    {group.label}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {groupItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton 
                            asChild 
                            className={`hover:bg-slate-50 hover:text-slate-800 transition-all duration-200 rounded-md mb-0.5 ${
                              location.pathname === item.url 
                                ? 'bg-slate-50 text-slate-800 font-medium border-l-2 border-emerald-500' 
                                : 'text-slate-600'
                            }`}
                          >
                            <Link to={item.url} className="flex items-center gap-2 px-2 py-2 text-sm">
                              <item.icon className="w-4 h-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
          </SidebarContent>

          <SidebarFooter className="border-t border-slate-100 p-3">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xs">
                    {user?.full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                {/* Online status indicator */}
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 text-xs truncate">
                  {user?.full_name || 'User'}
                </p>
                <div className="flex items-center gap-1">
                  <p className="text-xs text-slate-500 truncate">
                    {user?.role === 'admin' ? 'Admin' : 'Staff'}
                  </p>
                  {user?.branch && (
                    <>
                      <span className="text-xs text-slate-300">•</span>
                      <p className="text-xs text-slate-500 truncate">{user.branch.name}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Device verification status */}
            <div className="bg-emerald-50 rounded-md p-1.5 mb-2 flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                <Shield className="w-3 h-3 text-emerald-600" />
              </div>
              <span className="text-xs text-emerald-700">Device Verified</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 text-xs text-slate-600 hover:text-slate-800 transition-colors px-2 py-1.5 rounded-md hover:bg-slate-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-screen-2xl">
              <div className="flex-1 overflow-auto flex flex-col p-2 sm:p-3 lg:p-4 content-container">
                <div className="content-compact">
                  {user?.role === 'admin' ? children : (
                      <DeviceApprovalGate user={user}>
                          {children}
                      </DeviceApprovalGate>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
