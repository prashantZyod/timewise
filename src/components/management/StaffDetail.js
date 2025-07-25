import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { 
  ChevronLeft, 
  Edit, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Building,
  Clock
} from "lucide-react";

/**
 * StaffDetail component to view staff profile details
 */
const StaffDetail = ({ staff, branches = [], onEdit }) => {
  const navigate = useNavigate();
  
  if (!staff) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  const getBranchName = (branchId) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : "Unassigned";
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const handleBack = () => {
    navigate("/staff-management");
  };
  
  const handleEdit = () => {
    if (onEdit) {
      onEdit(staff.id);
    } else {
      navigate(`/staff/${staff.id}/edit`);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button 
          onClick={handleBack}
          className="mr-4 text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Staff Profile</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-200 mb-4">
              {staff.profileImage ? (
                <img 
                  src={staff.profileImage} 
                  alt={staff.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-100 text-emerald-500 text-4xl">
                  {staff.name ? staff.name.charAt(0).toUpperCase() : <User className="h-12 w-12" />}
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-1">{staff.name}</h2>
            <p className="text-slate-500 mb-4">{staff.position || "No position specified"}</p>
            
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              staff.status === 'active' 
                ? "bg-emerald-100 text-emerald-800" 
                : "bg-slate-100 text-slate-800"
            } mb-6`}>
              {staff.status || "Unknown status"}
            </div>
            
            <Button 
              onClick={handleEdit}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>
        
        {/* Information Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg font-medium">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Mail className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Email</p>
                    <p className="text-slate-900">{staff.email || "Not specified"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Phone</p>
                    <p className="text-slate-900">{staff.phone || "Not specified"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Address</p>
                    <p className="text-slate-900">{staff.address || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Employment Details */}
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-lg font-medium">Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Employee ID</p>
                    <p className="text-slate-900">{staff.employeeId || "Not assigned"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Building className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Branch</p>
                    <p className="text-slate-900">{getBranchName(staff.branchId)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Briefcase className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Position</p>
                    <p className="text-slate-900">{staff.position || "Not specified"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Joining Date</p>
                    <p className="text-slate-900">{formatDate(staff.joiningDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-slate-400 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-500">Status</p>
                    <p className="text-slate-900 flex items-center">
                      <span className={`mr-2 w-2 h-2 rounded-full ${
                        staff.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'
                      }`}></span>
                      {staff.status === 'active' ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;
