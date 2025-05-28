'use client';
import React, { useEffect, useState, useRef } from 'react';
// import LiveLineChart from './LiveChart';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { notificationsService, profileService, web3AuthService } from '@/services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import WalletBalance from './WalletBalance';
import TotalEmployees from './TotalEmployees';
import ActiveEmployees from './ActiveEmployees';
import RecentActivity from './RecentActivity';
import { PendingRequest, PendingPayrollVolume } from './PendingRequest';
import { getToken, isTokenExpired, removeToken, storeToken } from '@/utils/token';
import { useWalletRedirect } from '@/hooks/useWalletRedirect';
import dynamic from 'next/dynamic';

interface DashboardData {
  totalEmployees: number;
  activeEmployees: number;
  performancePercentage: number;
  pendingRequests: number;
  pendingPayrollVolume: number;
  recentActivities: Array<{
    id: string;
    type: string;
    message: string;
    time: string;
    // icon is now optional, so we don't need to include it here
  }>;
}

const LiveLineChart = dynamic(
  () => import('./LiveChart'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

export const DashboardContent = () => {
  useWalletRedirect();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const router = useRouter();
  
  // Track previous address to detect actual changes
  const prevAddressRef = useRef<string | undefined>();

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
        if (!isConnected || !address) return; 

        setLoading(true);

        // Get current token
        let token = getToken();

        try {
          // Ensure wallet provider exists
          if (!walletProvider) {
            console.log('Waiting for wallet provider...');
            return; // Exit early and wait for provider
          }

          const provider = new ethers.BrowserProvider(walletProvider, chainId);
          const signer = await provider.getSigner();

          // If no token or token is expired, get a new one
          if (!token || isTokenExpired()) {
            const { nonce } = await web3AuthService.getNonce(address);
            const message = `I'm signing my one-time nonce: ${nonce}`;
            const signature = await signer.signMessage(message);

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
        } catch (error) {
          throw error;
        }
      } catch (error: unknown) {
        console.error('Error fetching dashboard data:', error);

        if (error instanceof Error && 'response' in error &&
          (error.response as { status?: number })?.status === 401) {
          removeToken();
          toast.error('Session expired. Please reconnect your wallet.');
          // Redirect to landing page on auth error
          router.push('/');
        } else {
          // Show a more specific error message
          toast.error('Unable to load dashboard. Please check your wallet connection.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isConnected && address && walletProvider) {
      fetchData();
    }
  }, [address, chainId, isConnected, walletProvider, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Treasury Wallet Balance */}
        <WalletBalance />

        {/* Total Employees */}
        <TotalEmployees totalEmployees={data ? data.totalEmployees : 0} />

        {/* Active Employees */}
        <ActiveEmployees
          activeEmployees={data?.activeEmployees || 0}
          performancePercentage={data?.performancePercentage || 0}
        />
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Annual Payroll Reports Chart */}
        <div className="bg-black border border-[#2C2C2C] rounded-lg p-6 col-span-4 items-center justify-center">
          <LiveLineChart />
        </div>

        {/* Recent Activity Panel */}
        <RecentActivity activities={data ? data.recentActivities : []} />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PendingRequest count={data?.pendingRequests || 0} />
        <PendingPayrollVolume volume={data?.pendingPayrollVolume || 0} />
      </div>
    </div>
  );
};

export default DashboardContent;