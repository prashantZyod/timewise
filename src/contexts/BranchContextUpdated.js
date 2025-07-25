import React, { createContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Create the context
export const BranchContext = createContext();

// Sample data for testing
const mockBranchList = [
  {
    id: "branch-1",
    name: "Downtown Branch",
    address: "123 Main St, New York, NY 10001",
    phone: "+1 (555) 123-4567",
    email: "downtown@example.com",
    manager: "John Doe",
    status: "active",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    id: "branch-2",
    name: "Uptown Branch",
    address: "456 Park Ave, New York, NY 10022",
    phone: "+1 (555) 987-6543",
    email: "uptown@example.com",
    manager: "Jane Smith",
    status: "active",
    coordinates: { lat: 40.7831, lng: -73.9712 }
  }
];

/**
 * BranchProvider component for managing branch data
 */
export const BranchProvider = ({ children }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch branches from API
  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/branches');
      // const data = await response.json();
      
      // Using mock data for now
      setTimeout(() => {
        setBranches(mockBranchList);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Failed to fetch branches");
      setLoading(false);
      console.error("Error fetching branches:", err);
    }
  }, []);
  
  // Get branch by ID
  const getBranchById = (id) => {
    return branches.find(branch => branch.id === id) || null;
  };
  
  // Add new branch
  const addBranch = async (branchData) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/branches', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(branchData),
      // });
      // const newBranch = await response.json();
      
      // Mock implementation
      const newBranch = {
        id: `branch-${uuidv4()}`,
        ...branchData,
        status: branchData.status || "active",
      };
      
      setBranches(prevList => [...prevList, newBranch]);
      setLoading(false);
      return newBranch;
    } catch (err) {
      setError("Failed to add branch");
      setLoading(false);
      console.error("Error adding branch:", err);
      throw err;
    }
  };
  
  // Update branch
  const updateBranch = async (id, branchData) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/branches/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(branchData),
      // });
      // const updatedBranch = await response.json();
      
      // Mock implementation
      const updatedBranch = {
        ...getBranchById(id),
        ...branchData,
      };
      
      setBranches(prevList => 
        prevList.map(branch => 
          branch.id === id ? updatedBranch : branch
        )
      );
      
      setLoading(false);
      return updatedBranch;
    } catch (err) {
      setError("Failed to update branch");
      setLoading(false);
      console.error("Error updating branch:", err);
      throw err;
    }
  };
  
  // Delete branch
  const deleteBranch = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // await fetch(`/api/branches/${id}`, {
      //   method: 'DELETE',
      // });
      
      // Mock implementation
      setBranches(prevList => 
        prevList.filter(branch => branch.id !== id)
      );
      
      setLoading(false);
      return true;
    } catch (err) {
      setError("Failed to delete branch");
      setLoading(false);
      console.error("Error deleting branch:", err);
      throw err;
    }
  };
  
  // Initialize on component mount
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);
  
  const contextValue = {
    branches,
    loading,
    error,
    fetchBranches,
    getBranchById,
    addBranch,
    updateBranch,
    deleteBranch
  };
  
  return (
    <BranchContext.Provider value={contextValue}>
      {children}
    </BranchContext.Provider>
  );
};

export default BranchProvider;
