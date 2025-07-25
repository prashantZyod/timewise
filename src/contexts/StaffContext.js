import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const StaffContext = createContext();

// Sample staff data for development
const mockStaffData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
    employeeId: 'EMP001',
    role: 'Manager',
    department: 'Operations',
    profileImage: null,
    active: true,
    joiningDate: '2021-01-15',
    branchId: '1'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '123-456-7891',
    employeeId: 'EMP002',
    role: 'Supervisor',
    department: 'Customer Service',
    profileImage: null,
    active: true,
    joiningDate: '2021-03-10',
    branchId: '1'
  },
  {
    id: '3',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    phone: '123-456-7892',
    employeeId: 'EMP003',
    role: 'Team Lead',
    department: 'Sales',
    profileImage: null,
    active: false,
    joiningDate: '2021-05-20',
    branchId: '2'
  },
  // Add more mock staff as needed
];

// Create the provider component
export const StaffProvider = ({ children }) => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch staff list from API or use mock data
  const fetchStaffList = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch from API:
      // const response = await axios.get('/api/staff');
      // setStaffList(response.data);
      
      // For now, use mock data
      setStaffList(mockStaffData);
      setError(null);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };
  
  // Get staff by ID
  const getStaffById = (id) => {
    return staffList.find(staff => staff.id === id) || null;
  };
  
  // Create new staff
  const createStaff = async (staffData) => {
    setLoading(true);
    try {
      // In a real app:
      // const response = await axios.post('/api/staff', staffData);
      // const newStaff = response.data;
      
      // Mock implementation:
      const newStaff = {
        id: (staffList.length + 1).toString(),
        ...staffData,
        active: staffData.active !== undefined ? staffData.active : true,
      };
      
      setStaffList([...staffList, newStaff]);
      return newStaff;
    } catch (err) {
      console.error('Error creating staff:', err);
      setError('Failed to create staff');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Update staff
  const updateStaff = async (id, staffData) => {
    setLoading(true);
    try {
      // In a real app:
      // const response = await axios.put(`/api/staff/${id}`, staffData);
      // const updatedStaff = response.data;
      
      // Mock implementation:
      const updatedStaffList = staffList.map(staff => 
        staff.id === id ? { ...staff, ...staffData } : staff
      );
      
      setStaffList(updatedStaffList);
      return updatedStaffList.find(staff => staff.id === id);
    } catch (err) {
      console.error('Error updating staff:', err);
      setError('Failed to update staff');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Delete staff
  const deleteStaff = async (id) => {
    setLoading(true);
    try {
      // In a real app:
      // await axios.delete(`/api/staff/${id}`);
      
      // Mock implementation:
      const updatedStaffList = staffList.filter(staff => staff.id !== id);
      setStaffList(updatedStaffList);
      return true;
    } catch (err) {
      console.error('Error deleting staff:', err);
      setError('Failed to delete staff');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Load staff data when context is initialized
  useEffect(() => {
    fetchStaffList();
  }, []);
  
  const value = {
    staffList,
    loading,
    error,
    fetchStaffList,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff
  };
  
  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  );
};

// Create custom hook for accessing the context
export const useStaff = () => {
  const context = useContext(StaffContext);
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider');
  }
  return context;
};

export default StaffContext;
