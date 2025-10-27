/**
 * Wallet Module Constants
 */

import type { MonthlySummary, Transaction } from '../_types';

// Mock wallet balance (static for now)
export const WALLET_BALANCE = 16000;

// Mock monthly summaries
export const MONTHLY_SUMMARIES: MonthlySummary[] = [
    {
        month: 'Feb',
        income: 4000,
        expense: 1200,
    },
    {
        month: 'Mar',
        income: 3500,
        expense: 4600,
    },
    {
        month: 'April',
        income: 4000,
        expense: 3400,
    },
];

// Mock transaction history
export const TRANSACTION_HISTORY: Transaction[] = [
    {
        date: 'May 5, 2025',
        type: 'Salary Credit',
        amount: '$4,000',
        status: 'Pending',
        id: 'TXN#12G9H3F',
        tofrom: 'Employer',
    },
    {
        date: 'Apr 29, 2025',
        type: 'Withdrawal',
        amount: '$1,400',
        status: 'Completed',
        id: 'TXN#22J8K6A',
        tofrom: 'Bank Account',
    },
    {
        date: 'Apr 29, 2025',
        type: 'Salary Credit',
        amount: '$3,500',
        status: 'Completed',
        id: 'TXN#45J8K6A',
        tofrom: 'Employer',
    },
    {
        date: 'Apr 29, 2025',
        type: 'Transfer',
        amount: '$600',
        status: 'Failed',
        id: 'TXN#22J7H6A',
        tofrom: 'Exchange',
    },
];

// Status color mapping
export const STATUS_COLORS: Record<string, string> = {
    Pending: 'text-yellow-400',
    Completed: 'text-green-400',
    Failed: 'text-red-500',
};
