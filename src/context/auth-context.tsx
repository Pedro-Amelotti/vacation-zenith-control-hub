
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/user";
import { getUserByEmail, addUser, initDB } from "@/utils/database";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  register: (userData: {
    email: string;
    password: string;
    name: string;
    warName: string;
    rank: string;
    department: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration - will be replaced with database lookups
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Employee",
    email: "employee@example.com",
    role: "employee",
    department: "Engineering",
    warName: "John",
    rank: "Soldado"
  },
  {
    id: "2",
    name: "Jane Supervisor",
    email: "supervisor@example.com",
    role: "supervisor",
    department: "Engineering",
    warName: "Jane",
    rank: "Capitão"
  },
  {
    id: "3",
    name: "Alice Admin",
    email: "admin@example.com",
    role: "admin",
    department: "Administration",
    warName: "Alice",
    rank: "Coronel"
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Initialize the database
    const init = async () => {
      await initDB();
      
      // Check for saved user in local storage (simulating persistence)
      const savedUser = localStorage.getItem("vacation-system-user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setIsLoading(false);
    };
    
    init();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Try to use the database first
      const dbUser = await getUserByEmail(email);
      
      if (dbUser && dbUser.password === password) {
        const { password: _, ...userWithoutPassword } = dbUser;
        setUser(userWithoutPassword);
        localStorage.setItem("vacation-system-user", JSON.stringify(userWithoutPassword));
        return;
      }
      
      // Fallback to mock data for development
      const foundUser = MOCK_USERS.find(user => user.email === email);
      
      if (!foundUser) {
        throw new Error("Invalid credentials");
      }
      
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setUser(foundUser);
      localStorage.setItem("vacation-system-user", JSON.stringify(foundUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (userData: {
    email: string;
    password: string;
    name: string;
    warName: string;
    rank: string;
    department: string;
  }) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = await getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }
      
      // Create new user with default role of "employee"
      await addUser({
        email: userData.email,
        password: userData.password,
        name: userData.name,
        warName: userData.warName,
        rank: userData.rank,
        department: userData.department,
        role: "employee" as UserRole,
      });
      
      // Success message (but don't log in automatically)
    } catch (error) {
      console.error("Registration failed:", error);
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
        isLoading,
        register
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
