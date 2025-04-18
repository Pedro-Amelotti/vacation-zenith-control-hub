import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth-context";
import { VacationProvider } from "@/context/vacation-context";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import NotFound from "@/pages/NotFound";
import { AppShell } from "@/components/layout/app-shell";
import Dashboard from "@/pages/Dashboard";
import Requests from "@/pages/Requests";
import Approvals from "@/pages/Approvals";
import Reports from "@/pages/Reports";
import { DepartmentProvider } from "@/context/department-context";
import DepartmentsPage from "@/pages/admin/departments";
import UsersPage from "@/pages/admin/users";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DepartmentProvider>
          <VacationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                <Route element={<AppShell />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/requests" element={<Requests />} />
                  <Route path="/approvals" element={<Approvals />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/admin/departments" element={<DepartmentsPage />} />
                  <Route path="/admin/users" element={<UsersPage />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </VacationProvider>
        </DepartmentProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
