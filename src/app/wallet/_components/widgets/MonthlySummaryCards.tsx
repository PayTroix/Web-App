/**
 * MonthlySummaryCards Component
 * Displays monthly income/expense summaries
 */

'use client';

import type { MonthlySummary } from '../../_types';

interface MonthlySummaryCardsProps {
    summaries: MonthlySummary[];
}

export function MonthlySummaryCards({ summaries }: MonthlySummaryCardsProps) {
    return (
        <>
            {summaries.map(({ month, income, expense }) => (
                <div
                    key={month}
                    className="bg-black rounded-lg p-2 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20"
                >
                    <div className="flex items-center justify-between text-gray-400 mb-2">
                        <span>{month}</span>
                        <span>2025</span>
                    </div>
                    <div className="h-16 bg-opacity-30 rounded bg-gradient-to-r from-green-400/20 to-green-300/10 mb-4"></div>
                    <div className="flex justify-between text-sm">
                        <div className="text-green-400">+ ${income.toLocaleString()}</div>
                        <div className="text-red-400">- ${expense.toLocaleString()}</div>
                    </div>
                </div>
            ))}
        </>
    );
}
