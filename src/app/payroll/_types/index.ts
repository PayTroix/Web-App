/**
 * Payroll Module Types
 * Centralized type definitions for the payroll module
 */

import type { Payroll, RecipientProfile } from '@/services/api';

export interface Employee {
    id: number;
    name: string;
    avatar: string;
    date: string;
    salary: string;
    status: 'Completed' | 'Pending' | 'Failed';
}

export interface Recipient {
    id: number;
    name: string;
    status: string;
    salary?: number;
    wallet_address?: string;
    position?: string;
    recipient_ethereum_address?: string;
}

export interface RecipientProfiles {
    recipients: Recipient[];
}

export interface PayrollWithRecipient extends Payroll {
    recipientDetails?: RecipientProfile;
}

export interface PayrollStats {
    totalEmployees: number;
    activeEmployees: number;
    totalAmount: number;
}

export interface DisbursementRecipient {
    id: number;
    address: string;
    amount: bigint;
}

export interface DisbursementParams {
    recipients: DisbursementRecipient[];
    tokenAddress: string;
    paymentMonth: string;
    organizationId: number;
}

export type RecipientGroup = 'all' | 'active' | 'onLeave';
export type PayrollTab = 'payment' | 'history';
