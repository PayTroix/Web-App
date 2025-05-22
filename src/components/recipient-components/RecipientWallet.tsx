import React from 'react';
import { CalendarDays } from 'lucide-react';
import { ChevronRight } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';
import { useWalletRedirect } from '@/hooks/useWalletRedirect';

export default function WalletDashboard() {
  useWalletRedirect();
  return (
    <div className="min-h-screen bg-black text-white p-4 space-y-6">
      {/* Balance and Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Balance Card */}

        <div className="bg-black rounded-lg p-2 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <Image
                src="/wallet.png"
                alt="Wallet"
                width={70}
                height={40}
                className="bg-opacity-20 p-3 rounded-full"
                priority
              />
            </div>
            <ChevronRight className="h-6 w-6 text-gray-500" />
          </div>
          <div className="mt-auto p-2">
            <p className="text-gray-400 text-sm">Balance</p>
            <div className="flex items-baseline">
              <h2 className="text-4xl font-bold">$16,000</h2>
              <span className="ml-2 text-gray-400 text-sm">(USDT)</span>
            </div>
          </div>
        </div>


        {/* Monthly Summaries */}
        {[{
          month: 'Feb', income: 4000, expense: 1200
        }, {
          month: 'Mar', income: 3500, expense: 4600
        }, {
          month: 'April', income: 4000, expense: 3400
        }].map(({ month, income, expense }) => (
          <div key={month} className="bg-black rounded-lg p-2 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
            <div className="flex items-center justify-between text-gray-400 mb-2">
              <span>{month}</span>
              <span>2025</span>
            </div>
            <div className="h-16 bg-opacity-30 rounded bg-gradient-to-r from-green-400/20 to-green-300/10 mb-4"></div>
            <div className="flex justify-between text-sm">
              <div className="text-green-400">+ ${income}</div>
              <div className="text-red-400">- ${expense}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History */}
      <div className="bg-black p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Transaction History</h2>
          <div className="flex items-center gap-2 text-blue-400">
            <CalendarDays className="w-5 h-5" />
            <Link href="/salary-advance" className="text-sm">
              <span>Salary Advance</span>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 border-b border-gray-700">
              <tr>
                <th className="py-2">Date</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Tnx ID</th>
                <th>To/From</th>
              </tr>
            </thead>
            <tbody>
              {[
                { date: 'May 5, 2025', type: 'Salary Credit', amount: '$4,000', status: 'Pending', statusColor: 'text-yellow-400', id: 'TXN#12G9H3F', tofrom: 'Employer' },
                { date: 'Apr 29, 2025', type: 'Withdrawal', amount: '$1,400', status: 'Completed', statusColor: 'text-green-400', id: 'TXN#22J8K6A', tofrom: 'Bank Account' },
                { date: 'Apr 29, 2025', type: 'Salary Credit', amount: '$3,500', status: 'Completed', statusColor: 'text-green-400', id: 'TXN#45J8K6A', tofrom: 'Employer' },
                { date: 'Apr 29, 2025', type: 'Transfer', amount: '$600', status: 'Failed', statusColor: 'text-red-500', id: 'TXN#22J7H6A', tofrom: 'Exchange' }
              ].map(({ date, type, amount, status, statusColor, id, tofrom }) => (
                <tr key={id} className="border-b border-gray-800">
                  <td className="py-2 text-gray-300">{date}</td>
                  <td>{type}</td>
                  <td>{amount}</td>
                  <td className={`${statusColor}`}>{status}</td>
                  <td>{id}</td>
                  <td>{tofrom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
