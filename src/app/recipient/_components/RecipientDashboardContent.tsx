/**
 * RecipientDashboardContent Component
 * Main recipient dashboard view
 */

'use client';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useWalletRedirect } from '@/hooks/useWalletRedirect';
import { useRecipientDashboard } from '../_hooks';
import { RecipientSummaryCards, PaymentHistoryTable } from './widgets';

export function RecipientDashboardContent() {
    useWalletRedirect();

    const { loading, initialLoad, dashboardData, completedPayrolls } = useRecipientDashboard();

    if (initialLoad || loading) {
        return (
            <div className="min-h-screen bg-black">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white p-4 md:p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Top Cards */}
                <RecipientSummaryCards dashboardData={dashboardData} />

                {/* Payment History Section */}
                <PaymentHistoryTable completedPayrolls={completedPayrolls} />
            </div>
        </main>
    );
}
