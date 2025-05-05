
import React, { createContext, useContext, useState, useEffect } from "react";
import { Department } from "@/types/department";
import { getDepartments, addDepartment as dbAddDepartment, updateDepartment as dbUpdateDepartment, deleteDepartment as dbDeleteDepartment } from "@/utils/database";

interface DepartmentContextType {
  departments: Department[];
  addDepartment: (name: string) => Promise<void>;
  removeDepartment: (id: string) => Promise<void>;
  updateDepartment: (id: string, name: string) => Promise<void>;
  isLoading: boolean;
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined);

// Initial mock departments (will be replaced by database)
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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Load departments from database
  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const dbDepartments = await getDepartments();
        if (dbDepartments && dbDepartments.length > 0) {
          setDepartments(dbDepartments);
        }
      } catch (error) {
        console.error("Failed to load departments:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDepartments();
  }, []);

  const addDepartment = async (name: string) => {
    setIsLoading(true);
    try {
      const id = await dbAddDepartment(name);
      const newDepartment = {
        id: id as string,
        name,
        createdAt: new Date().toISOString()
      };
      
      setDepartments(prevDepts => [...prevDepts, newDepartment]);
    } catch (error) {
      console.error("Failed to add department:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeDepartment = async (id: string) => {
    setIsLoading(true);
    try {
      await dbDeleteDepartment(id);
      setDepartments(departments.filter(dept => dept.id !== id));
    } catch (error) {
      console.error("Failed to remove department:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDepartment = async (id: string, name: string) => {
    setIsLoading(true);
    try {
      await dbUpdateDepartment(id, name);
      setDepartments(departments.map(dept =>
        dept.id === id ? { ...dept, name } : dept
      ));
    } catch (error) {
      console.error("Failed to update department:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DepartmentContext.Provider value={{
      departments,
      addDepartment,
      removeDepartment,
      updateDepartment,
      isLoading
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
