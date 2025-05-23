import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { payrollService } from '@/services/api';
import { getToken } from '@/utils/token';
import { ethers } from 'ethers';

interface PayrollSummary {
  total_paid: number;
  total_pending: number;
  total_entries: number;
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    notation: value > 999999 ? 'compact' : 'standard',
    compactDisplay: 'short'
  }).format(value);
};

const formatTokenAmount = (value: number): string => {
  try {
    // Convert the value to string and format it with 6 decimals (USDT)
    const formattedAmount = ethers.formatUnits(value.toString(), 6);

    // Format the number with commas and 2 decimal places
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      notation: Number(formattedAmount) > 999999 ? 'compact' : 'standard',
      compactDisplay: 'short'
    }).format(Number(formattedAmount));
  } catch (error) {
    console.error('Error formatting token amount:', error);
    return '0.00';
  }
};

export const PendingRequest = ({ count = 0 }) => {
  return (
    <div className="bg-black border border-[#2C2C2C] rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h2 className="text-white text-lg font-medium">Salary Advancement</h2>
        </div>
        <div className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-white text-4xl font-semibold">{formatNumber(count)}</h2>
        <p className="text-gray-500 text-sm">Pending Request</p>
      </div>
    </div>
  );
};

interface PendingPayrollVolumeProps {
  volume: number;
}

export const PendingPayrollVolume: React.FC<PendingPayrollVolumeProps> = ({ volume = 0 }) => {
  const [summary, setSummary] = useState<PayrollSummary | null>(null);

  useEffect(() => {
    const fetchPayrollSummary = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const data = await payrollService.getPayrollSummary(token);
        setSummary(data);
      } catch (error) {
        console.error('Error fetching payroll summary:', error);
      }
    };

    fetchPayrollSummary();
  }, []);

  return (
    <Link href="/payroll" className="bg-black border border-[#2C2C2C] rounded-lg p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-medium">Pending Payroll Volume</h3>
          <span className="text-blue-500 text-sm">View All</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-white">
                ${formatTokenAmount(summary?.total_pending || 0)}
              </p>
              <span className="text-gray-400 text-sm">USDT</span>
            </div>
            <p className="text-gray-400 text-sm">Pending Payrolls</p>
          </div>
        </div>
      </div>
    </Link>
  );
};