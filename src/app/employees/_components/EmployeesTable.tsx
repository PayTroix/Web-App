/**
 * EmployeesTable Component
 * Displays the list of employees/recipients in a table format
 */

import React from 'react';
import { getStatusColorClass, getInitials } from '../_utils';
import type { Recipient } from '../_types';

interface EmployeesTableProps {
  employees: Recipient[];
  onRemove: (id: number) => void;
  onAddClick: () => void;
}

export function EmployeesTable({ employees, onRemove, onAddClick }: EmployeesTableProps) {
  return (
    <div className="bg-black rounded-lg border border-[#2C2C2C] overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 md:p-6 gap-4">
        <div className="flex items-center">
          <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h2 className="text-white text-lg font-medium">Recipients</h2>
        </div>

        <button
          onClick={onAddClick}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Recipient
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="text-left text-gray-500 text-sm">
              <th className="px-20 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Position</th>
              <th className="px-6 py-3 font-medium">Wallet address</th>
              <th className="px-6 py-3 font-medium">Salary</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2C2C2C]">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id} className="text-white transition-colors hover:bg-gray-900/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-700">
                        <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-500">
                            {getInitials(employee.name)}
                          </span>
                        </div>
                      </div>
                      {employee.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{employee.position}</td>
                  <td className="px-6 py-4 text-gray-400">{employee.wallet}</td>
                  <td className="px-6 py-4 text-gray-400">{employee.salary}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${getStatusColorClass(employee.status)}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onRemove(employee.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gray-800/50 p-3 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No recipients found</p>
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
