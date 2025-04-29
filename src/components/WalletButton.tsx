'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect } from '@reown/appkit/react';
import { displayAddress } from '@/utils';
import { ChevronDown } from 'lucide-react';
import { mainnet, sepolia, lisk, liskSepolia, base, baseSepolia } from '@reown/appkit/networks'

type WalletButtonProps = {
  className?: string;
};

const WalletButton: React.FC<WalletButtonProps> = ({ className = '' }) => {
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { chainId, caipNetwork: chain, switchNetwork } = useAppKitNetwork();
  const { disconnect } = useDisconnect();
  const [isNetworkMenuOpen, setIsNetworkMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const networkRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const chains = [mainnet, sepolia, lisk, liskSepolia, base, baseSepolia]

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (networkRef.current && !networkRef.current.contains(event.target as Node)) {
        setIsNetworkMenuOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle wallet connection
  const handleConnect = () => {
    open({ view: 'Connect' });
  };

  // Handle account menu toggle
  const handleAccountToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAccountMenuOpen(prev => !prev);
    setIsNetworkMenuOpen(false);
  };

  // Handle network menu toggle
  const handleNetworkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNetworkMenuOpen(prev => !prev);
    setIsAccountMenuOpen(false);
  };

  // Handle network switch
  const handleNetworkSwitch = (networkId: number) => {
    const targetChain = chains.find(chain => chain.id === networkId);
    if (targetChain) {
      switchNetwork(targetChain);
    }
    setIsNetworkMenuOpen(false);
  };

  // Handle wallet disconnection
  const handleDisconnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await disconnect();
    setIsAccountMenuOpen(false);
  };

  if (!isConnected || !address) {
    return (
      <button
        onClick={handleConnect}
        className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded flex items-center justify-center ${className}`}
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Network Selector */}
      <div className="relative" ref={networkRef}>
        <button 
          onClick={handleNetworkToggle}
          className="flex items-center text-gray-300 border border-gray-700 rounded-md px-3 py-1 text-sm hover:bg-gray-800"
        >
          {chain?.name || 'Network'} <ChevronDown className="ml-1 w-4 h-4" />
        </button>
        
        {isNetworkMenuOpen && (
          <div className="absolute mt-1 w-48 bg-black border border-gray-700 rounded-md shadow-lg z-50">
            {chains.map(network => (
              <button
                key={network.id}
                onClick={() => handleNetworkSwitch(network.id)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-800 ${
                  network.id === chainId ? 'text-blue-500' : 'text-gray-300'
                }`}
              >
                {network.name}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Connected Account */}
      <div className="relative" ref={accountRef}>
        <button
          onClick={handleAccountToggle}
          className="flex items-center text-blue-400 bg-opacity-20 border border-gray-700 rounded-md px-3 py-1 hover:bg-gray-800"
        >
          <span className="mr-2">✓</span>
          <span className="text-sm">{displayAddress(address)}</span>
          <ChevronDown className="ml-1 w-4 h-4" />
        </button>
        
        {isAccountMenuOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-black border border-gray-700 rounded-md shadow-lg z-50">
            <button
              onClick={() => open({ view: 'Account' })}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
            >
              Account Details
            </button>
            <button
              onClick={handleDisconnect}
              className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletButton;