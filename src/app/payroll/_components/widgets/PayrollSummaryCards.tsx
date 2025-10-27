/**
 * PayrollSummaryCards Widget
 * Displays payroll statistics cards
 */

import React from 'react';
import type { PayrollStats } from '../../_types';
import { formatCurrency } from '../../_utils';

interface PayrollSummaryCardsProps {
  stats: PayrollStats;
  balance: string;
  isLoadingBalance: boolean;
  selectedToken: string;
}

export function PayrollSummaryCards({
  stats,
  balance,
  isLoadingBalance,
  selectedToken
}: PayrollSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Wallet Balance */}
      <div className="bg-black rounded-lg p-6 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-blue-500/20 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-400 text-sm mb-2">Wallet Balance</p>
          <h2 className="text-3xl font-semibold text-white">
            {isLoadingBalance ? (
              <div className="animate-pulse bg-gray-700 h-8 w-32 rounded" />
            ) : (
              `$${balance}`
            )}
          </h2>
          <p className="text-gray-500 text-xs mt-1">({selectedToken})</p>
        </div>
      </div>

      {/* Total Employees */}
      <div className="bg-black rounded-lg p-6 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-purple-500/20 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="purple" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-400 text-sm mb-2">Total Employees</p>
          <h2 className="text-3xl font-semibold text-white">{stats.totalEmployees}</h2>
          <p className="text-gray-500 text-xs mt-1">
            {stats.activeEmployees} active
          </p>
        </div>
      </div>

      {/* Total Payroll */}
      <div className="bg-black rounded-lg p-6 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-green-500/20 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-400 text-sm mb-2">Total Payroll</p>
          <h2 className="text-3xl font-semibold text-white">
            ${stats.totalAmount.toLocaleString()}
          </h2>
          <p className="text-gray-500 text-xs mt-1">All employees</p>
        </div>
      </div>
    </div>
  );
}
