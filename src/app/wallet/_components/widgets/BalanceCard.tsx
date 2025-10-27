/**
 * BalanceCard Component
 * Displays wallet balance
 */

'use client';

import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface BalanceCardProps {
    balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
    return (
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
                    <h2 className="text-4xl font-bold">${balance.toLocaleString()}</h2>
                    <span className="ml-2 text-gray-400 text-sm">(USDT)</span>
                </div>
            </div>
        </div>
    );
}
