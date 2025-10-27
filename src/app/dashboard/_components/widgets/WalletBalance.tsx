/**
 * WalletBalance Widget
 * Displays the organization's treasury wallet balance
 */

import React, { useEffect } from 'react';
import { useAccount } from 'wagmi';
import useTokenBalances from '@/hooks/useBalance';

export function WalletBalance() {
  const { address, isConnected } = useAccount();
  const { balances, getTokenBalances } = useTokenBalances();
  const balance = balances.loading ? '...' : balances.USDT || balances.USDC || '0';

  useEffect(() => {
    if (isConnected && address) {
      getTokenBalances(address);
    }
  }, [isConnected, address, getTokenBalances]);

  return (
    <div className="bg-black border border-[#2C2C2C] rounded-lg p-4 md:p-6 
      col-span-full md:col-span-3 transition-all duration-300 hover:border-blue-500/20">
      <div className="flex items-center justify-between mb-4">
        <div className="bg-white/10 p-3 rounded-full transition-transform hover:scale-105">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <div className="text-white opacity-50 hover:opacity-100 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <p className="text-gray-400 text-sm">Treasury wallet balance</p>
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl md:text-4xl font-semibold text-white">
            {balances.loading ? (
              <div className="animate-pulse bg-gray-700 h-8 w-32 rounded" />
            ) : (
              balance
            )}
          </h2>
          <p className="text-gray-400 text-sm">(USDT)</p>
        </div>
      </div>
    </div>
  );
}
