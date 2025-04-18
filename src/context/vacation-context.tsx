
import React, { createContext, useContext, useState, useEffect } from "react";
import { VacationRequest, VacationStatus } from "@/types/vacation";
import { MOCK_VACATION_REQUESTS } from "@/data/mock-data";
import { useAuth } from "./auth-context";
import { useToast } from "@/components/ui/use-toast";

interface VacationContextType {
  vacationRequests: VacationRequest[];
  userRequests: VacationRequest[];
  pendingRequests: VacationRequest[];
  createRequest: (request: Omit<VacationRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">) => void;
  updateRequestStatus: (requestId: string, status: VacationStatus, comment?: string) => void;
  getRequestById: (requestId: string) => VacationRequest | undefined;
  isLoading: boolean;
}

const VacationContext = createContext<VacationContextType | undefined>(undefined);

export const VacationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vacationRequests, setVacationRequests] = useState<VacationRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // In a real app, we would fetch from an API
    // For demo purposes, we'll use the mock data and local storage
    const savedRequests = localStorage.getItem("vacation-system-requests");
    if (savedRequests) {
      setVacationRequests(JSON.parse(savedRequests));
    } else {
      setVacationRequests(MOCK_VACATION_REQUESTS);
      localStorage.setItem("vacation-system-requests", JSON.stringify(MOCK_VACATION_REQUESTS));
    }
    setIsLoading(false);
  }, []);
  
  // Filter requests based on user role
  const userRequests = user 
    ? user.role === "employee" 
      ? vacationRequests.filter(request => request.userId === user.id)
      : user.role === "supervisor" 
        ? vacationRequests.filter(request => request.supervisorId === user.id)
        : vacationRequests
    : [];
    
  const pendingRequests = user && user.role !== "employee"
    ? vacationRequests.filter(request => request.status === "pending" && 
        (user.role === "admin" || request.supervisorId === user.id))
    : [];
  
  const createRequest = (
    request: Omit<VacationRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">
  ) => {
    if (!user) return;
    
    const now = new Date().toISOString();
    const newRequest: VacationRequest = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      ...request
    };
    
    const updatedRequests = [...vacationRequests, newRequest];
    setVacationRequests(updatedRequests);
    localStorage.setItem("vacation-system-requests", JSON.stringify(updatedRequests));
    
    toast({
      title: "Request Created",
      description: "Your vacation request has been submitted for approval."
    });
  };
  
  const updateRequestStatus = (requestId: string, status: VacationStatus, comment?: string) => {
    if (!user) return;
    
    const updatedRequests = vacationRequests.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status,
          supervisorComment: comment || request.supervisorComment,
          updatedAt: new Date().toISOString()
        };
      }
      return request;
    });
    
    setVacationRequests(updatedRequests);
    localStorage.setItem("vacation-system-requests", JSON.stringify(updatedRequests));
    
    toast({
      title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: `The vacation request has been ${status}.`,
      variant: status === "approved" ? "default" : "destructive"
    });
  };
  
  const getRequestById = (requestId: string) => {
    return vacationRequests.find(request => request.id === requestId);
  };
  
  return (
    <VacationContext.Provider
      value={{
        vacationRequests,
        userRequests,
        pendingRequests,
        createRequest,
        updateRequestStatus,
        getRequestById,
        isLoading
      }}
    >
      {children}
    </VacationContext.Provider>
  );
};

export const useVacation = () => {
  const context = useContext(VacationContext);
  if (context === undefined) {
    throw new Error("useVacation must be used within a VacationProvider");
  }
  return context;
};
