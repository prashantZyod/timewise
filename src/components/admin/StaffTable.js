import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

export default function StaffTable({ staff, branches, onEdit, onDelete, isLoading }) {
  const getBranchName = (branchId) => {
    return branches.find(b => b.id === branchId)?.name || 'N/A';
  };

  if (isLoading) {
    return <div>Loading staff...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map(user => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="font-medium">{user.full_name}</div>
                <div className="text-sm text-slate-500">{user.email}</div>
                <div className="text-xs text-slate-400">ID: {user.employee_id}</div>
              </TableCell>
              <TableCell>{getBranchName(user.branch_id)}</TableCell>
              <TableCell>{user.position}</TableCell>
              <TableCell>
                <Badge variant={user.is_active ? 'default' : 'destructive'}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  {user.is_active && (
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => onDelete(user.id)}>
                      <Trash2 className="w-4 h-4 mr-1" /> Deactivate
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
