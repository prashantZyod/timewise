import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * Delete Confirmation Dialog component
 */
const DeleteConfirmationDialog = ({ 
  title = 'Confirm Deletion', 
  message = 'Are you sure you want to delete this item? This action cannot be undone.', 
  onConfirm, 
  onCancel 
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 mx-4">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 bg-red-100 rounded-full p-3 mr-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        </div>
        
        <p className="text-slate-600 mb-6">{message}</p>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
