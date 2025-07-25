import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { useBranch } from '../contexts'; // Ensure this import is correct
import { useNavigate } from 'react-router-dom';

const BranchManagement = () => {
  const { branches, loading, error, fetchBranches, deleteBranch } = useBranch();
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch branches when component mounts
    fetchBranches();
  }, [fetchBranches]);
  
  const handleDeleteClick = (branch) => {
    setBranchToDelete(branch);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (branchToDelete) {
      try {
        await deleteBranch(branchToDelete.id);
        setShowDeleteModal(false);
        setBranchToDelete(null);
      } catch (error) {
        console.error("Error deleting branch:", error);
      }
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setBranchToDelete(null);
  };
  
  const filteredBranches = searchTerm && branches
    ? branches.filter(branch => 
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase()))
    : branches;
  
  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Branch Management</h1>
        <button 
          className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={() => navigate('/branches/new')}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Branch
        </button>
      </div>
      
      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search branches..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Branch List */}
      {filteredBranches && filteredBranches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBranches.map(branch => (
            <div key={branch.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-medium text-gray-900">{branch.name}</h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${branch.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                  }`}>
                    {branch.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{branch.address}</span>
                  </div>
                  <div>Phone: {branch.phone}</div>
                  <div>Geofence Radius: {branch.geofenceRadius}m</div>
                  <div className="font-medium text-gray-900">Staff Count: {branch.staffCount}</div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                <button 
                  className="text-blue-600 hover:text-blue-900"
                  title="Edit Branch"
                  onClick={() => navigate(`/branches/${branch.id}/edit`)}
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button 
                  className="text-red-600 hover:text-red-900"
                  title="Delete Branch"
                  onClick={() => handleDeleteClick(branch)}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">
            {searchTerm ? "No branches found matching your search." : "No branches available."}
          </p>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to delete the branch "{branchToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchManagement;
