'use client';
import Header from './Header';
import { useRouter } from 'next/navigation';
import { useAppKitAccount, useAppKitNetworkCore, useAppKitProvider, type Provider } from "@reown/appkit/react";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { profileService, web3AuthService } from '../../services/api';
import Link from 'next/link';
import { getToken, isTokenExpired, removeToken, storeToken } from '@/app/register/token';
import { ethers } from 'ethers';

type AuthResponse = {
  access: string;
  refresh?: string;
  user?: {
    user_type: 'organization' | 'recipient';
  };
};

type ApiError = {
  response?: {
    data?: {
      detail?: string;
      code?: string;
      exists?: boolean;
    };
  };
};

type VerifyAddressResponse = {
  exists: boolean;
  user_type?: 'organization' | 'recipient';
};

export default function HeroSection() {
    const router = useRouter();
    const { address, isConnected } = useAppKitAccount();
    const [isCheckingUser, setIsCheckingUser] = useState(false);
    const [, setIsTransacting] = useState(false);
    const { chainId } = useAppKitNetworkCore();
    const { walletProvider } = useAppKitProvider<Provider>('eip155');

    const login = async (): Promise<boolean> => {
      if (!isConnected || !address) {
        toast.error('Please connect your wallet first');
        return false;
      }
      
      setIsTransacting(true);
      const loadingToast = toast.loading('Authenticating...');
      
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
        toast.success('Successfully authenticated!', {
          id: loadingToast
        });
        return true;
      } catch (error: unknown) {
        console.error('Login error:', error);
        
        if (typeof error === 'object' && error !== null && 'response' in error) {
          const err = error as { response?: { data?: { code?: string } } };
          if (err.response?.data?.code === 'token_not_valid') {
            removeToken(); 
            toast.error('Your session has expired. Please sign in again.', {
              id: loadingToast
            });
          }
        } else {
          toast.error('Authentication failed', {
            id: loadingToast
          });
        }
        return false;
      } finally {
        setIsTransacting(false);
      }
    };

    const checkUserAndRedirect = async (): Promise<void> => {
      if (!address) {
        toast.error('Please connect your wallet first');
        return;
      }
      
      setIsCheckingUser(true);
      try {
        const verifyResponse: VerifyAddressResponse = await web3AuthService.verifyAddress(address);
        
        if (!verifyResponse.exists) {
          toast.error('Address not registered');
          router.push('/register');
          return;
        }

        let token = getToken();
        if (!token || isTokenExpired()) {
          toast.error('Authentication failed');
          const loginSuccess = await login();
          if (!loginSuccess) return;
          token = getToken();
        }

        try {
          const orgResponse = await profileService.listOrganizationProfiles(token);
          console.log('Organization response:', orgResponse);
          const userType = orgResponse[0]?.user?.user_type;
          
          if (userType === 'organization') {
            router.push('/dashboard');
          } else if (userType === 'recipient') {
            router.push('/recipient-dashboard');
          } else if (userType === undefined) {
            toast.error('Organization profile not found. Please complete registration.');
            router.push('/register');
          }
        } catch (orgError: unknown) {
          if (
            typeof orgError === 'object' && 
            orgError !== null && 
            'response' in orgError &&
            (orgError as ApiError).response?.data?.detail === 'Organization profile not found.'
          ) {
            toast.error('Organization profile not found. Please complete registration.');
            router.push('/register');
            return;
          }
          throw orgError; // Re-throw other errors to be caught by the outer catch block
        }
      } catch (error: unknown) {
        console.error('Error checking user:', error);
        
        if (typeof error === 'object' && error !== null && 'response' in error) {
          const err = error as { response?: { data?: { code?: string; exists?: boolean } } };
          if (err.response?.data?.code === 'token_not_valid' || err.response?.data?.exists === false) {
            removeToken();
            toast.error('Your session has expired. Please sign in again.');
            await login();
          }
        } else {
          toast.error('An error occurred. Please try again.');
        }
      } finally {
        setIsCheckingUser(false);
      }
    };

    const handleGetStarted = async (): Promise<void> => {
      if (!isConnected) {
        toast.error('Please connect your wallet first');
        return;
      }
      
      await checkUserAndRedirect();
    };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white p-6"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dxswouxj5/image/upload/v1745289047/BG_1_t7znif.png')",
      }}
    >
      
      <Header/>
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
            disabled={isCheckingUser}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transform transition-all hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isCheckingUser ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Checking...</span>
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
              Stored<br/>Data
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 p-4 rounded-lg backdrop-blur-sm bg-white/5 transition-all hover:bg-white/10">
            <p className="text-4xl font-bold bg-gradient-to-r from-[#0072E5] to-[#00468C] text-transparent bg-clip-text">
              $1M+
            </p>
            <p className="text-sm text-gray-300">
              Trusted<br/>Customers
            </p>  
          </div>
        </div>
      </div>
    </div>
  );
}