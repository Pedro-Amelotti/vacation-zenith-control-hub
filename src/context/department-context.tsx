
import React, { createContext, useContext, useState } from "react";
import { Department } from "@/types/department";

interface DepartmentContextType {
  departments: Department[];
  addDepartment: (name: string) => void;
  removeDepartment: (id: string) => void;
  updateDepartment: (id: string, name: string) => void;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

// Initial mock departments
const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: "1",
    name: "Seção de Informática",
    createdAt: new Date().toISOString()
  },
  {
    id: "2",
    name: "Seção de Pessoal",
    createdAt: new Date().toISOString()
  }
];

export const DepartmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);

  const addDepartment = (name: string) => {
    setDepartments([
      ...departments,
      {
        id: Math.random().toString(36).substr(2, 9),
        name,
        createdAt: new Date().toISOString()
      }
    ]);
  };

  const removeDepartment = (id: string) => {
    setDepartments(departments.filter(dept => dept.id !== id));
  };

  const updateDepartment = (id: string, name: string) => {
    setDepartments(departments.map(dept =>
      dept.id === id ? { ...dept, name } : dept
    ));
  };

  return (
    <DepartmentContext.Provider value={{
      departments,
      addDepartment,
      removeDepartment,
      updateDepartment
    }}>
      {children}
    </DepartmentContext.Provider>
  );
};

export const useDepartments = () => {
  const context = useContext(DepartmentContext);
  if (context === undefined) {
    throw new Error("useDepartments must be used within a DepartmentProvider");
  }
  return context;
};
