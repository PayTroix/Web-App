/**
 * RecipientSummaryCards Component
 * Displays total salary, last payment, and next payment cards
 */

'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import type { DashboardData } from '../../_types';

interface RecipientSummaryCardsProps {
    dashboardData: DashboardData | null;
}

export function RecipientSummaryCards({ dashboardData }: RecipientSummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Salary Card */}
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
                    <p className="text-gray-400 text-sm">Total Salary</p>
                    <div className="flex items-baseline">
                        <h2 className="text-4xl font-bold">
                            ${Number(dashboardData?.totalSalary || 0).toLocaleString()}
                        </h2>
                        <span className="ml-2 text-gray-400 text-sm">Total</span>
                    </div>
                </div>
            </div>

            {/* Last Payment Card */}
            <div className="bg-black rounded-lg p-2 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Image
                            src="/pass.png"
                            alt="Last Payment"
                            width={70}
                            height={40}
                            className="bg-opacity-20 p-3 rounded-full"
                            priority
                        />
                    </div>
                    <h1 className="text-[#B0B0B0] text-nowrap mr-20">Last Payment</h1>
                    <ChevronRight className="h-6 w-6 text-gray-500" />
                </div>
                <div className="mt-auto p-2">
                    <p className="text-gray-400 text-sm">
                        {dashboardData?.lastPayment.date && dashboardData.lastPayment.date !== '-'
                            ? format(new Date(dashboardData.lastPayment.date as string), 'MMM dd, yyyy')
                            : '-'}
                    </p>
                    <div className="flex items-baseline">
                        <h2 className="text-4xl font-bold">${dashboardData?.lastPayment.amount}</h2>
                        <span className="ml-2 text-green-500 text-sm">
                            {dashboardData?.lastPayment.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Next Payment Card */}
            <div className="bg-black rounded-lg p-2 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Image
                            src="/clock.png"
                            alt="Next Payment"
                            width={70}
                            height={40}
                            className="bg-opacity-20 p-3 rounded-full"
                            priority
                        />
                    </div>
                    <h1 className="text-[#B0B0B0] mr-20 text-nowrap">Next Payment</h1>
                    <ChevronRight className="h-6 w-6 text-gray-500" />
                </div>
                <div className="mt-auto p-2">
                    {dashboardData?.nextPayment.date !== '-' ? (
                        <>
                            <p className="text-gray-400 text-sm">
                                {dashboardData?.nextPayment.date &&
                                    format(new Date(dashboardData.nextPayment.date), 'MMM dd, yyyy')}
                            </p>
                            <div className="flex items-baseline">
                                <h2 className="text-4xl font-bold">
                                    ${Number(dashboardData?.nextPayment.amount).toLocaleString()}
                                </h2>
                                <span className="ml-2 text-amber-500 text-sm">
                                    Due in {dashboardData?.nextPayment.dueIn} days
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-start">
                            <p className="text-gray-400 text-sm mb-2">No scheduled payment</p>
                            <div className="flex items-baseline">
                                <h2 className="text-4xl font-bold">$0</h2>
                                <span className="ml-2 text-gray-500 text-sm">Pending</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
