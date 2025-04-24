'use client';
import React, { useState } from 'react';

// Mock data for transaction history
const initialTransactions = [
  { 
    id: 1, 
    type: 'Salary Payment',
    recipient: 'Jane Doe', 
    date: '2023-07-15', 
    amount: '$4,000', 
    status: 'Completed', 
    txHash: '0x71C...9E3D' 
  },
  { 
    id: 2, 
    type: 'Bonus Payment',
    recipient: 'John Smith', 
    date: '2023-07-14', 
    amount: '$1,500', 
    status: 'Completed', 
    txHash: '0x82B...7F2A' 
  },
  { 
    id: 3, 
    type: 'Salary Payment',
    recipient: 'Alice Johnson', 
    date: '2023-07-15', 
    amount: '$3,800', 
    status: 'Pending', 
    txHash: '0x93A...6D1C' 
  },
  { 
    id: 4, 
    type: 'Commission',
    recipient: 'Bob Williams', 
    date: '2023-07-13', 
    amount: '$2,200', 
    status: 'Completed', 
    txHash: '0x45E...9B3F' 
  },
  { 
    id: 5, 
    type: 'Salary Payment',
    recipient: 'Charlie Brown', 
    date: '2023-07-15', 
    amount: '$4,200', 
    status: 'Failed', 
    txHash: '0x67D...2A5E' 
  },
];

export const PayrollContent = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactions, setTransactions] = useState(initialTransactions);
  const [activeTab, setActiveTab] = useState('all');

  // Filter transactions based on active tab
  const filteredTransactions = activeTab === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.status.toLowerCase() === activeTab);

  return (
    <div className="flex flex-col gap-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Payroll */}
        <div className="bg-black rounded-lg p-6 flex flex-col">
          <div className="flex items-center">
            <div className="bg-gray-800 p-3 rounded-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-gray-400 mt-3">Total Payroll (Monthly)</p>
          <h2 className="text-white text-4xl font-semibold mt-2">$164,000</h2>
          <p className="text-gray-400 text-sm">(USDT)</p>
          
          <div className="flex items-center mt-4">
            <span className="text-green-500 text-sm flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              +12.6%
            </span>
            <span className="text-gray-500 text-sm ml-2">from last month</span>
          </div>
        </div>

        {/* Next Payment */}
        <div className="bg-black rounded-lg p-6 flex flex-col">
          <div className="flex items-center">
            <div className="bg-gray-800 p-3 rounded-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-gray-400 mt-3">Next Payment Date</p>
          <h2 className="text-white text-2xl font-semibold mt-2">July 30, 2023</h2>
          
          <div className="flex items-center mt-4">
            <div className="bg-blue-500/20 text-blue-500 py-1 px-3 rounded-full text-xs">
              15 days remaining
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-black rounded-lg p-6 flex flex-col">
          <div className="flex items-center">
            <div className="bg-gray-800 p-3 rounded-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
          </div>
          <p className="text-gray-400 mt-3">Pending Payments</p>
          <h2 className="text-white text-4xl font-semibold mt-2">5</h2>
          
          <div className="flex items-center mt-4">
            <div className="bg-yellow-500/20 text-yellow-500 py-1 px-3 rounded-full text-xs">
              $18,500 total amount
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History Section */}
      <div className="bg-black rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
          <h2 className="text-white text-lg font-medium">Transaction History</h2>
          <button className="bg-blue-600 text-white px-4 py-1.5 rounded-lg flex items-center text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Export
          </button>
        </div>
        
        {/* Filter Tabs */}
        <div className="px-6 pt-4 border-b border-gray-800">
          <div className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('all')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'all' 
                  ? 'border-blue-500 text-blue-500' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              All Transactions
            </button>
            <button 
              onClick={() => setActiveTab('completed')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'completed' 
                  ? 'border-blue-500 text-blue-500' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Completed
            </button>
            <button 
              onClick={() => setActiveTab('pending')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'pending' 
                  ? 'border-blue-500 text-blue-500' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Pending
            </button>
            <button 
              onClick={() => setActiveTab('failed')}
              className={`pb-3 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'failed' 
                  ? 'border-blue-500 text-blue-500' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Failed
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Recipient</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Transaction Hash</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="text-white hover:bg-gray-900">
                  <td className="px-6 py-4">
                    {transaction.type}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {transaction.recipient}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {transaction.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-500/20 text-green-500' 
                        : transaction.status === 'Pending'
                          ? 'bg-yellow-500/20 text-yellow-500'
                          : 'bg-red-500/20 text-red-500'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <span className="flex items-center">
                      {transaction.txHash}
                      <button className="ml-2 text-gray-500 hover:text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                      </button>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredTransactions.length === 0 && (
          <div className="py-16 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">No transactions found</h3>
            <p className="text-gray-500 mt-2">There are no {activeTab !== 'all' ? activeTab : ''} transactions in your history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollContent;
