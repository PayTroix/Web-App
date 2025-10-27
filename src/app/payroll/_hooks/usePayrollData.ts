/**
 * usePayrollData Hook
 * Handles fetching and managing payroll data and disbursement operations
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useWalletClient } from 'wagmi';
import { parseUnits } from 'ethers';
import toast from 'react-hot-toast';
import { profileService } from '@/services/api';
import { getToken, isTokenExpired, removeToken, storeToken } from '@/utils/token';
import useTokenBalances from '@/hooks/useBalance';
import { transformRecipientToEmployee, calculateTotalAmount, filterRecipientsByGroup } from '../_utils';
import type { Employee, Recipient, PayrollStats, RecipientProfiles, RecipientGroup } from '../_types';
import { USDT_DECIMALS } from '../_constants';

export function usePayrollData() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [stats, setStats] = useState<PayrollStats>({
        totalEmployees: 0,
        activeEmployees: 0,
        totalAmount: 0
    });
    const [loading, setLoading] = useState(true);
    const [isDisbursing, setIsDisbursing] = useState(false);

    const { address, isConnected } = useAccount();
    const { data: walletClient } = useWalletClient();
    const { balances, getTokenBalances } = useTokenBalances();
    const router = useRouter();
    const prevAddressRef = useRef<string | undefined>(undefined);

    // Handle address changes
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

    // Fetch payroll data
    const fetchData = useCallback(async (selectedToken: string = 'USDT') => {
        if (!isConnected || !address) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const token = getToken();
            if (!token || isTokenExpired()) {
                setLoading(false);
                return;
            }

            await getTokenBalances(address);

            const orgProfile = await profileService.listOrganizationProfiles(token);
            const recipientProfiles: RecipientProfiles = orgProfile[0];

            if (recipientProfiles && recipientProfiles.recipients) {
                const allRecipients = recipientProfiles.recipients;
                setRecipients(allRecipients);

                const totalCount = allRecipients.length;
                const activeCount = allRecipients.filter(r => r.status === 'active').length;
                const totalAmount = calculateTotalAmount(allRecipients, 'all');

                setStats({
                    totalEmployees: totalCount,
                    activeEmployees: activeCount,
                    totalAmount
                });

                // Display first 5 employees
                const filteredEmployees = allRecipients
                    .slice(0, 5)
                    .map((recipient: Recipient) => transformRecipientToEmployee(recipient, selectedToken));

                setEmployees(filteredEmployees);
            }
        } catch (error) {
            console.error('Error fetching payroll data:', error);
            toast.error('Failed to load payroll data');
        } finally {
            setLoading(false);
        }
    }, [isConnected, address, getTokenBalances]);

    // Calculate amount for selected group
    const getGroupTotalAmount = useCallback((selectedGroup: RecipientGroup): number => {
        return calculateTotalAmount(recipients, selectedGroup);
    }, [recipients]);

    // Get filtered recipients by group
    const getFilteredRecipients = useCallback((selectedGroup: RecipientGroup): Recipient[] => {
        return filterRecipientsByGroup(recipients, selectedGroup);
    }, [recipients]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        employees,
        recipients,
        stats,
        loading,
        isDisbursing,
        setIsDisbursing,
        balances,
        refetch: fetchData,
        getGroupTotalAmount,
        getFilteredRecipients
    };
}
