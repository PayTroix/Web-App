/**
 * TotalEmployees Widget
 * Displays the total number of employees/recipients
 */

import React from 'react';

interface TotalEmployeesProps {
    totalEmployees: number;
}

export function TotalEmployees({ totalEmployees = 0 }: TotalEmployeesProps) {
    return (
        <div className="bg-black border border-[#2C2C2C] rounded-lg p-4 md:p-6 
      col-span-full md:col-span-2 transition-all duration-300 hover:border-blue-500/20">
            <div className="flex items-center justify-between mb-8">
                <div className="bg-white/10 p-3 rounded-full transition-transform hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <h2 className="text-2xl md:text-3xl font-semibold text-white">
                    {totalEmployees}
                </h2>
                <p className="text-gray-400 text-sm">Total Employees</p>
            </div>
        </div>
    );
}
