import React, { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all branches
  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get('/branches');
      setBranches(response.data);
    } catch (err) {
      console.error('Error fetching branches:', err);
      setError(err.response?.data?.message || 'Failed to load branches. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get branch by ID
  const getBranchById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/branches/${id}`);
      return response.data;
    } catch (err) {
      console.error('Error fetching branch:', err);
      setError(err.response?.data?.message || 'Failed to load branch details. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new branch
  const createBranch = useCallback(async (branchData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/branches', branchData);
      setBranches(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating branch:', err);
      setError(err.response?.data?.message || 'Failed to create branch. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update branch
  const updateBranch = useCallback(async (id, branchData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.put(`/branches/${id}`, branchData);
      setBranches(prev => 
        prev.map(branch => branch.id === id ? response.data : branch)
      );
      return response.data;
    } catch (err) {
      console.error('Error updating branch:', err);
      setError(err.response?.data?.message || 'Failed to update branch. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete branch
  const deleteBranch = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await api.delete(`/branches/${id}`);
      setBranches(prev => prev.filter(branch => branch.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting branch:', err);
      setError(err.response?.data?.message || 'Failed to delete branch. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    branches,
    loading,
    error,
    fetchBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch
  };

  return (
    <BranchContext.Provider value={value}>
      {children}
    </BranchContext.Provider>
  );
};

export const useBranch = () => {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error('useBranch must be used within a BranchProvider');
  }
  return context;
};

export default BranchContext;
