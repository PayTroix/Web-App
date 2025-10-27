/**
 * Leave Management Types
 */

export interface LeaveStats {
  approved: number;
  pending: number;
  declined: number;
  totalEmployees: number;
  activeEmployeesPercentage: number;
}

export interface LeaveRecipient {
  id: number;
  name: string;
  image?: string | null;
}

export interface LeaveRequest {
  id: number;
  recipient: LeaveRecipient;
  leave_type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at?: string;
  updated_at?: string;
}

export interface LeaveManagementData {
  leaveRequests: LeaveRequest[];
  stats: LeaveStats;
  loading: boolean;
}
