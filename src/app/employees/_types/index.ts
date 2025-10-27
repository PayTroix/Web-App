/**
 * Employees Module Types
 * Centralized type definitions for the employees/recipients module
 */

// API response type
export interface RecipientProfile {
    id: number;
    name: string;
    email: string;
    recipient_ethereum_address: string;
    organization: number;
    phone_number: string;
    salary: number;
    position: string;
    status: string;
    created_at: string;
    updated_at: string;
}

// UI display type
export interface Recipient {
    id: number;
    name: string;
    position: string;
    wallet: string;
    salary: string;
    status: string;
}

export interface EmployeesStats {
    totalEmployees: number;
    activeEmployees: number;
    leaveRequests: number;
    treasuryBalance: string;
}

export interface EmployeesData {
    employees: Recipient[];
    stats: EmployeesStats;
}
