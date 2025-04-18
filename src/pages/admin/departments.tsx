
import React, { useState } from "react";
import { useDepartments } from "@/context/department-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

const DepartmentsPage = () => {
  const { departments, addDepartment, removeDepartment, updateDepartment } = useDepartments();
  const [newDepartment, setNewDepartment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleAdd = () => {
    if (!newDepartment.trim()) return;
    addDepartment(newDepartment.trim());
    setNewDepartment("");
    toast({
      title: "Department added",
      description: "The department has been added successfully."
    });
  };

  const handleStartEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingName.trim()) return;
    updateDepartment(id, editingName.trim());
    setEditingId(null);
    toast({
      title: "Department updated",
      description: "The department has been updated successfully."
    });
  };

  const handleDelete = (id: string) => {
    removeDepartment(id);
    toast({
      title: "Department deleted",
      description: "The department has been removed successfully."
    });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Manage Departments</h1>
      
      <div className="flex gap-4">
        <Input
          placeholder="New department name"
          value={newDepartment}
          onChange={(e) => setNewDepartment(e.target.value)}
        />
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Department
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {departments.map((dept) => (
            <TableRow key={dept.id}>
              <TableCell>
                {editingId === dept.id ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(dept.id)}
                  />
                ) : (
                  dept.name
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {editingId === dept.id ? (
                    <Button onClick={() => handleSaveEdit(dept.id)} size="sm">
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStartEdit(dept.id, dept.name)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(dept.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DepartmentsPage;
