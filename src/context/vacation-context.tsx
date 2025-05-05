import React, { createContext, useContext, useState, useEffect } from "react";
import { VacationRequest, VacationStatus } from "@/types/vacation";
import { useAuth } from "./auth-context";
import { useToast } from "@/components/ui/use-toast";
import { 
  getVacationRequests, 
  getUserVacationRequests, 
  addVacationRequest,
  updateVacationRequest 
} from "@/utils/database";
import { MOCK_VACATION_REQUESTS } from "@/data/mock-data";

interface VacationContextType {
  vacationRequests: VacationRequest[];
  userRequests: VacationRequest[];
  pendingRequests: VacationRequest[];
  createRequest: (request: Omit<VacationRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">) => Promise<void>;
  updateRequestStatus: (requestId: string, status: VacationStatus, comment?: string) => Promise<void>;
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
    // Load vacation requests from database
    const loadRequests = async () => {
      try {
        const dbRequests = await getVacationRequests();
        
        if (dbRequests && dbRequests.length > 0) {
          setVacationRequests(dbRequests);
        } else {
          // Fallback to mock data if DB is empty
          const savedRequests = localStorage.getItem("vacation-system-requests");
          if (savedRequests) {
            setVacationRequests(JSON.parse(savedRequests));
          } else {
            setVacationRequests(MOCK_VACATION_REQUESTS);
            localStorage.setItem("vacation-system-requests", JSON.stringify(MOCK_VACATION_REQUESTS));
          }
        }
      } catch (error) {
        console.error("Failed to load vacation requests:", error);
        
        // Fallback to local storage or mock data
        const savedRequests = localStorage.getItem("vacation-system-requests");
        if (savedRequests) {
          setVacationRequests(JSON.parse(savedRequests));
        } else {
          setVacationRequests(MOCK_VACATION_REQUESTS);
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRequests();
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
  
  const createRequest = async (
    request: Omit<VacationRequest, "id" | "createdAt" | "updatedAt" | "status" | "userId" | "userName">
  ) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const now = new Date().toISOString();
      const newRequest: Omit<VacationRequest, "id" | "createdAt" | "updatedAt"> = {
        userId: user.id,
        userName: user.name,
        status: "pending",
        ...request
      };
      
      // Add to database
      await addVacationRequest(newRequest);
      
      // Update local state
      const updatedRequests = [...vacationRequests, {
        ...newRequest,
        id: Date.now().toString(), // Temporary ID until we refresh from DB
        createdAt: now,
        updatedAt: now
      }];
      
      setVacationRequests(updatedRequests);
      localStorage.setItem("vacation-system-requests", JSON.stringify(updatedRequests));
      
      toast({
        title: "Request Created",
        description: "Your vacation request has been submitted for approval."
      });
    } catch (error) {
      console.error("Failed to create vacation request:", error);
      toast({
        title: "Error",
        description: "Failed to create vacation request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateRequestStatus = async (requestId: string, status: VacationStatus, comment?: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Update in database
      await updateVacationRequest(requestId, {
        status,
        supervisorComment: comment,
        updatedAt: new Date().toISOString()
      });
      
      // Update local state
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
    } catch (error) {
      console.error("Failed to update vacation request:", error);
      toast({
        title: "Error",
        description: "Failed to update request status. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
