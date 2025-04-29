'use client';
import React, { useState} from 'react';
import Image from 'next/image';
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import WalletButton from '../WalletButton';


const Header = () => {
  const [_open, setOpen] = useState(false);
  const [_isConnecting, _setIsConnecting] = useState(false);


  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#060D13] mx-32 rounded-md">
      <div className="flex items-center gap-16">
        <Image src="/logo.png" alt="Logo" width={120} height={120} />
        <ul className="flex items-center space-x-6 text-sm">
          {['Features', 'About', 'Contact'].map((item, index) => (
            <li
              key={index}
              className="relative cursor-pointer text-white group"
            >
              <span className="group-hover:text-blue-400 transition-colors duration-300">
                {item}
              </span>
              <span className="absolute left-0 bottom-0 h-0.5 w-0 bg-blue-400 transition-all duration-700 ease-in-out group-hover:w-full"></span>
            </li>
          ))}
        </ul>
      </div>

      <WalletButton />
    </nav>
  );
};

export default Header;