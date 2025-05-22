'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/landingPage/Header';
import { useUserValidation } from '@/hooks/useUserValidation';
import { motion } from 'framer-motion';
import { getToken } from '@/utils/token';
import { web3AuthService } from '@/services/api';
import { toast } from 'react-hot-toast';

interface UserType {
  type: 'recipient' | 'organization' | 'both' | null;
}

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [userType, setUserType] = useState<UserType['type']>(null);
  const router = useRouter();
  const { isLoading } = useUserValidation();

  useEffect(() => {
    const validateUserType = async () => {
      const token = getToken();
      if (!token) {
        router.replace('/');
        return;
      }

      try {
        const userData = await web3AuthService.getUser(token);
        setUserType(userData.user_type as UserType['type']);

        // // Only redirect if coming from login/registration
        // if (window.location.pathname === '/roles') {
        //   if (userData.user_type === 'recipient') {
        //     router.replace('/recipient');
        //   } else if (userData.user_type === 'organization') {
        //     router.replace('/dashboard');
        //   }
        // }
      } catch (error) {
        console.error('Error fetching user type:', error);
        toast.error('Error validating user access');
        router.replace('/');
      }
    };

    validateUserType();
  }, [router]);

  const handleContinue = () => {
    if (!userType) {
      toast.error('Unable to validate user type');
      return;
    }

    if (selectedRole === 'organization') {
      if (userType === 'recipient') {
        toast.error('You do not have access to the organization dashboard');
        return;
      }
      router.push('/dashboard');
    } else if (selectedRole === 'recipient') {
      if (userType === 'organization') {
        toast.error('You do not have access to the recipient dashboard');
        return;
      }
      router.push('/recipient');
    }
  };

  const roles = [
    {
      id: 'organization',
      name: 'Organization',
      description: 'Create and manage your organization, handle payroll, and manage recipients',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      ),
      // Only show if user type is 'organization' or 'both'
      show: userType === 'organization' || userType === 'both'
    },
    {
      id: 'recipient',
      name: 'Recipient',
      description: 'View your payment history and manage your wallet settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
      // Only show if user type is 'recipient' or 'both'
      show: userType === 'recipient' || userType === 'both'
    }
  ];

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#060D13] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Logo */}

      <Header onShowRoles={() => router.push('/roles')} />

      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Choose Your Role
            </h1>
            <p className="text-gray-400 text-lg">
              Select how you want to use Paytriox
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {roles.filter(role => role.show).map((role) => (
              <motion.button
                key={role.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(role.id)}
                className={`group relative p-8 rounded-2xl border-2 ${selectedRole === role.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-[#2C2C2C] hover:border-blue-500/50 bg-[#111827]'
                  } transition-all duration-300 flex flex-col items-center text-center`}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${selectedRole === role.id
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-50'
                  } bg-blue-500/10 blur-xl -z-10`} />

                {/* Icon */}
                <div className={`mb-6 transform transition-transform duration-300 ${selectedRole === role.id ? 'scale-110 text-blue-500' : 'text-gray-400 group-hover:text-blue-400'
                  }`}>
                  {role.icon}
                </div>

                {/* Content */}
                <h3 className={`text-2xl font-semibold mb-3 ${selectedRole === role.id ? 'text-blue-500' : 'text-white'
                  }`}>
                  {role.name}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {role.description}
                </p>

                {/* Selection Indicator */}
                <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 ${selectedRole === role.id
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-600 group-hover:border-blue-500/50'
                  } transition-all duration-300`}>
                  {selectedRole === role.id && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center pt-8"
          >
            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`px-8 py-3 rounded-xl font-medium text-lg ${selectedRole
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                } transition-all duration-300`}
            >
              Continue
            </button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}