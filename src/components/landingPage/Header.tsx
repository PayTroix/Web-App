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
import { getToken, removeToken, isTokenExpired } from '@/utils/token';
import { toast } from 'react-hot-toast';
import { ApiError } from './Hero';

interface HeaderProps {
  onShowRoles: () => void;
}

const Header = ({ onShowRoles }: HeaderProps) => {
  const [, setIsScrolled] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [, setHasProfile] = useState(false);
  const [, setCheckingProfile] = useState(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState('Sign In');
  const { address } = useAppKitAccount();
  const { isLoading } = useUserValidation();
  const { authenticate, isAuthenticating } = useAuth();
  const router = useRouter();


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = async () => {
    if (isAuthenticating) return;

    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    const loadingToast = toast.loading('Checking user status...');

    try {
      // First verify if address exists
      const verifyResponse = await web3AuthService.verifyAddress(address);
      console.log("VERIFY RESPONSE: ", verifyResponse)
      if (!verifyResponse.exists) {
        toast.error('Address not registered', { id: loadingToast });
        router.push('/register');
        return;
      }

      // Check if we need to authenticate
      const token = getToken();
      const needsAuthentication = !token || isTokenExpired();

      if (needsAuthentication) {
        const isAuthenticated = await authenticate();
        if (!isAuthenticated) {
          toast.error('Authentication failed', { id: loadingToast });
          return;
        }
      }

      // Get fresh token after authentication
      const currentToken = getToken();
      if (!currentToken) {
        toast.error('Authentication token missing', { id: loadingToast });
        return;
      }

      try {
        // Only check recipient profile first
        const recipientProfiles = await profileService.listRecipientProfiles(currentToken);
        const hasRecipientProfile = recipientProfiles.some(
          profile => profile.recipient_ethereum_address.toLowerCase() === address.toLowerCase()
        );

        if (hasRecipientProfile) {
          toast.success('Success!', { id: loadingToast });
          onShowRoles();
          return;
        }

        // If no recipient profile, try organization profile
        try {
          const orgProfiles = await profileService.listOrganizationProfiles(currentToken);
          if (orgProfiles.length > 0) {
            toast.success('Success!', { id: loadingToast });
            onShowRoles();
            return;
          }
        } catch (orgError) {
          // Ignore organization profile errors - user might be recipient only
        }

        // If we get here, no profiles were found
        toast.error('No profile found. Redirecting to registration', { id: loadingToast });
        router.push('/register');

      } catch (error: unknown) {
        const apiError = error as ApiError;
        if (apiError?.response?.data?.code === 'token_not_valid') {
          removeToken();
          toast.error('Session expired. Please sign in again.', { id: loadingToast });
          return;
        }

        console.error('Error checking profiles:', error);
        toast.error('Error checking profiles. Please try again.', { id: loadingToast });
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Sign in failed. Please try again.', { id: loadingToast });
    }
  };

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
            await web3AuthService.getNonce(address);
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
          {address && ( // Only show when wallet is connected
            <button
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className={`px-6 py-2 rounded-lg text-white transition-all ${isAuthenticating
                ? 'bg-blue-400/20 backdrop-blur-sm cursor-not-allowed'
                : 'bg-blue-600/80 hover:bg-blue-700 backdrop-blur-sm'
                }`}
            >
              {isAuthenticating ? (
                <span className="flex items-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Signing In...</span>
                </span>
              ) : (
                <span>{buttonText}</span>
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