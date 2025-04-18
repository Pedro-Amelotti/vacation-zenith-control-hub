
import React from "react";
import { useVacation } from "@/context/vacation-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestList } from "@/components/dashboard/request-list";
import { StatsCard } from "@/components/dashboard/stats-card";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import { CheckCircle, XCircle, Clock, Calendar } from "lucide-react";

const ReportsPage: React.FC = () => {
  const { vacationRequests } = useVacation();
  
  const pendingRequests = vacationRequests.filter(req => req.status === 'pending');
  const approvedRequests = vacationRequests.filter(req => req.status === 'approved');
  const deniedRequests = vacationRequests.filter(req => req.status === 'denied');
  
  // Calculate total vacation days across all approved requests
  const totalVacationDays = approvedRequests.reduce((total, req) => {
    const days = differenceInCalendarDays(
      parseISO(req.endDate),
      parseISO(req.startDate)
    ) + 1;
    return total + days;
  }, 0);
  
  // Get unique employees
  const uniqueEmployees = [...new Set(vacationRequests.map(req => req.userId))].length;
  
  // Group by month for reporting
  const currentYear = new Date().getFullYear();
  const vacationsByMonth = Array(12).fill(0);
  
  approvedRequests.forEach(req => {
    const startDate = parseISO(req.startDate);
    const endDate = parseISO(req.endDate);
    
    if (startDate.getFullYear() === currentYear || endDate.getFullYear() === currentYear) {
      const startMonth = startDate.getMonth();
      const endMonth = endDate.getMonth();
      
      if (startMonth === endMonth) {
        const days = differenceInCalendarDays(endDate, startDate) + 1;
        vacationsByMonth[startMonth] += days;
      } else {
        // Span multiple months - distribute days accordingly
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const month = currentDate.getMonth();
          vacationsByMonth[month]++;
          
          // Move to the next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    }
  });
  
  // Find the month with the most vacation days
  const peakMonth = vacationsByMonth.indexOf(Math.max(...vacationsByMonth));
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vacation Reports</h1>
        <p className="text-muted-foreground">
          System-wide vacation statistics and management reports.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Employees"
          value={uniqueEmployees}
          description="Employees in the system"
          icon={<Calendar />}
        />
        <StatsCard
          title="Vacation Days Approved"
          value={totalVacationDays}
          description="Total across all employees"
          icon={<CheckCircle />}
        />
        <StatsCard
          title="Pending Requests"
          value={pendingRequests.length}
          description="Awaiting approval"
          icon={<Clock />}
        />
        <StatsCard
          title="Peak Vacation Month"
          value={monthNames[peakMonth]}
          description={`${vacationsByMonth[peakMonth]} days requested`}
          icon={<Calendar />}
        />
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Vacation Requests Overview</CardTitle>
          <CardDescription>
            All vacation requests in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="denied">Denied</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <RequestList
                requests={vacationRequests}
                title="All Requests"
                emptyMessage="No vacation requests in the system."
                showEmployee={true}
              />
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <RequestList
                requests={pendingRequests}
                title="Pending Requests"
                emptyMessage="No pending vacation requests."
                showEmployee={true}
              />
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              <RequestList
                requests={approvedRequests}
                title="Approved Requests"
                emptyMessage="No approved vacation requests."
                showEmployee={true}
              />
            </TabsContent>
            <TabsContent value="denied" className="mt-4">
              <RequestList
                requests={deniedRequests}
                title="Denied Requests"
                emptyMessage="No denied vacation requests."
                showEmployee={true}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
