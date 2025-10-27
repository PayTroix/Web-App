/**
 * LeaveRequestsTable Component
 * Displays all leave requests in a table format
 */

'use client';

import Image from 'next/image';
import { calculateLeaveDays, getStatusColorClass, capitalizeFirst } from '../../_utils';
import type { LeaveRequest } from '../../_types';

interface LeaveRequestsTableProps {
  leaveRequests: LeaveRequest[];
  onViewRequest: (request: LeaveRequest) => void;
}

export function LeaveRequestsTable({ leaveRequests, onViewRequest }: LeaveRequestsTableProps) {
  return (
    <div className="bg-[#111111] border border-[#333333] rounded-lg p-6">
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
            {leaveRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
                  No leave requests found
                </td>
              </tr>
            ) : (
              leaveRequests.map((request) => (
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
                    {calculateLeaveDays(request.start_date, request.end_date)} Days
                  </td>
                  <td className="py-4 text-gray-300">{request.reason}</td>
                  <td className="py-4">
                    <span className={getStatusColorClass(request.status)}>
                      {capitalizeFirst(request.status)}
                    </span>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => onViewRequest(request)}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded px-5 py-2 transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
