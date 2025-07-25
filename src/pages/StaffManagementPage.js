import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StaffManagement from "../components/management/StaffManagement";
import StaffForm from "../components/management/StaffForm";
import StaffDetail from "../components/management/StaffDetail";
import { StaffContext } from "../contexts/StaffContext";
import { BranchContext } from "../contexts/BranchContext";

/**
 * StaffManagementPage - Main container for staff management features
 */
const StaffManagementPage = () => {
  const { staffId, view } = useParams();
  const navigate = useNavigate();

  const { 
    staffList, 
    addStaff, 
    updateStaff, 
    deleteStaff, 
    fetchStaffList,
    getStaffById
  } = useContext(StaffContext);
  
  const { branches, fetchBranches } = useContext(BranchContext);
  
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentStaff, setCurrentStaff] = useState(null);
  
  // On component mount, fetch staff and branches
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        await fetchStaffList();
        await fetchBranches();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initData();
  }, [fetchStaffList, fetchBranches]);
  
  // Apply filtering and searching to staff list
  useEffect(() => {
    let result = [...staffList];
    
    // Filter by status
    if (filterStatus !== "all") {
      result = result.filter(staff => staff.status === filterStatus);
    }
    
    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(staff => 
        staff.name?.toLowerCase().includes(lowerSearchTerm) ||
        staff.email?.toLowerCase().includes(lowerSearchTerm) ||
        staff.position?.toLowerCase().includes(lowerSearchTerm) ||
        staff.branch?.toLowerCase().includes(lowerSearchTerm) ||
        staff.employeeId?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    setFilteredStaff(result);
  }, [staffList, searchTerm, filterStatus]);
  
  // Load staff data when viewing or editing a specific staff member
  useEffect(() => {
    if (staffId) {
      const staff = getStaffById(staffId);
      setCurrentStaff(staff);
    } else {
      setCurrentStaff(null);
    }
  }, [staffId, getStaffById]);
  
  const handleAddStaff = () => {
    navigate("/staff-management/add");
  };
  
  const handleEditStaff = (id) => {
    navigate(`/staff-management/${id}/edit`);
  };
  
  const handleViewStaff = (id) => {
    navigate(`/staff-management/${id}/view`);
  };
  
  const handleDeleteStaff = async (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteStaff(id);
        // Stay on the same page, the list will update via context
      } catch (error) {
        console.error("Error deleting staff:", error);
      }
    }
  };
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const handleFilter = (status) => {
    setFilterStatus(status);
  };
  
  const handleStaffSubmit = async (staffData, isEdit) => {
    try {
      if (isEdit) {
        await updateStaff(staffId, staffData);
      } else {
        await addStaff(staffData);
      }
      // Navigate back to staff list after successful submission
      navigate("/staff-management");
    } catch (error) {
      console.error("Error submitting staff data:", error);
    }
  };
  
  const handleFormCancel = () => {
    navigate("/staff-management");
  };
  
  // Render the appropriate view based on the route
  const renderView = () => {
    if (view === "add") {
      return (
        <StaffForm 
          branches={branches}
          onSubmit={handleStaffSubmit}
          onCancel={handleFormCancel}
        />
      );
    }
    
    if (view === "edit" && staffId && currentStaff) {
      return (
        <StaffForm 
          staff={currentStaff}
          branches={branches}
          onSubmit={(data) => handleStaffSubmit(data, true)}
          onCancel={handleFormCancel}
          isEdit={true}
        />
      );
    }
    
    if (view === "view" && staffId && currentStaff) {
      return (
        <StaffDetail 
          staff={currentStaff}
          branches={branches}
          onEdit={() => handleEditStaff(staffId)}
        />
      );
    }
    
    // Default to staff listing
    return (
      <StaffManagement 
        staffList={filteredStaff}
        onAdd={handleAddStaff}
        onEdit={handleEditStaff}
        onDelete={handleDeleteStaff}
        onView={handleViewStaff}
        onSearch={handleSearch}
        onFilter={handleFilter}
      />
    );
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        renderView()
      )}
    </div>
  );
};

export default StaffManagementPage;
