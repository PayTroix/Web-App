/**
 * EmployeesContent Component
 * Main employees/recipients management view
 */

'use client';

import React, { useState } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useWalletRedirect } from '@/hooks/useWalletRedirect';
import CreateRecipient from '@/components/CreateRecipient';
import { useEmployeesData } from '../_hooks/useEmployeesData';
import {
  TreasuryBalance,
  ActiveEmployeesCard,
  LeaveRequestsCard
} from './widgets';
import { EmployeesTable } from './EmployeesTable';

export function EmployeesContent() {
  useWalletRedirect();
  const { data, loading, refetch, removeEmployee } = useEmployeesData();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    refetch();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
        {/* Treasury Balance */}
        <TreasuryBalance 
          balance={data?.stats.treasuryBalance || '0'} 
          isLoading={loading}
        />

        {/* Active Employees */}
        <ActiveEmployeesCard
          activeEmployees={data?.stats.activeEmployees || 0}
          totalEmployees={data?.stats.totalEmployees || 0}
        />

        {/* Leave Requests */}
        <LeaveRequestsCard count={data?.stats.leaveRequests || 0} />
      </div>

      {/* Employees Table */}
      <EmployeesTable
        employees={data?.employees || []}
        onRemove={removeEmployee}
        onAddClick={() => setShowCreateModal(true)}
      />

      {/* Create Recipient Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
          <div className="relative w-full max-w-4xl animate-fade-in">
            <CreateRecipient
              onClose={() => setShowCreateModal(false)}
              onSuccess={handleCreateSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
}
