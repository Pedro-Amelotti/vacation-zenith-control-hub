import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Calendar, LogOut, User, Users, BarChart, Settings } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  if (!user) return null;
  
  return (
    <nav className="border-b bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-vacation-highlight" />
              <span className="text-xl font-bold">VacationControl</span>
            </Link>
            
            <div className="hidden md:flex space-x-4 ml-10">
              <Link to="/" className="text-gray-700 hover:text-vacation-highlight dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </Link>
              
              <Link to="/requests" className="text-gray-700 hover:text-vacation-highlight dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                My Requests
              </Link>
              
              {user.role === 'supervisor' && (
                <Link to="/approvals" className="text-gray-700 hover:text-vacation-highlight dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Pending Approvals
                </Link>
              )}
              
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/departments" className="text-gray-700 hover:text-vacation-highlight dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <Settings className="inline-block w-4 h-4 mr-1" />
                    Departments
                  </Link>
                  <Link to="/admin/users" className="text-gray-700 hover:text-vacation-highlight dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                    <Users className="inline-block w-4 h-4 mr-1" />
                    Users
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 mr-4">
              {user.role === 'admin' ? (
                <BarChart className="h-5 w-5 text-vacation-highlight" />
              ) : user.role === 'supervisor' ? (
                <Users className="h-5 w-5 text-vacation-highlight" />
              ) : (
                <User className="h-5 w-5 text-vacation-highlight" />
              )}
              <span className="text-sm font-medium hidden md:inline-block">
                {user.name} ({user.role})
              </span>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
