/**
 * TransactionHistoryTable Component
 * Displays transaction history
 */

'use client';

import Link from 'next/link';
import { CalendarDays } from 'lucide-react';
import { STATUS_COLORS } from '../../_constants';
import type { Transaction } from '../../_types';

interface TransactionHistoryTableProps {
  transactions: Transaction[];
}

export function TransactionHistoryTable({ transactions }: TransactionHistoryTableProps) {
  return (
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
            {transactions.map(({ date, type, amount, status, id, tofrom }) => (
              <tr key={id} className="border-b border-gray-800">
                <td className="py-2 text-gray-300">{date}</td>
                <td>{type}</td>
                <td>{amount}</td>
                <td className={STATUS_COLORS[status] || 'text-gray-400'}>{status}</td>
                <td>{id}</td>
                <td>{tofrom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
