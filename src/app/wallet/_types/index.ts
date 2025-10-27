/**
 * Wallet Module Types
 */

export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
}

export interface Transaction {
  date: string;
  type: string;
  amount: string;
  status: 'Pending' | 'Completed' | 'Failed';
  id: string;
  tofrom: string;
}

export type TransactionStatus = 'Pending' | 'Completed' | 'Failed';
