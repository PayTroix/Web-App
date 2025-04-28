'use client';
import Header from './Header';
import { useRouter } from 'next/navigation';
import { useAppKitAccount } from "@reown/appkit/react";
import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { web3AuthService } from '../../services/api';

export default function HeroSection() {
    const router = useRouter();
    const { address, isConnected } = useAppKitAccount();
    const [isCheckingUser, setIsCheckingUser] = useState(false);

    // Function to check user type and redirect accordingly
    const checkUserAndRedirect = useCallback(async () => {
      if (!address) return;
      
      setIsCheckingUser(true);
      try {
        const nonceResponse = await web3AuthService.getNonce(address); // Check if nonce exists for the address or create new one
        
       const isVerified = await web3AuthService.verifyAddress(address); // Verify the address
        if (!isVerified.exists == false) {
          toast.error('Address not verified');
          router.push('/register');
          return;
        }

        const userType = nonceResponse.user_type;
        
        if (userType === 'organization') {
          router.push('/dashboard');
        } else if (userType === 'recipient') {
          router.push('/recipient-dashboard');
        } else {
          router.push('/register');
        }
      } catch (error) {
        console.error('Error checking user:', error);
        router.push('/register');
      } finally {
        setIsCheckingUser(false);
      }
    }, [address, router]);

    useEffect(() => {
      if (isConnected && address) {
        checkUserAndRedirect();
      }
    }, [isConnected, address, checkUserAndRedirect]);

    const handleGetStarted = async () => {
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
      <div className="flex flex-col items-center justify-center text-center px-4 md:px-20 pt-20">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight max-w-4xl">
          Payroll Reinvented for <span className=" bg-gradient-to-r from-[#0072E5] to-[#00468C] text-transparent bg-clip-text animate-pulse">Web3</span>
          <br />
          <span>Instant, Secure, and Borderless</span>
        </h1>
        <p className="mt-4 text-sm md:text-base text-gray-300 max-w-xl">
          Streamline Payments, Taxes, and Compliance in One Place
          <br />
          Effortlessly handle your payroll with accurate calculations,
          automated tax filing, and detailed reporting.
        </p>
        <div className="mt-8 flex space-x-16">
          {/* <Link href="/register"> */}
          {/* <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold">
            Get Started
          </button> */}
          {/* </Link> */}
          <button 
            onClick={() => handleGetStarted()}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold"
          >
            {isCheckingUser ? 'Checking...' : 'Get Started'}
          </button>
          <button className="border border-white hover:border-blue-500 px-2 py-2 rounded-lg font-semibold">
            Join Waitlist
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-col md:flex-row md:space-x-20 items-center gap-2 text-center">
          <div className='flex items-center text-start gap-2'>
            <p className="text-4xl font-bold">3579</p>
            <p className="text-sm text-gray-300">Stored<br />Data</p>
          </div>
          <div className="w-px h-8 bg-gray-600 hidden md:block" />
          <div className='flex items-center text-start gap-2'>
            <p className="text-4xl font-bold">$1M+</p>
            <p className="text-sm text-gray-300">Trusted<br />Customers</p>
          </div>
        </div>
      </div>
    </div>
  );
}
