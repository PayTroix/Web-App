"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import Link from 'next/link';
import { leaveRequestService } from '@/services/api';
import { getToken, removeToken } from '@/utils/token';
import { differenceInDays } from 'date-fns';
import { LeaveRequest } from '@/services/api';
import LeaveRequestModal from './LeaveRequestModal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useWalletRedirect } from '@/hooks/useWalletRedirect';
import { toast } from 'react-hot-toast';
import { useAppKitAccount } from '@reown/appkit/react';
import { useRouter } from 'next/navigation';

interface LeaveStats {
  approved: number;
  pending: number;
  declined: number;
  totalEmployees: number;
  activeEmployeesPercentage: number;
}

export default function LeaveManagement() {
  useWalletRedirect();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [stats, setStats] = useState<LeaveStats>({
    approved: 0,
    pending: 0,
    declined: 0,
    totalEmployees: 0,
    activeEmployeesPercentage: 0  // Changed from 100 to 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const token = getToken();
  const { address } = useAppKitAccount();
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
    const fetchLeaveData = async () => {
      if (!token) return;

      try {
        const requests = await leaveRequestService.getUserLeaveRequests("organization", token);
        setLeaveRequests(requests);

        // Calculate stats
        const approved = requests.filter(req => req.status === 'approved').length;
        const pending = requests.filter(req => req.status === 'pending').length;
        const declined = requests.filter(req => req.status === 'rejected').length;
        const uniqueEmployees = new Set(requests.map(req => req.recipient.id)).size;

        // Calculate active employees percentage
        const currentDate = new Date();
        const employeesOnLeave = requests.filter(req =>
          req.status === 'approved' &&
          new Date(req.start_date) <= currentDate &&
          new Date(req.end_date) >= currentDate
        ).length;

        const activeEmployeesPercentage = uniqueEmployees > 0
          ? Math.round(((uniqueEmployees - employeesOnLeave) / uniqueEmployees) * 100)
          : 0;  // Changed from 100 to 0

        setStats({
          approved,
          pending,
          declined,
          totalEmployees: uniqueEmployees,
          activeEmployeesPercentage
        });
      } catch (error) {
        console.error('Error fetching leave data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveData();
  }, [token]);

  const fetchLeaveRequests = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const requests = await leaveRequestService.getUserLeaveRequests("organization", token);
      setLeaveRequests(requests);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      toast.error('Failed to fetch leave requests');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const token = getToken();
      if (!token) return;
      await leaveRequestService.approveLeaveRequest(id, token);
      toast.success('Leave request approved');
    } catch (error) {
      console.error('Error approving leave request:', error);
      toast.error('Failed to approve leave request');
    }
  };

  const handleDecline = async (id: number) => {
    try {
      const token = getToken();
      if (!token) return;
      await leaveRequestService.updateLeaveRequest(id, { status: 'rejected' }, token);
      toast.success('Leave request declined');
    } catch (error) {
      console.error('Error declining leave request:', error);
      toast.error('Failed to decline leave request');
    }
  };

  if (loading) {
    return <LoadingSpinner fullHeight />;
  }

  return (
    <div className={`flex flex-col gap-6 p-4 md:p-6 bg-[#0A0A0A] ${selectedRequest ? 'overflow-hidden' : ''}`}>
      {/* Header with back button */}
      <div className="mb-6 flex gap-8">
        <Link href="/dashboard" className="p-2 rounded-full bg-neutral-900 hover:bg-neutral-800">
          <ArrowLeft size={20} className="text-gray-100" />
        </Link>
        <h1 className="text-2xl text-gray-100 font-semibold">Leave Management</h1>
      </div>

      {/* Stats Grid - Moved to top */}
      <div className={`grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6 ${selectedRequest ? 'filter blur-sm transition-all duration-200' : ''}`}>
        {/* Approved Card */}
        <div className="col-span-full md:col-span-3 bg-[#111111] rounded-lg p-4 md:p-6 border border-[#333333] transition-all duration-300 hover:border-blue-500/40">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="text-blue-400" size={24} />
              </div>
              <div className='mt-12'>
                <h2 className="text-4xl font-bold text-gray-100">{stats.approved}</h2>
                <p className="text-gray-400 text-sm">Approved This Month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Active Employee Card */}
        <div className="col-span-full md:col-span-1 bg-[#111111] rounded-lg p-4 md:p-6 border border-[#333333] transition-all duration-300 hover:border-blue-500/40">
          <div className="relative w-24 h-24 mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#333" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="40"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 * (1 - (stats.activeEmployeesPercentage / 100))}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-xl font-bold text-gray-100">{stats.activeEmployeesPercentage}%</div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <h2 className="text-4xl font-bold text-gray-100">{stats.totalEmployees}</h2>
            <p className="text-gray-400 text-sm">Active employee</p>
          </div>
        </div>

        {/* Declined Card */}
        <div className="col-span-full md:col-span-2 bg-[#111111] rounded-lg p-4 md:p-6 border border-[#333333] transition-all duration-300 hover:border-blue-500/40">
          <div className="flex items-center justify-between">
            <div>
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <X className="text-red-400" size={24} />
              </div>
              <div className='mt-12'>
                <h2 className="text-4xl font-bold text-gray-100">{stats.declined}</h2>
                <p className="text-gray-400 text-sm">Declined Requests</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table section - Moved to bottom */}
      <div className={`bg-[#111111] border border-[#333333] rounded-lg p-6 ${selectedRequest ? 'filter blur-sm transition-all duration-200' : ''}`}>
        <h2 className="text-xl font-bold mb-6 text-gray-100">Leave Request</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#333333] text-gray-400 text-sm">
                <th className="pb-4 text-left font-medium">Recipient</th>
                <th className="pb-4 text-left font-medium">Leave Type</th>
                <th className="pb-4 text-left font-medium">Days</th>
                <th className="pb-4 text-left font-medium">Reason</th>
                <th className="pb-4 text-left font-medium">Status</th>
                <th className="pb-4 text-left font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((request) => (
                <tr key={request.id} className="border-b border-[#333333]">
                  <td className="py-4 text-gray-300">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        {request.recipient.image ? (
                          <Image
                            src={request.recipient.image}
                            alt={request.recipient.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white">
                            {request.recipient.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <span className="text-gray-200">{request.recipient.name}</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-300">{request.leave_type}</td>
                  <td className="py-4 text-gray-300">
                    {differenceInDays(new Date(request.end_date), new Date(request.start_date))} Days
                  </td>
                  <td className="py-4 text-gray-300">{request.reason}</td>
                  <td className="py-4">
                    <span className={`
                      ${request.status === 'approved' ? 'text-green-400' : ''}
                      ${request.status === 'pending' ? 'text-yellow-400' : ''}
                      ${request.status === 'rejected' ? 'text-red-400' : ''}
                    `}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded px-5 py-2 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selectedRequest && (
        <LeaveRequestModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onApprove={handleApprove}
          onDecline={handleDecline}
          onActionComplete={fetchLeaveRequests}
        />
      )}
    </div>
  );
}