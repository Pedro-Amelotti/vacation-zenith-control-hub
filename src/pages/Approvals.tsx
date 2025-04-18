
import React from "react";
import { useVacation } from "@/context/vacation-context";
import { ApprovalCard } from "@/components/vacation/approval-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RequestList } from "@/components/dashboard/request-list";

const ApprovalsPage: React.FC = () => {
  const { pendingRequests, vacationRequests } = useVacation();
  
  // Filter for approved and denied requests by the current supervisor
  const approvedRequests = vacationRequests.filter(req => req.status === 'approved');
  const deniedRequests = vacationRequests.filter(req => req.status === 'denied');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Vacation Approvals</h1>
        <p className="text-muted-foreground">
          Review and manage vacation requests from your team members.
        </p>
      </div>
      
      {pendingRequests.length > 0 ? (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Review and decide on these requests.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {pendingRequests.map(request => (
                  <ApprovalCard key={request.id} request={request} />
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Tabs defaultValue="approved">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="approved">Approved History</TabsTrigger>
              <TabsTrigger value="denied">Denied History</TabsTrigger>
            </TabsList>
            <TabsContent value="approved">
              <RequestList
                requests={approvedRequests}
                title="Approved Requests"
                emptyMessage="You haven't approved any vacation requests yet."
                showEmployee={true}
              />
            </TabsContent>
            <TabsContent value="denied">
              <RequestList
                requests={deniedRequests}
                title="Denied Requests"
                emptyMessage="You haven't denied any vacation requests yet."
                showEmployee={true}
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Pending Approvals</CardTitle>
            <CardDescription>
              There are currently no vacation requests that need your approval.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="approved">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="approved">Approved History</TabsTrigger>
                <TabsTrigger value="denied">Denied History</TabsTrigger>
              </TabsList>
              <TabsContent value="approved" className="mt-4">
                <RequestList
                  requests={approvedRequests}
                  title="Approved Requests"
                  emptyMessage="You haven't approved any vacation requests yet."
                  showEmployee={true}
                />
              </TabsContent>
              <TabsContent value="denied" className="mt-4">
                <RequestList
                  requests={deniedRequests}
                  title="Denied Requests"
                  emptyMessage="You haven't denied any vacation requests yet."
                  showEmployee={true}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ApprovalsPage;
