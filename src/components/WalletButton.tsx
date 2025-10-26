'use client';

import React from 'react';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';

type WalletButtonProps = {
  className?: string;
};

const WalletButton: React.FC<WalletButtonProps> = ({ className = '' }) => {
  return (
    <div className={`flex justify-end ${className}`}>
      <Wallet>
        <ConnectWallet className="bg-blue-600 hover:bg-blue-700">
          <Avatar className="h-6 w-6" />
          <Name className="text-white font-medium" />
        </ConnectWallet>
        <WalletDropdown>
          <Identity
            className="px-4 pt-3 pb-2 hover:bg-gray-800"
            hasCopyAddressOnClick
          >
            <Avatar />
            <Name />
            <Address className="text-gray-400" />
            <EthBalance />
          </Identity>
          <WalletDropdownDisconnect className="hover:bg-gray-800 text-red-400" />
        </WalletDropdown>
      </Wallet>
    </div>
  );
};

export default WalletButton;