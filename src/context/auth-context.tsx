
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Employee",
    email: "employee@example.com",
    role: "employee",
    department: "Engineering"
  },
  {
    id: "2",
    name: "Jane Supervisor",
    email: "supervisor@example.com",
    role: "supervisor",
    department: "Engineering"
  },
  {
    id: "3",
    name: "Alice Admin",
    email: "admin@example.com",
    role: "admin",
    department: "Administration"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Check for saved user in local storage (simulating persistence)
    const savedUser = localStorage.getItem("vacation-system-user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real application, this would be an API call
      // For demo purposes, we'll use the mock data
      const foundUser = MOCK_USERS.find(user => user.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(foundUser);
      localStorage.setItem("vacation-system-user", JSON.stringify(foundUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("vacation-system-user");
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
