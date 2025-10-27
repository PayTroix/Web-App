/**
 * LeaveRequestsCard Widget
 * Displays pending leave requests count with link to leave management
 */

import React from 'react';
import Link from 'next/link';

interface LeaveRequestsCardProps {
  count: number;
}

export function LeaveRequestsCard({ count }: LeaveRequestsCardProps) {
  return (
    <div className="col-span-full md:col-span-2 bg-black rounded-lg p-4 md:p-6 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
      <div className="flex items-center justify-between">
        <div>
          <div className="p-3 rounded-full">
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <line x1="16" y1="21" x2="16" y2="3" />
                <line x1="8" y1="21" x2="8" y2="3" />
              </svg>
            </div>
          </div>
          <div className="mt-16 gap-2 flex items-center">
            <h2 className="text-white text-3xl font-semibold">{count}</h2>
            <p className="text-gray-500 text-sm">Leave Requests</p>
          </div>
        </div>
        <Link href="/leaveManagement">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 hover:text-blue-500 transition-colors">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
