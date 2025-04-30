'use client';
import React, { useEffect, useState } from 'react';
import LiveLineChart from './LiveChart';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { ethers } from 'ethers';
import abi from '@/services/abi.json';
import { notificationsService, profileService, web3AuthService } from '@/services/api';
import toast from 'react-hot-toast';

import WalletBalance from './WalletBalance';
import TotalEmployees from './TotalEmployees';
import ActiveEmployees from './ActiveEmployees';
import RecentActivity from './RecentActivity';
import { PendingRequest, PendingPayrollVolume } from './PendingRequest';
import { getToken, isTokenExpired, removeToken, storeToken } from '@/app/register/token';

interface DashboardData {
  // treasuryBalance: string;
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
    icon: React.ReactNode;
  }>;
}

// Default recent activities with icons
const defaultRecentActivities = [
  { 
    id: '1', 
    type: 'Employee Added', 
    message: 'New employee was added', 
    time: '2 hours ago',
    icon: (
      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      </div>
    )
  },
  { 
    id: '2', 
    type: 'Payment Sent', 
    message: 'Payroll was processed successfully', 
    time: '1 day ago',
    icon: (
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </div>
    )
  },
  { 
    id: '3', 
    type: 'System Update', 
    message: 'System update was completed successfully', 
    time: '1 day ago',
    icon: (
      <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      </div>
    )
  },
];

export const DashboardContent = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');

  useEffect(() => {
    const fetchData = async () => {
        if (!isConnected || !address) return;
        
        setLoading(true);
        try {
            const provider = new ethers.BrowserProvider(walletProvider, chainId);
            const signer = await provider.getSigner();
            
            let token = getToken();
            
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
                // Assuming your authResponse includes expiresIn (in seconds)
                storeToken(token as string, authResponse.expiresIn || 3600); // Default to 1 hour if not provided
            }

          const [_orgProfile, recipientProfiles, notifications] = await Promise.all([
            profileService.listOrganizationProfiles(token),
            profileService.getOrganizationRecipients(token),
            notificationsService.listNotifications(token)
          ]);

          // Safely access recipients - handle potential undefined values
          const recipients = _orgProfile[0].recipients || [];
          const recipientsLength = Array.isArray(recipients) ? recipients.length : 0;
          
          // Safely access notifications - handle potential undefined values
          const notificationsList = Array.isArray(notifications) ? notifications : [];

          const contractAddress = process.env.NEXT_PUBLIC_LISK_CONTRACT_ADDRESS as string;
          const payrollContract = new ethers.Contract(contractAddress, abi, signer);
          
          // const _orgDetails = await payrollContract.getOrganizationDetails(address);
          // const _orgContractAddress = await payrollContract.getOrganizationContract(address);
       
          const dashboardData: DashboardData = {
            // treasuryBalance: `$${parseFloat(treasuryBalance).toLocaleString()}`,
            totalEmployees: recipientsLength,
            activeEmployees: recipientsLength,
            performancePercentage: recipientsLength > 0 ? 
              Math.round((recipientsLength / recipientsLength) * 100) : 0,
            pendingRequests: 6, // Replace with actual data
            pendingPayrollVolume: 6, // Replace with actual data
            recentActivities: recipientsLength > 0 ? 
                  notificationsList
                    .slice(0, 5)
                    .map((notification, index) => ({
                      id: notification.id?.toString() || index.toString(),
                      type: notification.type || 'Notification',
                      message: notification.message || 'System notification',
                      time: notification.created_at || 'Recently',
                      icon: defaultRecentActivities[Math.min(index, defaultRecentActivities.length - 1)].icon 
                    }))
                  : []
          };

          setData(dashboardData);
        } catch (error: unknown) {
          console.error('Error fetching dashboard data:', error);
          // If the error is due to token expiration, remove the token
          if (error instanceof Error && 'response' in error && (error.response as { status?: number })?.status === 401) {
              removeToken();
              toast.error('Session expired. Please refresh the page.');
          } else {
              toast.error('Failed to load dashboard data');
          }
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [isConnected, address, walletProvider, chainId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
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