import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create the context
export const StaffContext = createContext();

// Mock data for attendance
const generateMockAttendance = () => {
  const today = new Date();
  const records = [];
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) {
      continue;
    }
    
    const status = Math.random() > 0.1 ? 'present' : 'absent';
    const isLate = status === 'present' && Math.random() > 0.7;
    
    records.push({
      id: `att-${i}`,
      date: date.toISOString().split('T')[0],
      status: status,
      checkInTime: status === 'present' ? 
        `0${8 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : null,
      checkOutTime: status === 'present' ? 
        `${16 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` : null,
      isLate: isLate,
      branch: "Downtown Branch"
    });
  }
  
  return records;
};

// Sample data for testing
const mockStaffList = [
  {
    id: "staff-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    position: "Sales Manager",
    status: "active",
    employeeId: "EMP001",
    branchId: "branch-1",
    branch: "Downtown Branch",
    department: "Sales",
    joiningDate: "2022-03-15",
    address: "123 Main St, New York, NY 10001",
    profileImage: "https://i.pravatar.cc/300?img=8",
    attendance: generateMockAttendance()
  },
  {
    id: "staff-2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    position: "HR Specialist",
    status: "active",
    employeeId: "EMP002",
    branchId: "branch-2",
    branch: "Uptown Branch",
    department: "Human Resources",
    joiningDate: "2022-05-10",
    address: "456 Park Ave, New York, NY 10022",
    profileImage: "https://i.pravatar.cc/300?img=5",
    attendance: generateMockAttendance()
  },
  {
    id: "staff-3",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+1 (555) 567-8901",
    position: "IT Support",
    status: "inactive",
    employeeId: "EMP003",
    branchId: "branch-1",
    department: "Information Technology",
    branch: "Downtown Branch",
    joiningDate: "2022-01-20",
    address: "789 Broadway, New York, NY 10003",
    profileImage: "https://i.pravatar.cc/300?img=12",
    attendance: generateMockAttendance()
  }
];

/**
 * StaffProvider component for managing staff data
 */
export const StaffProvider = ({ children }) => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch staff list from API
  const fetchStaffList = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/staff');
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        setStaffList(mockStaffList);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to fetch staff list");
      setLoading(false);
      console.error("Error fetching staff list:", err);
    }
  };
  
  // Get staff by ID
  const getStaffById = (id) => {
    return staffList.find(staff => staff.id === id) || null;
  };
  
  // Add new staff
  const addStaff = async (staffData) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/staff', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(staffData),
      // });
      // const newStaff = await response.json();
      
      // Mock implementation
      const newStaff = {
        id: `staff-${uuidv4()}`,
        ...staffData,
        status: staffData.status || "active",
      };
      
      setStaffList(prevList => [...prevList, newStaff]);
      setLoading(false);
      return newStaff;
    } catch (err) {
      setError("Failed to add staff");
      setLoading(false);
      console.error("Error adding staff:", err);
      throw err;
    }
  };
  
  // Update staff
  const updateStaff = async (id, staffData) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/staff/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(staffData),
      // });
      // const updatedStaff = await response.json();
      
      // Mock implementation
      const updatedStaff = {
        ...getStaffById(id),
        ...staffData,
      };
      
      setStaffList(prevList => 
        prevList.map(staff => 
          staff.id === id ? updatedStaff : staff
        )
      );
      
      setLoading(false);
      return updatedStaff;
    } catch (err) {
      setError("Failed to update staff");
      setLoading(false);
      console.error("Error updating staff:", err);
      throw err;
    }
  };
  
  // Delete staff
  const deleteStaff = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/staff/${id}`, {
      //   method: 'DELETE',
      // });
      
      // Mock implementation
      setStaffList(prevList => 
        prevList.filter(staff => staff.id !== id)
      );
      
      setLoading(false);
      return true;
    } catch (err) {
      setError("Failed to delete staff");
      setLoading(false);
      console.error("Error deleting staff:", err);
      throw err;
    }
  };
  
  // Initialize on component mount
  useEffect(() => {
    fetchStaffList();
  }, []);
  
  const contextValue = {
    staffList,
    loading,
    error,
    fetchStaffList,
    getStaffById,
    addStaff,
    updateStaff,
    deleteStaff
  };
  
  return (
    <StaffContext.Provider value={contextValue}>
      {children}
    </StaffContext.Provider>
  );
};

export default StaffProvider;
