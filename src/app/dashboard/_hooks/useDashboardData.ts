/**
 * useDashboardData Hook
 * Handles fetching and managing dashboard data
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount, useWalletClient } from 'wagmi';
import toast from 'react-hot-toast';
import { notificationsService, profileService, web3AuthService } from '@/services/api';
import { getToken, isTokenExpired, removeToken, storeToken } from '@/utils/token';
import type { DashboardData } from '../_types';

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First check if wallet is connected
        if (!isConnected || !address || !walletClient) {
          setLoading(false);
          return;
        }

        setLoading(true);

        // Get current token
        let token = getToken();

        // If no token or token is expired, get a new one
        if (!token || isTokenExpired()) {
          const { nonce } = await web3AuthService.getNonce(address);
          const message = `I'm signing my one-time nonce: ${nonce}`;
          
          // Sign message using wagmi's wallet client
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

        // Fetch data with valid token
        const [_orgProfile, notifications] = await Promise.all([
          profileService.listOrganizationProfiles(token),
          notificationsService.listNotifications(token)
        ]);

        // Add type guard and null checks
        if (!Array.isArray(_orgProfile) || _orgProfile.length === 0) {
          throw new Error('No organization profile found');
        }

        const orgProfile = _orgProfile[0];
        const recipients = orgProfile?.recipients ?? [];
        const recipientsCount = Array.isArray(recipients) ? recipients.length : 0;
        const notificationsList = Array.isArray(notifications) ? notifications : [];

        const dashboardData: DashboardData = {
          totalEmployees: recipientsCount,
          activeEmployees: recipientsCount,
          performancePercentage: recipientsCount > 0 ? 100 : 0,
          pendingRequests: 0,
          pendingPayrollVolume: 0,
          recentActivities: notificationsList
            .slice(0, 5)
            .map((notification, index) => ({
              id: String(notification.id ?? index),
              type: notification.type ?? 'Notification',
              message: notification.message ?? 'System notification',
              time: notification.created_at ?? 'Recently'
            }))
        };

        setData(dashboardData);
      } catch (error: unknown) {
        console.error('Error fetching dashboard data:', error);

        if (error instanceof Error && 'response' in error &&
          (error.response as { status?: number })?.status === 401) {
          removeToken();
          toast.error('Session expired. Please reconnect your wallet.');
          router.push('/');
        } else {
          toast.error('Unable to load dashboard. Please check your wallet connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isConnected && address && walletClient) {
      fetchData();
    }
  }, [address, isConnected, walletClient, router]);

  return { data, loading };
}
