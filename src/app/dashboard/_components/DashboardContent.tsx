/**
 * DashboardContent Component
 * Main dashboard layout with all widgets
 */

'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useWalletRedirect } from '@/hooks/useWalletRedirect';
import { useDashboardData } from '../_hooks/useDashboardData';
import {
  WalletBalance,
  TotalEmployees,
  ActiveEmployees,
  PendingRequest,
  PendingPayrollVolume,
  RecentActivityWidget
} from './widgets';

const LiveLineChart = dynamic(
  () => import('@/components/dashboard/LiveChart'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false
  }
);

export function DashboardContent() {
  useWalletRedirect();
  const { data, loading } = useDashboardData();

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
        <TotalEmployees totalEmployees={data?.totalEmployees || 0} />

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
        <RecentActivityWidget activities={data?.recentActivities || []} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PendingRequest count={data?.pendingRequests || 0} />
        <PendingPayrollVolume volume={data?.pendingPayrollVolume || 0} />
      </div>
    </div>
  );
}
