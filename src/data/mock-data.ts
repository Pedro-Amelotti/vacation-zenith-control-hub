
import { VacationRequest } from "@/types/vacation";
import { User } from "@/types/user";

// Mock users for demonstration
export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Employee",
    email: "employee@example.com",
    role: "employee",
    department: "Engineering",
    supervisorId: "2"
  },
  {
    id: "2",
    name: "Jane Supervisor",
    email: "supervisor@example.com",
    role: "supervisor",
    department: "Engineering"
  },
  {
    id: "3",
    name: "Alice Admin",
    email: "admin@example.com",
    role: "admin",
    department: "Administration"
  },
  {
    id: "4",
    name: "Bob Employee",
    email: "bob@example.com",
    role: "employee",
    department: "Marketing",
    supervisorId: "2"
  },
  {
    id: "5",
    name: "Charlie Employee",
    email: "charlie@example.com",
    role: "employee",
    department: "Finance",
    supervisorId: "2"
  }
];

// Mock vacation requests
export const MOCK_VACATION_REQUESTS: VacationRequest[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Employee",
    startDate: "2025-05-01",
    endDate: "2025-05-10",
    reason: "Annual family vacation",
    status: "pending",
    createdAt: "2025-04-01T10:30:00Z",
    updatedAt: "2025-04-01T10:30:00Z",
    supervisorId: "2",
    supervisorName: "Jane Supervisor"
  },
  {
    id: "2",
    userId: "4",
    userName: "Bob Employee",
    startDate: "2025-06-15",
    endDate: "2025-06-20",
    reason: "Wedding attendance",
    status: "approved",
    createdAt: "2025-04-10T14:20:00Z",
    updatedAt: "2025-04-12T09:15:00Z",
    supervisorId: "2",
    supervisorName: "Jane Supervisor",
    supervisorComment: "Approved. Enjoy the wedding!"
  },
  {
    id: "3",
    userId: "5",
    userName: "Charlie Employee",
    startDate: "2025-04-25",
    endDate: "2025-05-05",
    reason: "Medical leave",
    status: "denied",
    createdAt: "2025-04-15T11:45:00Z",
    updatedAt: "2025-04-16T16:30:00Z",
    supervisorId: "2",
    supervisorName: "Jane Supervisor",
    supervisorComment: "Please provide medical documentation before approval."
  },
  {
    id: "4",
    userId: "1",
    userName: "John Employee",
    startDate: "2025-07-01",
    endDate: "2025-07-15",
    reason: "Summer holiday",
    status: "approved",
    createdAt: "2025-04-20T09:00:00Z",
    updatedAt: "2025-04-21T14:10:00Z",
    supervisorId: "2",
    supervisorName: "Jane Supervisor",
    supervisorComment: "Approved as requested."
  }
];
