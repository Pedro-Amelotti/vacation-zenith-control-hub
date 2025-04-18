
import React from "react";
import { useVacation } from "@/context/vacation-context";
import { RequestForm } from "@/components/vacation/request-form";
import { RequestList } from "@/components/dashboard/request-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RequestsPage: React.FC = () => {
  const { userRequests } = useVacation();
  
  const pendingRequests = userRequests.filter(req => req.status === 'pending');
  const approvedRequests = userRequests.filter(req => req.status === 'approved');
  const deniedRequests = userRequests.filter(req => req.status === 'denied');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Vacation Requests</h1>
        <p className="text-muted-foreground">
          View your vacation history and submit new requests.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <RequestForm />
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="all">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="denied">Denied</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <RequestList
                requests={userRequests}
                title="All Requests"
                emptyMessage="You haven't made any vacation requests yet."
              />
            </TabsContent>
            <TabsContent value="pending">
              <RequestList
                requests={pendingRequests}
                title="Pending Requests"
                emptyMessage="You don't have any pending vacation requests."
              />
            </TabsContent>
            <TabsContent value="approved">
              <RequestList
                requests={approvedRequests}
                title="Approved Requests"
                emptyMessage="You don't have any approved vacation requests."
              />
            </TabsContent>
            <TabsContent value="denied">
              <RequestList
                requests={deniedRequests}
                title="Denied Requests"
                emptyMessage="You don't have any denied vacation requests."
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RequestsPage;
