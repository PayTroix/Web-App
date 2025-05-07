'use client';

import { useState } from 'react';
import Header from '@/components/landingPage/Header';

export default function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

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
      )
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
      )
    }
  ];

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-6">
      {/* Logo */}
      
      <Header/>

      <div className="max-w-3xl w-full space-y-8 mt-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Welcome to <span className="text-blue-500">Paytriox</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Choose your role to get started with our decentralized payroll system
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`group relative p-8 rounded-2xl border-2 ${
                selectedRole === role.id
                  ? 'border-blue-500 bg-blue-500/5'
                  : 'border-[#2C2C2C] hover:border-blue-500/50 bg-black'
              } transition-all duration-300 flex flex-col items-center text-center`}
            >
              {/* Glow Effect */}
              <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                selectedRole === role.id
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-50'
              } bg-blue-500/5 blur-xl -z-10`} />

              {/* Icon */}
              <div className={`mb-6 transform transition-transform duration-300 ${
                selectedRole === role.id ? 'scale-110 text-blue-500' : 'text-gray-400 group-hover:text-blue-400'
              }`}>
                {role.icon}
              </div>

              {/* Content */}
              <h3 className={`text-2xl font-semibold mb-3 ${
                selectedRole === role.id ? 'text-blue-500' : 'text-white'
              }`}>
                {role.name}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {role.description}
              </p>

              {/* Selection Indicator */}
              <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 ${
                selectedRole === role.id
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
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center pt-8">
          <button
            disabled={!selectedRole}
            className={`px-8 py-2 rounded-xl font-medium text-lg ${
              selectedRole
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20'
                : 'bg-gray-800 text-gray-400 cursor-not-allowed'
            } transition-all duration-300`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}