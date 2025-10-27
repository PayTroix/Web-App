/**
 * LeaveManagementContent Component
 * Main leave management view
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useWalletRedirect } from '@/hooks/useWalletRedirect';
import LeaveRequestModal from '@/components/dashboard/LeaveRequestModal';
import { useLeaveManagementData } from '../_hooks';
import { LeaveStatsCards, LeaveRequestsTable } from './widgets';
import type { LeaveRequest } from '../_types';

export function LeaveManagementContent() {
  useWalletRedirect();

  const { leaveRequests, stats, loading, refetch, approveRequest, declineRequest } =
    useLeaveManagementData();

  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  const handleApprove = async (id: number) => {
    await approveRequest(id);
  };

  const handleDecline = async (id: number) => {
    await declineRequest(id);
  };

  const handleCloseModal = () => {
    setSelectedRequest(null);
  };

  if (loading) {
    return <LoadingSpinner fullHeight />;
  }

  return (
    <div
      className={`flex flex-col gap-6 p-4 md:p-6 bg-[#0A0A0A] ${
        selectedRequest ? 'overflow-hidden' : ''
      }`}
    >
      {/* Header with back button */}
      <div className="mb-6 flex gap-8">
        <Link href="/dashboard" className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800">
          <ArrowLeft size={20} className="text-gray-100" />
        </Link>
        <h1 className="text-2xl text-gray-100 font-semibold">Leave Management</h1>
      </div>

      {/* Stats Grid */}
      <div
        className={`${
          selectedRequest ? 'filter blur-sm transition-all duration-200' : ''
        }`}
      >
        <LeaveStatsCards stats={stats} />
      </div>

      {/* Leave Requests Table */}
      <div
        className={`${
          selectedRequest ? 'filter blur-sm transition-all duration-200' : ''
        }`}
      >
        <LeaveRequestsTable
          leaveRequests={leaveRequests}
          onViewRequest={setSelectedRequest}
        />
      </div>

      {/* Modal */}
      {selectedRequest && (
        <LeaveRequestModal
          request={selectedRequest}
          onClose={handleCloseModal}
          onApprove={handleApprove}
          onDecline={handleDecline}
          onActionComplete={refetch}
        />
      )}
    </div>
  );
}
