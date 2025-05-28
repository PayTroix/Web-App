'use client';
import Header from './Header';
import { useRouter } from 'next/navigation';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from "@reown/appkit/react";
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { profileService, web3AuthService } from '../../services/api';
import Link from 'next/link';
import { getToken, isTokenExpired, removeToken, storeToken } from '@/utils/token';
import { ethers } from 'ethers';

type AuthResponse = {
  access: string;
  refresh?: string;
  user?: {
    user_type: 'organization' | 'recipient';
  };
};

export type ApiError = {
  response?: {
    data?: {
      detail?: string;
      code?: string;
      exists?: boolean;
    };
  };
};

export type VerifyAddressResponse = {
  exists: boolean;
  user_type?: 'organization' | 'recipient';
};

interface HeroSectionProps {
  onShowRoles: () => void;
}

export default function HeroSection({ onShowRoles }: HeroSectionProps) {
  const router = useRouter();
  const { address, isConnected } = useAppKitAccount();
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { chainId } = useAppKitNetworkCore();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  
  // Track previous address to detect actual changes
  const prevAddressRef = useRef<string | undefined>();

  // Clean up token only when address actually changes (not on component mount)
  useEffect(() => {
    // Skip on initial mount when prevAddressRef.current is undefined
    if (prevAddressRef.current !== undefined && prevAddressRef.current !== address) {
      // Address actually changed, remove token
      const token = getToken();
      if (token) {
        removeToken();
      }
    }
    
    // Update the previous address reference
    prevAddressRef.current = address;
  }, [address]);

  const authenticate = async (): Promise<boolean> => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return false;
    }

    setIsAuthenticating(true);

    try {
      const { nonce } = await web3AuthService.getNonce(address);
      const message = `I'm signing my one-time nonce: ${nonce}`;
      const provider = new ethers.BrowserProvider(walletProvider, chainId);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      const authData = {
        address: address,
        signature: signature,
      };

      const authResponse: AuthResponse = await web3AuthService.login(authData);
      storeToken(authResponse.access);
      return true;
    } catch (error: unknown) {
      console.error('Authentication error:', error);

      if (typeof error === 'object' && error !== null && 'response' in error) {
        const err = error as { response?: { data?: { code?: string } } };
        if (err.response?.data?.code === 'token_not_valid') {
          removeToken();
          throw new Error('Your session has expired. Please sign in again.');
        }
      }
      throw new Error('Authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGetStarted = async (): Promise<void> => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsCheckingUser(true);
    const loadingToast = toast.loading('Checking user status...');

    try {
      // First verify if address exists
      const verifyResponse: VerifyAddressResponse = await web3AuthService.verifyAddress(address);

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
        toast.dismiss(loadingToast);
        toast.loading('Authenticating...');
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
        // Check recipient profile first
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
    } catch (error: unknown) {
      console.error('Error in handleGetStarted:', error);
      toast.error('An error occurred. Please try again.', { id: loadingToast });
    } finally {
      setIsCheckingUser(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white p-6"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dxswouxj5/image/upload/v1745289047/BG_1_t7znif.png')",
      }}
    >
      <Header onShowRoles={onShowRoles} />

      {/* Hero Content */}
      <div className="flex flex-col items-center justify-center text-center px-4 md:px-20 pt-10 md:pt-20 min-h-[calc(100vh-80px)]">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight max-w-4xl transition-all">
          Payroll Reinvented for{" "}
          <span className="bg-gradient-to-r from-[#0072E5] to-[#00468C] text-transparent bg-clip-text animate-pulse">
            Web3
          </span>
          <br />
          <span className="transition-all">Instant, Secure, and Borderless</span>
        </h1>

        <p className="mt-6 text-sm md:text-base text-gray-300 max-w-xl leading-relaxed">
          Streamline Payments, Taxes, and Compliance in One Place.
          <br className="hidden md:block" />
          Effortlessly handle your payroll with accurate calculations,
          automated tax filing, and detailed reporting.
        </p>

        <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-8">
          <button
            onClick={handleGetStarted}
            disabled={isCheckingUser || isAuthenticating}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transform transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isCheckingUser || isAuthenticating ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isAuthenticating ? 'Authenticating...' : 'Checking...'}</span>
              </div>
            ) : (
              'Get Started'
            )}
          </button>

          <Link href="#CTA">
            <button className="border border-white/30 hover:border-blue-500 px-8 py-3 rounded-lg font-semibold transition-all hover:bg-white/10">
              Join Waitlist
            </button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          <div className="flex items-center justify-center gap-4 p-4 rounded-lg backdrop-blur-sm bg-white/5 transition-all hover:bg-white/10">
            <p className="text-4xl font-bold bg-gradient-to-r from-[#0072E5] to-[#00468C] text-transparent bg-clip-text">
              3579
            </p>
            <p className="text-sm text-gray-300">
              Stored<br />Data
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 p-4 rounded-lg backdrop-blur-sm bg-white/5 transition-all hover:bg-white/10">
            <p className="text-4xl font-bold bg-gradient-to-r from-[#0072E5] to-[#00468C] text-transparent bg-clip-text">
              $1M+
            </p>
            <p className="text-sm text-gray-300">
              Trusted<br />Customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}