import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { 
  Camera, 
  CheckCircle, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle,
  Filter
} from "lucide-react";

/**
 * PhotoVerification component for the administration section.
 * This component handles photo verification queue and approval process.
 */
const PhotoVerification = ({ verificationQueue = [], onApprove, onReject, onFilter }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState('all');
  
  const filteredQueue = verificationQueue.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });
  
  const currentItem = filteredQueue[currentIndex] || null;
  
  const handleApprove = async () => {
    if (!currentItem) return;
    await onApprove(currentItem.id);
  };
  
  const handleReject = async () => {
    if (!currentItem) return;
    await onReject(currentItem.id);
  };
  
  const handleNext = () => {
    if (currentIndex < filteredQueue.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentIndex(0);
    if (onFilter) {
      onFilter(newFilter);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Photo Verification</h1>
          <p className="text-slate-500">Review and verify staff check-in photos</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            onClick={() => handleFilterChange('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'pending' ? 'default' : 'outline'} 
            onClick={() => handleFilterChange('pending')}
          >
            Pending
          </Button>
          <Button 
            variant={filter === 'approved' ? 'default' : 'outline'} 
            onClick={() => handleFilterChange('approved')}
          >
            Approved
          </Button>
          <Button 
            variant={filter === 'rejected' ? 'default' : 'outline'} 
            onClick={() => handleFilterChange('rejected')}
          >
            Rejected
          </Button>
        </div>
      </div>

      {filteredQueue.length > 0 ? (
        <Card className="overflow-hidden">
          <CardHeader className="border-b bg-slate-50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-lg font-medium">
                <Camera className="mr-2 h-5 w-5 text-slate-600" />
                Verification Queue 
                <span className="ml-2 text-sm bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                  {currentIndex + 1} of {filteredQueue.length}
                </span>
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNext}
                  disabled={currentIndex === filteredQueue.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {currentItem && (
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 p-6">
                  <div className="aspect-video bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {currentItem.photoUrl ? (
                      <img 
                        src={currentItem.photoUrl} 
                        alt="Staff check-in" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-12 w-12 text-slate-400" />
                    )}
                  </div>
                </div>
                <div className="md:w-1/3 border-t md:border-t-0 md:border-l border-slate-200 p-6 bg-white">
                  <h3 className="font-medium text-lg mb-4">{currentItem.staffName}</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Check-in Time</p>
                      <p className="font-medium">{currentItem.timestamp}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Branch</p>
                      <p className="font-medium">{currentItem.branch}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Device</p>
                      <p className="font-medium">{currentItem.device}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <div className="flex items-center mt-1">
                        {currentItem.status === 'approved' ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-emerald-500 mr-1" />
                            <span className="text-emerald-600">Approved</span>
                          </>
                        ) : currentItem.status === 'rejected' ? (
                          <>
                            <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-red-600">Rejected</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                            <span className="text-amber-600">Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {currentItem.status === 'pending' && (
                      <div className="flex gap-3 mt-6">
                        <Button
                          onClick={handleApprove}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={handleReject}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="py-12">
          <CardContent className="text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No items in queue</h3>
            <p className="text-slate-500">
              {filter === 'all' 
                ? "There are no verification requests at this time." 
                : `There are no ${filter} verification requests.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhotoVerification;
