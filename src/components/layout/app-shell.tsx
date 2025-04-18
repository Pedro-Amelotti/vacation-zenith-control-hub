
import React from "react";
import { useAuth } from "@/context/auth-context";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "./navbar";

export const AppShell: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <Outlet />
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <div className="container">
          © {new Date().getFullYear()} Vacation Control System
        </div>
      </footer>
    </div>
  );
};
