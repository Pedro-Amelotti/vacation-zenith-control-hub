
import React from "react";
import { useAuth } from "@/context/auth-context";
import { useVacation } from "@/context/vacation-context";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RequestList } from "@/components/dashboard/request-list";
import { RequestForm } from "@/components/vacation/request-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { differenceInCalendarDays } from "date-fns";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { userRequests, pendingRequests, vacationRequests } = useVacation();
  
  if (!user) return null;
  
  // Calculate stats
  const approvedRequests = userRequests.filter(req => req.status === 'approved');
  const totalVacationDays = approvedRequests.reduce((total, req) => {
    const days = differenceInCalendarDays(new Date(req.endDate), new Date(req.startDate)) + 1;
    return total + days;
  }, 0);
  
  const pendingCount = userRequests.filter(req => req.status === 'pending').length;
  
  // Different dashboard views based on role
  const EmployeeDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Total de Dias Usados"
          value={totalVacationDays}
          description="Total days approved this year"
          icon={<Calendar />}
        />
        <StatsCard
          title="Pending Requests"
          value={pendingCount}
          description="Awaiting supervisor approval"
          icon={<Clock />}
        />
        <StatsCard
          title="Approved Requests"
          value={approvedRequests.length}
          description="Successfully approved vacations"
          icon={<CheckCircle />}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RequestForm />
        <RequestList
          requests={userRequests.slice(0, 5)}
          title="Your Recent Requests"
          emptyMessage="You haven't made any vacation requests yet."
        />
      </div>
    </div>
  );
  
  const SupervisorDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Pending Approvals"
          value={pendingRequests.length}
          description="Requests waiting for your review"
          icon={<Clock />}
        />
        <StatsCard
          title="Team Members"
          value={vacationRequests
            .filter(req => req.supervisorId === user.id)
            .map(req => req.userId)
            .filter((v, i, a) => a.indexOf(v) === i)
            .length}
          description="Employees under your supervision"
          icon={<Calendar />}
        />
        <Card className="bg-vacation-highlight/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Link to="/approvals">
              <Button className="w-full">
                Review Pending Requests
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <RequestList
          requests={pendingRequests}
          title="Pending Vacation Requests"
          emptyMessage="There are no pending requests to review."
          showEmployee={true}
        />
      </div>
    </div>
  );
  
  const AdminDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Total Employees"
          value={vacationRequests
            .map(req => req.userId)
            .filter((v, i, a) => a.indexOf(v) === i)
            .length}
          description="Active users in the system"
          icon={<Calendar />}
        />
        <StatsCard
          title="Pending Requests"
          value={vacationRequests.filter(req => req.status === 'pending').length}
          description="Awaiting approval"
          icon={<Clock />}
        />
        <StatsCard
          title="Approved Requests"
          value={vacationRequests.filter(req => req.status === 'approved').length}
          description="Successfully approved"
          icon={<CheckCircle />}
        />
        <StatsCard
          title="Denied Requests"
          value={vacationRequests.filter(req => req.status === 'denied').length}
          description="Rejected by supervisors"
          icon={<XCircle />}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Key metrics and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Quick Actions</div>
              <div className="grid grid-cols-1 gap-2">
                <Link to="/reports">
                  <Button className="w-full">View Reports</Button>
                </Link>
                <Link to="/approvals">
                  <Button variant="outline" className="w-full">Manage Pending Requests</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <RequestList
          requests={pendingRequests.slice(0, 5)}
          title="Recent Pending Requests"
          emptyMessage="There are no pending requests."
          showEmployee={true}
        />
      </div>
    </div>
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          {user.role === 'employee'
            ? 'View and manage your vacation requests.'
            : user.role === 'supervisor'
            ? 'Approve team vacation requests and view departmental status.'
            : 'System overview and administration.'
          }
        </p>
      </div>
      
      {user.role === 'employee' && <EmployeeDashboard />}
      {user.role === 'supervisor' && <SupervisorDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
    </div>
  );
};

export default DashboardPage;
