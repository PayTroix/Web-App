/**
 * useEmployeesData Hook
 * Handles fetching and managing employees/recipients data
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useWalletClient } from 'wagmi';
import toast from 'react-hot-toast';
import { profileService, web3AuthService, leaveRequestService } from '@/services/api';
import { getToken, isTokenExpired, removeToken, storeToken } from '@/utils/token';
import useTokenBalances from '@/hooks/useBalance';
import { transformRecipient } from '../_utils';
import type { EmployeesData, Recipient, RecipientProfile } from '../_types';

export function useEmployeesData() {
    const [data, setData] = useState<EmployeesData | null>(null);
    const [loading, setLoading] = useState(true);
    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const { balances, getTokenBalances } = useTokenBalances();
    const router = useRouter();
    const prevAddressRef = useRef<string | undefined>(undefined);

    // Handle address changes - redirect to landing page
    useEffect(() => {
        if (prevAddressRef.current !== undefined && prevAddressRef.current !== address) {
            const token = getToken();
            if (token) {
                removeToken();
            }

            toast.error('Wallet address changed. Redirecting to landing page...');
            router.push('/');
            return;
        }

        prevAddressRef.current = address;
    }, [address, router]);

    const fetchData = useCallback(async () => {
        if (!isConnected || !address || !walletClient) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            let token = getToken();

            // Get/refresh token if needed
            if (!token || isTokenExpired()) {
                const { nonce } = await web3AuthService.getNonce(address);
                const message = `I'm signing my one-time nonce: ${nonce}`;

                const signature = await walletClient.signMessage({
                    message,
                    account: address as `0x${string}`
                });

                const authResponse = await web3AuthService.login({
                    address,
                    signature
                });

                token = authResponse.access;
                if (!token) {
                    throw new Error('Failed to get token');
                }
                storeToken(token);
            }

            // Fetch balance if not loaded
            if (balances.USDT === '0' && balances.USDC === '0' && !balances.loading) {
                await getTokenBalances(address);
            }

            // Fetch organization profile and leave requests
            const [orgProfile, leaveRequests] = await Promise.all([
                profileService.listOrganizationProfiles(token),
                leaveRequestService.getUserLeaveRequests("organization", token)
            ]);

            const recipientProfiles = orgProfile[0];
            const recipients: RecipientProfile[] = recipientProfiles.recipients || [];

            // Transform employees
            const transformedEmployees: Recipient[] = Array.isArray(recipients)
                ? recipients.map(transformRecipient)
                : [];

            // Count pending leave requests
            const pendingRequests = Array.isArray(leaveRequests)
                ? leaveRequests.filter(req => req.status === 'pending').length
                : 0;

            const activeCount = transformedEmployees.filter(e => e.status === 'active').length;
            const balance = balances.loading ? '...' : balances.USDT || balances.USDC || '0';

            setData({
                employees: transformedEmployees,
                stats: {
                    totalEmployees: transformedEmployees.length,
                    activeEmployees: activeCount,
                    leaveRequests: pendingRequests,
                    treasuryBalance: balance
                }
            });
        } catch (error: unknown) {
            console.error('Error fetching employees data:', error);

            if (error && typeof error === 'object' && 'response' in error &&
                error.response && typeof error.response === 'object' &&
                'status' in error.response && error.response.status === 401) {
                removeToken();
                toast.error('Session expired.');
                setTimeout(() => {
                    router.replace('/');
                }, 1500);
            } else {
                toast.error('Failed to load employees data\nPlease refresh the page.');
            }
        } finally {
            setLoading(false);
        }
    }, [isConnected, address, walletClient, balances, getTokenBalances, router]);

    // Remove employee
    const removeEmployee = useCallback(async (id: number) => {
        if (!data) return;

        // Optimistically update UI
        const employeeToRemove = data.employees.find(e => e.id === id);
        const newEmployees = data.employees.filter(e => e.id !== id);
        const newActiveCount = employeeToRemove?.status === 'active'
            ? data.stats.activeEmployees - 1
            : data.stats.activeEmployees;

        setData({
            employees: newEmployees,
            stats: {
                ...data.stats,
                totalEmployees: data.stats.totalEmployees - 1,
                activeEmployees: newActiveCount
            }
        });

        const loadingToast = toast.loading('Removing employee...');

        try {
            const token = getToken();
            if (!token || isTokenExpired()) {
                throw new Error('Authentication required');
            }

            await profileService.deleteRecipientProfile(id, token);
            toast.success('Employee removed successfully', { id: loadingToast });
        } catch (error) {
            // Rollback optimistic update
            if (employeeToRemove && data) {
                setData({
                    employees: [...newEmployees, employeeToRemove],
                    stats: {
                        ...data.stats,
                        totalEmployees: data.stats.totalEmployees,
                        activeEmployees: data.stats.activeEmployees
                    }
                });
            }

            console.error('Error removing recipient:', error);

            if (error && typeof error === 'object' && 'response' in error &&
                error.response && typeof error.response === 'object' &&
                'status' in error.response && error.response.status === 401) {
                removeToken();
                toast.error('Session expired. Please refresh the page.', { id: loadingToast });
            } else {
                toast.error('Failed to remove employee', { id: loadingToast });
            }
        }
    }, [data]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        loading,
        refetch: fetchData,
        removeEmployee
    };
}
