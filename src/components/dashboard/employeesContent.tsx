'use client';
import React, { useState } from 'react';

// Mock data for initial display
const initialEmployees = [
  { id: 1, name: 'Jane Doe', position: 'Developer', wallet: '0x12a...F3B', salary: '$4000(USDT)', status: 'active' },
  { id: 2, name: 'John Smith', position: 'Engineering', wallet: '0x12a...F3B', salary: '$4000(USDT)', status: 'on leave' },
  { id: 3, name: 'Jane Doe', position: 'Developer', wallet: '0x12a...F3B', salary: '$4000(USDT)', status: 'active' },
  { id: 4, name: 'John Smith', position: 'Engineering', wallet: '0x12a...F3B', salary: '$4000(USDT)', status: 'on leave' },
  { id: 5, name: 'Jane Doe', position: 'Developer', wallet: '0x12a...F3B', salary: '$4000(USDT)', status: 'active' },
];

export const EmployeesContent = () => {
  const [employees, setEmployees] = useState(initialEmployees);

  const handleRemoveEmployee = (id: number) => {
    setEmployees(employees.filter(employee => employee.id !== id));
  };

  const getStatusColorClass = (status: string) => {
    return status === 'active' 
      ? ' text-green-500' 
      : ' text-yellow-500';
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Treasury Wallet Balance */}
        <div className="bg-black rounded-lg px-4 py-4 flex border border-[#2C2C2C] flex-col relative overflow-hidden col-span-3 h-52">
          <div className="flex items-center justify-between">
            <div className="bg-white p-2 rounded-full">
              <div className="w rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <p className="text-gray-400 mt-12">Treasury wallet balance</p>
          <div className='flex items-center gap-2'>
            <h2 className="text-white text-3xl font-semibold mt-2">$345,840</h2>
            <p className="text-gray-400 text-xs">(USDT)</p>
          </div>
        </div>

        {/* Active Employees */}
        <div className="bg-black rounded-lg p-2 border border-[#2C2C2C] flex flex-col items-center justify-center relative col-span-1 h-52">
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
                strokeDashoffset="84.825"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-xl font-bold">75%</span>
            </div>
          </div>
          <div className="mt-4 whitespace-nowrap">
            <h2 className="text-white text-3xl font-semibold text-center">41</h2>
            <p className="text-gray-500 text-sm text-center">Active employee</p>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="bg-black rounded-lg px-2  border border-[#2C2C2C] py-2 flex flex-col relative overflow-hidden col-span-2 ">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <line x1="16" y1="21" x2="16" y2="3" />
                  <line x1="8" y1="21" x2="8" y2="3" />
                </svg>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div className="mt-16 gap-2 flex items-center">
            <h2 className="text-white text-3xl font-semibold">18</h2>
            <p className="text-gray-500 text-sm">Pending payment</p>
          </div>
        </div>
      </div>

      {/* Employees Table Section */}
      <div className="bg-black rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 mb-4">
          <div className="flex items-center">
            <div className=" w-8 h-8 rounded-lg flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h2 className="text-white text-md ">Recipient</h2>
          </div>
          <button className=" text-white px-4 py-1.5 rounded-lg flex items-center text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Recipient
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm">
                <th className="px-20 py-3  font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Position</th>
                <th className="px-6 py-3 font-medium">Wallet address</th>
                <th className="px-6 py-3 font-medium">Salary</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2C2C2C]">
              {employees.map((employee) => (
                <tr key={employee.id} className="text-white hover:bg-gray-900">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-700">
                        {employee.name === 'Jane Doe' ? (
                          <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
                            <span className="text-blue-500">JD</span>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
                            <span className="text-blue-500">JS</span>
                          </div>
                        )}
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
                      onClick={() => handleRemoveEmployee(employee.id)}
                      className="bg-blue-600 text-white px-6 py-1.5 rounded-lg text-sm font-medium"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeesContent;
