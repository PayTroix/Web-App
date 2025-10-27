/**
 * Dashboard Types
 * Centralized type definitions for the dashboard module
 */

export interface RecentActivity {
    id: string;
    type: string;
    message: string;
    time: string;
}

export interface DashboardData {
    totalEmployees: number;
    activeEmployees: number;
    performancePercentage: number;
    pendingRequests: number;
    pendingPayrollVolume: number;
    recentActivities: RecentActivity[];
}

export interface DashboardStats {
    totalEmployees: number;
    activeEmployees: number;
    performancePercentage: number;
    pendingRequests: number;
    pendingPayrollVolume: number;
}
