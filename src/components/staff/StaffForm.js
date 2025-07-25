import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStaff } from "../../contexts";
import { ChevronLeft, Save, Loader2 } from "lucide-react";

const StaffForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const { 
    getStaffById, 
    createStaff, 
    updateStaff, 
    loading 
  } = useStaff();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    employeeId: "",
    role: "",
    department: "",
    profileImage: "",
    active: true,
    joiningDate: "",
    branchId: "1" // Default branch
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  useEffect(() => {
    if (isEditMode && id) {
      const staffMember = getStaffById(id);
      if (staffMember) {
        setFormData({
          name: staffMember.name || "",
          email: staffMember.email || "",
          phone: staffMember.phone || "",
          employeeId: staffMember.employeeId || "",
          role: staffMember.role || "",
          department: staffMember.department || "",
          profileImage: staffMember.profileImage || "",
          active: staffMember.active !== undefined ? staffMember.active : true,
          joiningDate: staffMember.joiningDate ? new Date(staffMember.joiningDate).toISOString().split('T')[0] : "",
          branchId: staffMember.branchId || "1"
        });
        
        if (staffMember.profileImage) {
          setImagePreview(staffMember.profileImage);
        }
      }
    }
  }, [id, isEditMode, getStaffById]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditMode) {
        await updateStaff(id, formData);
      } else {
        await createStaff(formData);
      }
      navigate("/staff");
    } catch (error) {
      console.error("Error saving staff:", error);
      setErrors(prev => ({
        ...prev,
        form: "Error saving staff. Please try again."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // List of common roles for dropdown
  const roleOptions = [
    "Manager",
    "Supervisor",
    "Team Lead",
    "Associate",
    "Admin",
    "HR",
    "Receptionist",
    "Security",
    "Maintenance",
    "Intern"
  ];
  
  // List of departments
  const departmentOptions = [
    "Operations",
    "Sales",
    "Marketing",
    "Finance",
    "Human Resources",
    "Customer Service",
    "IT",
    "Administration",
    "R&D",
    "Legal"
  ];
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate("/staff")}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditMode ? "Edit Staff" : "Add New Staff"}
        </h1>
      </div>
      
      {errors.form && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          {errors.form}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Image */}
            <div className="md:col-span-2 flex flex-col items-center mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Profile Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-4xl">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
              </div>
              <label className="cursor-pointer px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md">
                <span className="text-sm">Upload Photo</span>
                <input 
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Employee ID
              </label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role*
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white ${
                  errors.role ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Role</option>
                {roleOptions.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-500">{errors.role}</p>
              )}
            </div>
            
            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Select Department</option>
                {departmentOptions.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Joining Date
              </label>
              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {/* Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                Active
              </label>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/staff")}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 mr-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Staff
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffForm;