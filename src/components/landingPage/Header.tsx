'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import WalletButton from '../WalletButton';
import Link from 'next/link';
import { useAppKitAccount } from '@reown/appkit/react';
import { useUserValidation } from '@/hooks/useUserValidation';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { profileService, web3AuthService } from '@/services/api';
import { getToken } from '@/utils/token';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const { address } = useAppKitAccount();
  const { isLoading } = useUserValidation();
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
    const token = getToken();
    setHasToken(!!token);
    if (!isLoading) {
      setIsInitializing(false);
    }
  }, [isLoading]);

  // Modified profile checking effect
  useEffect(() => {
    let isMounted = true;

    const checkUserProfile = async () => {
      if (!address) return;

      setCheckingProfile(true);
      try {
        const token = getToken();

        // First try to find recipient profile if token exists
        if (token) {
          try {
            const recipientProfiles = await profileService.listRecipientProfiles(token);
            const recipientProfile = recipientProfiles.find(
              profile => profile.recipient_ethereum_address.toLowerCase() === address.toLowerCase()
            );

            if (recipientProfile && isMounted) {
              setHasProfile(true);
              setCheckingProfile(false);
              return;
            }
          } catch (error) {
            console.error('Error checking recipient profile:', error);
          }
        }

        // Then verify address registration
        const verificationResult = await web3AuthService.verifyAddress(address);

        if (!verificationResult.exists) {
          if (!token) {
            const nonce = await web3AuthService.getNonce(address);
            await authenticate();
            return;
          }
        } else if (token) {
          // Check for organization profile
          try {
            const orgProfiles = await profileService.listOrganizationProfiles(token);
            if (orgProfiles.length > 0 && isMounted) {
              setHasProfile(true);
              setCheckingProfile(false);
              return;
            }
          } catch (error) {
            console.error('Error checking organization profile:', error);
          }
        }

        if (isMounted) {
          setHasProfile(false);
        }
      } catch (error) {
        console.error('Error in profile checking process:', error);
        if (isMounted) {
          setHasProfile(false);
        }
      } finally {
        if (isMounted) {
          setCheckingProfile(false);
        }
      }
    };

    if (!isInitializing && address) {
      checkUserProfile();
    }

    return () => {
      isMounted = false;
    };
  }, [address, isInitializing]); // Remove authenticate from dependencies

  // Update the button render condition
  const renderButton = !isInitializing && address && hasToken;

  return (
    <div className="absolute top-4 left-0 right-0 z-50">
      <nav className="flex items-center justify-between px-8 py-4 bg-[#060D13] mx-32 rounded-md">
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

        {/* Right side items */}
        <div className="flex items-center space-x-6">
          {/* Show loader only when there's a token and still initializing */}
          {address && hasToken && isInitializing && (
            <div className="px-6 py-2 rounded-lg bg-blue-400/20 backdrop-blur-sm">
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </div>
          )}

          {/* Show button after initialization */}
          {renderButton && (
            <button
              onClick={() => handleNavigation(hasProfile ? '/roles' : '/register')}
              disabled={isAuthenticating || checkingProfile}
              className={`px-6 py-2 rounded-lg text-white transition-all ${isAuthenticating || checkingProfile
                ? 'bg-blue-400/20 backdrop-blur-sm cursor-not-allowed'
                : 'bg-blue-600/80 hover:bg-blue-700 backdrop-blur-sm'
                }`}
            >
              {isAuthenticating || checkingProfile ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{checkingProfile ? 'Checking Profile...' : 'Authenticating...'}</span>
                </span>
              ) : (
                <span>{hasProfile ? 'Dashboard' : 'Register'}</span>
              )}
            </button>
          )}

          {/* Wallet Button */}
          <WalletButton className="min-w-[120px]" />
        </div>
      </nav>
    </div>
  );
};

export default Header;