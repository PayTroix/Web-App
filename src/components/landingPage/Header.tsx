'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import WalletButton from '../WalletButton';
import Link from 'next/link';
import { useAppKitAccount } from '@reown/appkit/react';
import { useUserValidation } from '@/hooks/useUserValidation';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { address } = useAppKitAccount();
  const { userExists, isLoading } = useUserValidation();
  const { authenticate, isAuthenticating } = useAuth();
  const router = useRouter();

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = async (path: string) => {
    if (isAuthenticating) return;

    const isAuthenticated = await authenticate();
    if (isAuthenticated) {
      router.push(path);
    }
  };

  // Update initialization state when user validation completes
  useEffect(() => {
    if (!isLoading) {
      setIsInitializing(false);
    }
  }, [isLoading]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#060D13]/95 backdrop-blur-sm py-2' : 'bg-[#060D13] py-4'
      }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={40}
                className="h-10 w-auto md:h-12"
                priority
              />
            </Link>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-6">
            {/* Show loader while initializing */}
            {address && isInitializing && (
              <div className="px-6 py-2 rounded-lg bg-blue-400">
                <span className="flex items-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </div>
            )}

            {/* Show button after initialization */}
            {!isInitializing && address && (
              <button
                onClick={() => handleNavigation(userExists ? '/roles' : '/register')}
                disabled={isAuthenticating}
                className={`px-6 py-2 rounded-lg text-white transition-all ${isAuthenticating
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {isAuthenticating ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Authenticating...</span>
                  </span>
                ) : (
                  <span>{userExists ? 'Dashboard' : 'Register'}</span>
                )}
              </button>
            )}

            {/* Wallet Button */}
            <WalletButton className="min-w-[120px]" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;