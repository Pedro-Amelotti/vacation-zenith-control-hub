
export type VacationStatus = 'pending' | 'approved' | 'denied';

export interface VacationRequest {
  id: string;
  userId: string;
  userName: string;
  userWarName: string;  // nome de guerra
  userRank: string;     // posto/grad
  userDepartment: string; // secao
  startDate: string;
  endDate: string;
  reason: string;
  status: VacationStatus;
  createdAt: string;
  updatedAt: string;
  supervisorId?: string;
  supervisorName?: string;
  supervisorComment?: string;
}
