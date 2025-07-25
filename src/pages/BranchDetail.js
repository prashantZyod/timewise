import React from 'react';
import { useParams } from 'react-router-dom';
import { useBranch } from '../contexts';
import GeofenceMap from '../components/branch/GeofenceMap';

const BranchDetail = () => {
  const { id } = useParams();
  const { getBranchById, loading } = useBranch();
  
  const branch = getBranchById(id);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!branch) {
    return <div>Branch not found</div>;
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">{branch.name}</h1>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6">
          {/* Branch details */}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Location & Geofence</h2>
          <GeofenceMap branch={branch} height="400px" />
          
          <div className="mt-4 text-sm text-gray-500">
            <p>Geofence Radius: {branch.geofenceRadius || 100}m</p>
            <p>Latitude: {branch.latitude}</p>
            <p>Longitude: {branch.longitude}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetail;