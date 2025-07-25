/**
 * Creates a page URL from a page name
 * @param {string} pageName - The name of the page
 * @returns {string} The URL for the page
 */
export const createPageUrl = (pageName) => {
  // Map of page names to their URL paths
  const pageUrlMap = {
    'Attendance': '/attendance',
    'AdminDashboard': '/admin-dashboard',
    'PhotoVerification': '/photo-verification',
    'StaffManagement': '/staff-management',
    'BranchManagement': '/branch-management',
    'DeviceManagement': '/device-management',
    'Reports': '/reports',
    'Settings': '/settings',
    'Login': '/login',
    'StaffDashboard': '/staff-dashboard',
    'StaffCheckIn': '/staff-check-in'
  };

  // Return mapped URL if exists, otherwise use default conversion
  return pageUrlMap[pageName] || `/${pageName.toLowerCase().replace(/\s+/g, '-')}`;
};
