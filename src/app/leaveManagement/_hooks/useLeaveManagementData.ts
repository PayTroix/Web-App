/**
 * useLeaveManagementData Hook
 * Manages leave requests data and operations
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { leaveRequestService } from '@/services/api';
import { getToken, removeToken } from '@/utils/token';
import { isCurrentlyOnLeave } from '../_utils';
import type { LeaveRequest } from '@/services/api';
import type { LeaveStats } from '../_types';

export function useLeaveManagementData() {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [stats, setStats] = useState<LeaveStats>({
        approved: 0,
        pending: 0,
        declined: 0,
        totalEmployees: 0,
        activeEmployeesPercentage: 0,
    });
    const [loading, setLoading] = useState(true);
    const { address } = useAccount();
    const router = useRouter();
    const prevAddressRef = useRef<string | undefined>(undefined);

    // Handle address changes - redirect to landing page
    useEffect(() => {
        // Skip on initial mount when prevAddressRef.current is undefined
        if (prevAddressRef.current !== undefined && prevAddressRef.current !== address) {
            // Address actually changed, remove token and redirect
            const token = getToken();
            if (token) {
                removeToken();
            }

            // Redirect to landing page
            toast.error('Wallet address changed. Redirecting to landing page...');
            router.push('/');
            return;
        }

        // Update the previous address reference
        prevAddressRef.current = address;
    }, [address, router]);

    // Fetch leave requests and calculate stats
    const fetchLeaveData = async () => {
        const token = getToken();
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const requests = await leaveRequestService.getUserLeaveRequests('organization', token);
            setLeaveRequests(requests);

            // Calculate stats
            const approved = requests.filter((req) => req.status === 'approved').length;
            const pending = requests.filter((req) => req.status === 'pending').length;
            const declined = requests.filter((req) => req.status === 'rejected').length;
            const uniqueEmployees = new Set(requests.map((req) => req.recipient.id)).size;

            // Calculate active employees percentage
            const employeesOnLeave = requests.filter(isCurrentlyOnLeave).length;

            const activeEmployeesPercentage =
                uniqueEmployees > 0
                    ? Math.round(((uniqueEmployees - employeesOnLeave) / uniqueEmployees) * 100)
                    : 0;

            setStats({
                approved,
                pending,
                declined,
                totalEmployees: uniqueEmployees,
                activeEmployeesPercentage,
            });
        } catch (error) {
            console.error('Error fetching leave data:', error);
            toast.error('Failed to fetch leave data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeaveData();
    }, []);

    // Refetch leave requests
    const refetch = async () => {
        try {
            const token = getToken();
            if (!token) return;
            const requests = await leaveRequestService.getUserLeaveRequests('organization', token);
            setLeaveRequests(requests);
        } catch (error) {
            console.error('Error fetching leave requests:', error);
            toast.error('Failed to fetch leave requests');
        }
    };

    // Approve leave request
    const approveRequest = async (id: number) => {
        try {
            const token = getToken();
            if (!token) return;
            await leaveRequestService.approveLeaveRequest(id, token);
            toast.success('Leave request approved');
            await refetch();
        } catch (error) {
            console.error('Error approving leave request:', error);
            toast.error('Failed to approve leave request');
        }
    };

    // Decline leave request
    const declineRequest = async (id: number) => {
        try {
            const token = getToken();
            if (!token) return;
            await leaveRequestService.updateLeaveRequest(id, { status: 'rejected' }, token);
            toast.success('Leave request declined');
            await refetch();
        } catch (error) {
            console.error('Error declining leave request:', error);
            toast.error('Failed to decline leave request');
        }
    };

    return {
        leaveRequests,
        stats,
        loading,
        refetch,
        approveRequest,
        declineRequest,
    };
}
