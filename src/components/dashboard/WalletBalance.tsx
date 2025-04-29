import useTokenBalances from '@/hook/useBalance';
import { useAppKitAccount, useAppKitProvider, type Provider } from '@reown/appkit/react';
import React, { useEffect } from 'react';

const WalletBalance = () => {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  
  const { balances, getTokenBalances } = useTokenBalances();
  const balance = balances.loading ? '...' : balances.USDT || balances.USDC || '0';

  useEffect(() => {
    if (isConnected && address && walletProvider) {
      getTokenBalances(address, walletProvider);
    }
  }, [isConnected, address, walletProvider, getTokenBalances]);


  return (
    <div className="bg-black border border-[#2C2C2C] rounded-lg p-6 flex flex-col col-span-3 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="bg-white p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <div className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
      <p className="text-gray-400 mt-16">Treasury wallet balance</p>
      <div className="flex items-center gap-2">
        <h2 className="text-white text-4xl font-semibold mt-2">{balance}</h2>
        <p className="text-gray-400 text-sm">(USDT)</p>
      </div>
    </div>
  );
};

export default WalletBalance;