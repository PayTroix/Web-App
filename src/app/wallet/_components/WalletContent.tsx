/**
 * WalletContent Component
 * Main wallet dashboard view
 */

'use client';

import { useWalletRedirect } from '@/hooks/useWalletRedirect';
import { WALLET_BALANCE, MONTHLY_SUMMARIES, TRANSACTION_HISTORY } from '../_constants';
import { BalanceCard, MonthlySummaryCards, TransactionHistoryTable } from './widgets';

export function WalletContent() {
    useWalletRedirect();

    return (
        <div className="min-h-screen bg-black text-white p-4 space-y-6">
            {/* Balance and Monthly Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Balance Card */}
                <BalanceCard balance={WALLET_BALANCE} />

                {/* Monthly Summaries */}
                <MonthlySummaryCards summaries={MONTHLY_SUMMARIES} />
            </div>

            {/* Transaction History */}
            <TransactionHistoryTable transactions={TRANSACTION_HISTORY} />
        </div>
    );
}
