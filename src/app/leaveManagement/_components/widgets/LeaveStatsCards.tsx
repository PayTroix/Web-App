/**
 * LeaveStatsCards Component
 * Displays leave management statistics
 */

'use client';

import { CheckCircle, X } from 'lucide-react';
import { calculateCircleStrokeDashoffset } from '../../_utils';
import type { LeaveStats } from '../../_types';

interface LeaveStatsCardsProps {
    stats: LeaveStats;
}

export function LeaveStatsCards({ stats }: LeaveStatsCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
            {/* Approved Card */}
            <div className="col-span-full md:col-span-3 bg-[#111111] rounded-lg p-4 md:p-6 border border-[#333333] transition-all duration-300 hover:border-blue-500/40">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="text-blue-400" size={24} />
                        </div>
                        <div className="mt-12">
                            <h2 className="text-4xl font-bold text-gray-100">{stats.approved}</h2>
                            <p className="text-gray-400 text-sm">Approved This Month</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Active Employee Card */}
            <div className="col-span-full md:col-span-1 bg-[#111111] rounded-lg p-4 md:p-6 border border-[#333333] transition-all duration-300 hover:border-blue-500/40">
                <div className="relative w-24 h-24 mx-auto">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="#333" strokeWidth="6" />
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="8"
                            strokeDasharray="251.2"
                            strokeDashoffset={calculateCircleStrokeDashoffset(stats.activeEmployeesPercentage)}
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-xl font-bold text-gray-100">{stats.activeEmployeesPercentage}%</div>
                    </div>
                </div>
                <div className="mt-4 text-center">
                    <h2 className="text-4xl font-bold text-gray-100">{stats.totalEmployees}</h2>
                    <p className="text-gray-400 text-sm">Active employee</p>
                </div>
            </div>

            {/* Declined Card */}
            <div className="col-span-full md:col-span-2 bg-[#111111] rounded-lg p-4 md:p-6 border border-[#333333] transition-all duration-300 hover:border-blue-500/40">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                            <X className="text-red-400" size={24} />
                        </div>
                        <div className="mt-12">
                            <h2 className="text-4xl font-bold text-gray-100">{stats.declined}</h2>
                            <p className="text-gray-400 text-sm">Declined Requests</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
