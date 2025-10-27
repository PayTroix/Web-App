/**
 * Recipient Module Types
 */

export interface DashboardData {
  totalSalary: string;
  lastPayment: {
    amount: string;
    date: string;
    status: string;
  };
  nextPayment: {
    amount: string;
    date: string;
    dueIn: number;
  };
}

export interface ApiError {
  response?: {
    status: number;
  };
}
