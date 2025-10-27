/**
 * RecentPaymentsTable Widget
 * Displays recent salary payments
 */

import React from 'react';
import { getStatusClass } from '../../_utils';
import type { Employee } from '../../_types';

interface RecentPaymentsTableProps {
  employees: Employee[];
}

export function RecentPaymentsTable({ employees }: RecentPaymentsTableProps) {
  return (
    <div className="bg-black rounded-lg border border-[#2C2C2C] overflow-hidden">
      <div className="p-6 border-b border-[#2C2C2C]">
        <h2 className="text-white text-xl font-medium">Recent Payments</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 text-sm border-b border-[#2C2C2C]">
              <th className="px-6 py-4 font-medium">Employee</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Salary</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id} className="border-b border-[#2C2C2C] hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-500 font-medium">
                          {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-white font-medium">{employee.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{employee.date}</td>
                  <td className="px-6 py-4 text-white font-medium">{employee.salary}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gray-800/50 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No payment records found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
