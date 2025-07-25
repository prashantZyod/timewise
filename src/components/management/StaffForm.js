import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { 
  ChevronLeft, 
  Save, 
  Loader2, 
  Upload, 
  User, 
  X 
} from "lucide-react";

/**
 * StaffForm component for adding and editing staff members
 */
const StaffForm = ({ 
  onSubmit, 
  onCancel, 
  staff = null, 
  branches = [], 
  isEdit = false 
}) => {
  const navigate = useNavigate();
  const isEditMode = isEdit || Boolean(staff);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    employeeId: "",
    position: "",
    branchId: "",
    profileImage: "",
    status: "active",
    joiningDate: "",
    address: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        employeeId: staff.employeeId || "",
        position: staff.position || "",
        branchId: staff.branchId || "",
        profileImage: staff.profileImage || "",
        status: staffData.status || "active",
        joiningDate: staffData.joiningDate ? new Date(staffData.joiningDate).toISOString().split('T')[0] : "",
        address: staffData.address || ""
      });
      
      if (staffData.profileImage) {
        setImagePreview(staffData.profileImage);
      }
    }
  }, [staffData]);
  
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
    
    if (!formData.branchId) {
      newErrors.branchId = "Branch is required";
    }
    
    if (!formData.position) {
      newErrors.position = "Position is required";
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
    
    // Clear the error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
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
      if (onSubmit) {
        await onSubmit(formData);
      }
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
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/staff-management");
    }
  };
  
  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      profileImage: ""
    }));
  };
  
  // List of common positions for dropdown
  const positionOptions = [
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          onClick={handleCancel}
          className="mr-4 text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">
          {isEditMode ? "Edit Staff" : "Add New Staff"}
        </h1>
      </div>
      
      {errors.form && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {errors.form}
        </div>
      )}
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-medium">Staff Information</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Image */}
              <div className="md:col-span-2 flex flex-col items-center mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 mb-4 relative">
                  {imagePreview ? (
                    <>
                      <img 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 shadow-md"
                        title="Remove image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-500 text-4xl">
                      {formData.name ? formData.name.charAt(0).toUpperCase() : <User className="h-12 w-12" />}
                    </div>
                  )}
                </div>
                <label className="cursor-pointer px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center">
                  <Upload className="h-4 w-4 mr-2" />
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
                <Label htmlFor="name" className={`${errors.name ? 'text-red-500' : ''}`}>
                  Name*
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <Label htmlFor="email" className={`${errors.email ? 'text-red-500' : ''}`}>
                  Email*
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <Label htmlFor="phone">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              {/* Employee ID */}
              <div>
                <Label htmlFor="employeeId">
                  Employee ID
                </Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                />
              </div>
              
              {/* Position */}
              <div>
                <Label htmlFor="position" className={`${errors.position ? 'text-red-500' : ''}`}>
                  Position*
                </Label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.position ? 'border-red-500' : 'border-slate-300'
                  } rounded-md focus:outline-none focus:ring-2 ${
                    errors.position ? 'focus:ring-red-500' : 'focus:ring-emerald-500'
                  }`}
                >
                  <option value="">Select Position</option>
                  {positionOptions.map(position => (
                    <option key={position} value={position}>{position}</option>
                  ))}
                </select>
                {errors.position && (
                  <p className="mt-1 text-sm text-red-500">{errors.position}</p>
                )}
              </div>
              
              {/* Branch */}
              <div>
                <Label htmlFor="branchId" className={`${errors.branchId ? 'text-red-500' : ''}`}>
                  Branch*
                </Label>
                <select
                  id="branchId"
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${
                    errors.branchId ? 'border-red-500' : 'border-slate-300'
                  } rounded-md focus:outline-none focus:ring-2 ${
                    errors.branchId ? 'focus:ring-red-500' : 'focus:ring-emerald-500'
                  }`}
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
                {errors.branchId && (
                  <p className="mt-1 text-sm text-red-500">{errors.branchId}</p>
                )}
              </div>
              
              {/* Joining Date */}
              <div>
                <Label htmlFor="joiningDate">
                  Joining Date
                </Label>
                <Input
                  id="joiningDate"
                  type="date"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleChange}
                />
              </div>
              
              {/* Status */}
              <div>
                <Label htmlFor="status">
                  Status
                </Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              
              {/* Address */}
              <div className="md:col-span-2">
                <Label htmlFor="address">
                  Address
                </Label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50 border-t px-6 py-4 flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="mr-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-emerald-600 hover:bg-emerald-700"
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
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default StaffForm;
