/**
 * PaymentHistoryTable Component
 * Displays payment history for recipient
 */

'use client';

import Image from 'next/image';
import { format } from 'date-fns';
import type { Payroll } from '@/services/api';

interface PaymentHistoryTableProps {
  completedPayrolls: Array<Payroll>;
}

export function PaymentHistoryTable({ completedPayrolls }: PaymentHistoryTableProps) {
  return (
    <div className="bg-black rounded-lg p-4 md:p-6 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
      <div className="flex items-center gap-0.2 mb-6">
        <div>
          <Image
            src="/vector.png"
            alt="Payment History"
            width={50}
            height={20}
            className="bg-opacity-20 p-3 rounded-full"
            priority
          />
        </div>
        <h3 className="text-lg font-medium">Payment History</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 text-left text-gray-400 text-sm">
              <th className="pb-4 font-normal">Amount</th>
              <th className="pb-4 font-normal">Payment Date</th>
              <th className="pb-4 font-normal">Description</th>
              <th className="pb-4 font-normal">Status</th>
              <th className="pb-4 font-normal"></th>
            </tr>
          </thead>
          <tbody>
            {completedPayrolls.length > 0 ? (
              completedPayrolls.map((payment, index) => (
                <tr key={index} className="text-left">
                  <td className="py-4 font-medium">${Number(payment.amount) / 1e6}</td>
                  <td className="py-4">{format(new Date(payment.date), 'MMM dd, yyyy')}</td>
                  <td className="py-4">{payment.description}</td>
                  <td className="py-4">
                    <span className="text-green-500">{payment.status}</span>
                  </td>
                  <td className="py-4 text-right">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 text-center text-gray-400">
                  No completed payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
