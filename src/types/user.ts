
export type UserRole = 'employee' | 'supervisor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  supervisorId?: string;
}
