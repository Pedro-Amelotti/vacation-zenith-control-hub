
import React, { useState } from "react";
import { VacationRequest } from "@/types/vacation";
import { useVacation } from "@/context/vacation-context";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { format, differenceInCalendarDays } from "date-fns";
import { CheckCircle, XCircle, Calendar, User } from "lucide-react";

interface ApprovalCardProps {
  request: VacationRequest;
}

export const ApprovalCard: React.FC<ApprovalCardProps> = ({ request }) => {
  const [comment, setComment] = useState("");
  const { updateRequestStatus } = useVacation();
  
  const handleApprove = () => {
    updateRequestStatus(request.id, "approved", comment);
  };
  
  const handleDeny = () => {
    updateRequestStatus(request.id, "denied", comment);
  };
  
  const vacationDays = differenceInCalendarDays(
    new Date(request.endDate),
    new Date(request.startDate)
  ) + 1;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Vacation Request: {request.userName}</CardTitle>
        <CardDescription>
          Submitted on {format(new Date(request.createdAt), "MMMM d, yyyy")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="mr-2 h-4 w-4" />
              <span className="font-medium">Employee:</span>
              <span className="ml-2">{request.userName}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="font-medium">Period:</span>
              <span className="ml-2">
                {format(new Date(request.startDate), "MMM d")} - {format(new Date(request.endDate), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Duration:</span>
              <span className="ml-2">{vacationDays} {vacationDays === 1 ? "day" : "days"}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Reason:</span>
              <p className="mt-1">{request.reason}</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 pt-4">
          <Label htmlFor="comment">Supervisor Comment</Label>
          <Textarea
            id="comment"
            placeholder="Add a comment (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          className="border-red-200 bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800"
          onClick={handleDeny}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Deny
        </Button>
        <Button
          className="border-green-200 bg-green-100 text-green-700 hover:bg-green-200 hover:text-green-800"
          onClick={handleApprove}
        >
          <CheckCircle className="mr-2 h-4 w-4" />
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
};
