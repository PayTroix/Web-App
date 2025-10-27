/**
 * ActiveEmployeesCard Widget
 * Displays active employees count with circular progress
 */

import React from 'react';
import { calculateStrokeDashoffset } from '../../_utils';

interface ActiveEmployeesCardProps {
    activeEmployees: number;
    totalEmployees: number;
}

export function ActiveEmployeesCard({ activeEmployees, totalEmployees }: ActiveEmployeesCardProps) {
    const percentage = totalEmployees > 0
        ? Math.round((activeEmployees / totalEmployees) * 100)
        : 0;

    const strokeDashoffset = calculateStrokeDashoffset(activeEmployees, totalEmployees);

    return (
        <div className="col-span-full md:col-span-1 bg-black rounded-lg p-4 md:p-6 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
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
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 60 60)"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white text-xl font-bold">{percentage}%</span>
                </div>
            </div>
            <div className="mt-4 whitespace-nowrap">
                <h2 className="text-white text-3xl font-semibold text-center">{activeEmployees}</h2>
                <p className="text-gray-500 text-sm text-center">Active employee</p>
            </div>
        </div>
    );
}
