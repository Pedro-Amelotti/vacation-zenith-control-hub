
import React from "react";
import { useAuth } from "@/context/auth-context";
import { Navigate, Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";

const LoginPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Vacation Control System</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage, request, and approve vacation time efficiently.
        </p>
      </div>
      
      <LoginForm />
      
      <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Register now
        </Link>
      </p>
      
      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>For demo purposes, use one of these emails:</p>
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm">
            <strong>Employee:</strong><br />
            employee@example.com
          </div>
          <div className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm">
            <strong>Supervisor:</strong><br />
            supervisor@example.com
          </div>
          <div className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm">
            <strong>Admin:</strong><br />
            admin@example.com
          </div>
        </div>
        <p className="mt-2">Use any password to login.</p>
      </div>
    </div>
  );
};

export default LoginPage;
