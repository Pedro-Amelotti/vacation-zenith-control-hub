
import React from "react";
import { VacationRequest } from "@/types/vacation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface RequestListProps {
  requests: VacationRequest[];
  title: string;
  emptyMessage?: string;
  showEmployee?: boolean;
}

export const RequestList: React.FC<RequestListProps> = ({
  requests,
  title,
  emptyMessage = "No requests found.",
  showEmployee = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "approved": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "denied": return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {requests.length === 0 ? emptyMessage : `Showing ${requests.length} requests`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex justify-between mb-2">
                  <div className="font-medium">
                    {showEmployee && request.userName}
                    {!showEmployee && request.reason}
                  </div>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {!showEmployee && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(request.startDate), "MMM d, yyyy")} - {format(new Date(request.endDate), "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  
                  {showEmployee && (
                    <div className="text-sm">
                      {request.reason}
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    {showEmployee ? (
                      <>
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(new Date(request.startDate), "MMM d, yyyy")} - {format(new Date(request.endDate), "MMM d, yyyy")}
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4" />
                        <span>
                          Requested on {format(new Date(request.createdAt), "MMM d, yyyy")}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {request.supervisorComment && (
                    <div className="mt-2 p-2 bg-secondary/50 rounded text-xs">
                      <span className="font-medium">Supervisor comment:</span> {request.supervisorComment}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
