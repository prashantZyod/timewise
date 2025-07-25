import React, { useState, useEffect } from 'react';
import { User } from '@/entities/User';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Save, X, Mail } from 'lucide-react';

export default function StaffForm({ user, branches, onClose }) {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    employee_id: '',
    department: '',
    position: '',
    branch_id: '',
    phone: '',
    shift_start: '',
    shift_end: '',
    is_active: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        full_name: user.full_name || '',
        employee_id: user.employee_id || '',
        department: user.department || '',
        position: user.position || '',
        branch_id: user.branch_id || '',
        phone: user.phone || '',
        shift_start: user.shift_start || '',
        shift_end: user.shift_end || '',
        is_active: user.is_active
      });
    } else {
      // Reset for new user invite
      setFormData({
        email: '',
        full_name: '',
        employee_id: '',
        department: '',
        position: '',
        branch_id: '',
        phone: '',
        shift_start: '',
        shift_end: '',
        is_active: true
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (user) {
        // Update existing user
        await User.update(user.id, formData);
      } else {
        // Create new user
        await User.invite(formData);
      }
      onClose(true);
    } catch (err) {
      setError(err.message || 'Failed to save user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="employee_id">Employee ID</Label>
          <Input
            id="employee_id"
            value={formData.employee_id}
            onChange={(e) => handleInputChange('employee_id', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="branch_id">Branch</Label>
          <Select 
            value={formData.branch_id} 
            onValueChange={(value) => handleInputChange('branch_id', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map(branch => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => handleInputChange('position', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="shift_start">Shift Start</Label>
          <Input
            id="shift_start"
            type="time"
            value={formData.shift_start}
            onChange={(e) => handleInputChange('shift_start', e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="shift_end">Shift End</Label>
          <Input
            id="shift_end"
            type="time"
            value={formData.shift_end}
            onChange={(e) => handleInputChange('shift_end', e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="is_active" 
            checked={formData.is_active}
            onCheckedChange={(checked) => handleInputChange('is_active', checked)}
          />
          <Label htmlFor="is_active">Active</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-6">
        <Button type="button" variant="outline" onClick={() => onClose(false)}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>Loading...</>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
