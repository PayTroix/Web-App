/**
 * useRecipientDashboard Hook
 * Manages recipient dashboard data and operations
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
    payrollService,
    web3AuthService,
    profileService,
    type Payroll,
    type RecipientProfile,
} from '@/services/api';
import { getToken, isValidSession, removeToken } from '@/utils/token';
import {
    calculateTotalSalary,
    calculateNextPaymentDate,
    calculateDaysUntil,
    formatPayrollAmount,
} from '../_utils';
import type { DashboardData, ApiError } from '../_types';

export function useRecipientDashboard() {
    const [loading, setLoading] = useState(true);
    const [initialLoad, setInitialLoad] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [completedPayrolls, setCompletedPayrolls] = useState<Array<Payroll>>([]);
    const token = getToken();
    const router = useRouter();

    // Validate session on mount
    useEffect(() => {
        const validateSession = async () => {
            const isValid = await isValidSession();
            if (!isValid) router.replace('/');
            setInitialLoad(false);
        };
        validateSession();
    }, [router]);

    // Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!token) {
                router.replace('/');
                return;
            }

            try {
                // Get current user
                const user = await web3AuthService.getUser(token);
                if (user.user_type !== 'recipient' && user.user_type !== 'both') {
                    toast.error('Unauthorized access');
                    router.replace('/');
                    return;
                }

                // Fetch recipient profile for this user
                let recipientProfiles: RecipientProfile[] = [];
                try {
                    recipientProfiles = await profileService.listRecipientProfiles(token);
                } catch {
                    toast.error('Failed to load recipient profile');
                    return;
                }

                // Find the recipient profile that matches the user
                const recipientProfile = recipientProfiles.find((rp) => rp.user?.id === user.id);
                if (!recipientProfile) {
                    toast.error('Recipient profile not found');
                    return;
                }

                // Fetch payrolls
                let payrolls: Payroll[] = [];
                try {
                    payrolls = await payrollService.listPayrolls(token);
                } catch {
                    toast.error('Failed to load payroll data');
                }

                // Filter payrolls for the current recipient
                const recipientPayrolls = payrolls.filter((p) => p.recipient === recipientProfile.id);

                // Get completed payments
                const completed = recipientPayrolls.filter((p) => p.status === 'completed');
                setCompletedPayrolls(completed);

                // Calculate total salary
                const totalSalaryAmount = calculateTotalSalary(completed);

                // Get last payment and calculate next payment date
                const lastPayment = completed[0];
                const lastPaymentDate = lastPayment ? new Date(lastPayment.date) : new Date();

                // Calculate next payment date - should be end of next month
                const nextPaymentDate = calculateNextPaymentDate(lastPaymentDate);

                // Get next pending payment or create projected one
                const nextPayment =
                    recipientPayrolls.find(
                        (p) => p.status === 'pending' && new Date(p.date) > new Date()
                    ) ||
                    {
                        amount: lastPayment?.amount || '0',
                        date: nextPaymentDate.toISOString(),
                        status: 'projected',
                    };

                // Format the dashboard data
                setDashboardData({
                    totalSalary: totalSalaryAmount.toFixed(2),
                    lastPayment: {
                        amount: lastPayment ? formatPayrollAmount(lastPayment.amount) : '0',
                        date: lastPayment?.date || '-',
                        status: lastPayment?.status || '-',
                    },
                    nextPayment: {
                        amount: formatPayrollAmount(nextPayment.amount),
                        date: nextPayment.date,
                        dueIn: calculateDaysUntil(new Date(nextPayment.date)),
                    },
                });
            } catch (error: unknown) {
                const apiError = error as ApiError;
                if (apiError?.response?.status === 401) {
                    removeToken();
                    toast.error('Session expired. Please login again.');
                    router.replace('/');
                } else {
                    toast.error('Failed to load user data');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [token, router]);

    return {
        loading,
        initialLoad,
        dashboardData,
        completedPayrolls,
    };
}
