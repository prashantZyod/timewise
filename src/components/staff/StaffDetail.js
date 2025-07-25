import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useStaff } from "../../contexts";
import { ChevronLeft, Edit, User, Phone, Mail, MapPin, Calendar, Briefcase, Building } from "lucide-react";

// Add the missing formatDate function
const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStaffById, loading } = useStaff();
  
  const staff = getStaffById(id);
  
  if (loading || !staff) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  // Now formatDate is defined and can be used in your component
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate("/staff")}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Staff Profile</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="md:flex">
          {/* Profile Sidebar */}
          <div className="md:w-1/3 bg-gray-50 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
              {staff.profileImage ? (
                <img 
                  src={staff.profileImage} 
                  alt={staff.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 text-4xl">
                  {staff.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1">{staff.name}</h2>
            <p className="text-gray-500 mb-4">{staff.role || "No role specified"}</p>
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              staff.active 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            } mb-6`}>
              {staff.active ? "Active" : "Inactive"}
            </div>
            
            <Link 
              to={`/staff/${staff.id}/edit`}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Link>
          </div>
          
          {/* Profile Details */}
          <div className="md:w-2/3 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{staff.email || "Not specified"}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{staff.phone || "Not specified"}</p>
                </div>
              </div>
            </div>
            
            <hr className="my-6" />
            
            <h3 className="text-lg font-medium text-gray-900 mb-4">Employment Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <User className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Employee ID</p>
                  <p className="text-gray-900">{staff.employeeId || "Not assigned"}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Building className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-gray-900">{staff.department || "Not specified"}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Briefcase className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="text-gray-900">{staff.role || "Not specified"}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Joining Date</p>
                  <p className="text-gray-900">{formatDate(staff.joiningDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;