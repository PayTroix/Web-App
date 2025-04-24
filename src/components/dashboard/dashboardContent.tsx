'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LiveLineChart from './LiveChart';

// Mock data for recent payments
const recentPayments = [
  { id: 1, name: 'Jane Doe', amount: '$4,000', date: 'July 15, 2023', status: 'Completed' },
  { id: 2, name: 'John Smith', amount: '$3,800', date: 'July 15, 2023', status: 'Pending' },
  { id: 3, name: 'Alice Johnson', amount: '$4,200', date: 'July 15, 2023', status: 'Completed' },
];

// Mock data for recent activities
const recentActivities = [
  { 
    id: 1, 
    type: 'Employee Added', 
    message: 'Jane Doe was Added to the as a developer', 
    time: '2 hours ago',
    icon: (
      <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      </div>
    )
  },
  { 
    id: 2, 
    type: 'Payment Sent', 
    message: 'Payroll for April was proceeded successfully', 
    time: '1 day ago',
    icon: (
      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
      </div>
    )
  },
  { 
    id: 3, 
    type: 'System Update', 
    message: 'Payroll for April was proceeded successfully', 
    time: '1 day ago',
    icon: (
      <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      </div>
    )
  },
];

export const DashboardContent = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Treasury Wallet Balance */}
        <div className="bg-black border border-[#2C2C2C] rounded-lg p-6 flex flex-col col-span-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="bg-white p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <div className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
          <p className="text-gray-400 mt-16">Treasury wallet balance</p>
          <div className="flex items-center gap-2">
            <h2 className="text-white text-4xl font-semibold mt-2">$345,840</h2>
            <p className="text-gray-400 text-sm">(USDT)</p>
          </div>
        </div>

        {/* Total Employees */}
        <div className="bg-black border  border-[#2C2C2C] rounded-lg p-6 flex flex-col col-span-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="bg-white p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
         <div className='flex items-center mt-20 '>
         <h2 className="text-white text-3xl font-semibold mt-2">54</h2>
         <p className="text-gray-400 mt-3">Total Employees</p>
         
         </div>
        </div>

        {/* Active Employees */}
        <div className="bg-black border border-[#2C2C2C] rounded-lg p-6 flex flex-col items-center justify-center relative">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="54" fill="none" stroke="white" strokeWidth="6" />
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="8" 
                strokeDasharray="339.3" 
                strokeDashoffset="84.825" // 25% of the circumference
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-xl font-bold">75%</span>
              <p className="text-gray-500 text-xs">Performance</p>
            </div>
          </div>
          <div className="mt-2">
            <h2 className="text-white text-4xl font-semibold text-center">41</h2>
            <p className="text-gray-500 text-sm text-center">Active Employee</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Annual Payroll Reports Chart */}
        <div className="bg-black border border-[#2C2C2C] rounded-lg p-6 col-span-4 items-center justify-center">
          <LiveLineChart />
        </div>

        {/* Recent Activity Panel */}
        <div className="bg-black border border-[#2C2C2C] rounded-lg p-6 col-span-2">
          <h2 className="text-white text-lg font-medium mb-6">Recent Activity</h2>
          
          <div className="space-y-6">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex gap-4">
                {activity.icon}
                <div>
                  <h3 className="text-white text-sm font-medium">{activity.type}</h3>
                  <p className="text-gray-400 text-sm">{activity.message}</p>
                  <span className="text-gray-500 text-xs">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4">
            <Link href="/activity" className="text-blue-500 text-sm flex items-center">
              View all activity
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salary Advancement */}
        <div className="bg-black border border-[#2C2C2C] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h2 className="text-white text-lg font-medium">Salary Advancement</h2>
            </div>
            <div className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-white text-4xl font-semibold">6</h2>
            <p className="text-gray-500 text-sm">Pending Request</p>
          </div>
        </div>

        {/* Pending Payroll Volume */}
        <div className="bg-black border border-[#2C2C2C] rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
            </div>
            <div className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </div>
          <div className="mt-6">
            <h2 className="text-white text-4xl font-semibold">6</h2>
            <p className="text-gray-500 text-sm">Pending Payroll volume</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent; 