'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect } from '@reown/appkit/react';
import { displayAddress } from '@/utils';
import { ChevronDown } from 'lucide-react';
import { mainnet, sepolia, lisk, liskSepolia, base, baseSepolia } from '@reown/appkit/networks';
import { removeToken } from '@/utils/token';

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

  const chains = [mainnet, sepolia, lisk, liskSepolia, base, baseSepolia];

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

  // Close menus when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsNetworkMenuOpen(false);
      setIsAccountMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleConnect = () => {
    open({ view: 'Connect' });
  };

  const handleAccountToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAccountMenuOpen(prev => !prev);
    setIsNetworkMenuOpen(false);
  };

  const handleNetworkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsNetworkMenuOpen(prev => !prev);
    setIsAccountMenuOpen(false);
  };

  const handleNetworkSwitch = (networkId: number) => {
    const targetChain = chains.find(chain => chain.id === networkId);
    if (targetChain) {
      switchNetwork(targetChain);
    }
    setIsNetworkMenuOpen(false);
  };

  const handleDisconnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await disconnect();
    setIsAccountMenuOpen(false);
    removeToken();
  };

  if (!isConnected || !address) {
    return (
      <button
        onClick={handleConnect}
        className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 sm:px-4 rounded-lg flex items-center justify-center transition-all ${className}`}
      >
        {/* <Wallet className="w-4 h-4 sm:w-5 sm:h-5" /> */}
        <span className="hidden sm:inline">Connect Wallet</span>
        <span className="sm:hidden">Connect</span>
      </button>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {/* Network Selector - Hidden on mobile when account menu is open */}
      <div className="relative hidden sm:block" ref={networkRef}>
        <button
          onClick={handleNetworkToggle}
          className="flex items-center text-gray-300 border border-gray-700 rounded-lg px-3 py-1.5 text-sm hover:bg-gray-800 transition-colors"
          aria-label="Network selector"
        >
          <span className="truncate max-w-[100px]">{chain?.name || 'Network'}</span>
          <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isNetworkMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {isNetworkMenuOpen && (
          <div className="absolute mt-1 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
            {chains.map(network => (
              <button
                key={network.id}
                onClick={() => handleNetworkSwitch(network.id)}
                className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors ${network.id === chainId ? 'text-blue-500 font-medium' : 'text-gray-300'
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
          className="flex items-center text-blue-400 bg-blue-900/20 border border-blue-900 rounded-lg px-3 py-1.5 hover:bg-blue-900/30 transition-colors"
          aria-label="Account menu"
        >
          <span className="hidden sm:block mr-2 text-green-400">✓</span>
          <span className="text-sm truncate max-w-[80px] sm:max-w-[120px]">
            {displayAddress(address)}
          </span>
          <ChevronDown className={`ml-1 w-4 h-4 transition-transform ${isAccountMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {isAccountMenuOpen && (
          <div className="absolute right-0 mt-1 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="sm:hidden px-4 py-2.5 border-b border-gray-800">
              <p className="text-xs text-gray-400">Network</p>
              <p className="text-sm text-white">{chain?.name || 'Unknown'}</p>
            </div>
            <button
              onClick={() => open({ view: 'Account' })}
              className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Account Details
            </button>
            <button
              onClick={handleDisconnect}
              className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-gray-800 transition-colors"
            >
              Disconnect Wallet
            </button>
          </div>
        )}
      </div>

      {/* Mobile Network Selector - Only visible when account menu is open on mobile */}
      {isAccountMenuOpen && (
        <div className="sm:hidden absolute bottom-16 right-0 w-full px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            <p className="px-4 py-2 text-sm text-gray-400 border-b border-gray-800">Switch Network</p>
            <div className="max-h-[200px] overflow-y-auto">
              {chains.map(network => (
                <button
                  key={network.id}
                  onClick={() => handleNetworkSwitch(network.id)}
                  className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-800 transition-colors ${network.id === chainId ? 'text-blue-500 font-medium' : 'text-gray-300'
                    }`}
                >
                  {network.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletButton;