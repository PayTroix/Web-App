/**
 * PayrollContent Component
 * Main payroll management view
 */

'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useWalletRedirect } from '@/hooks/useWalletRedirect';
import { usePayrollData, usePayrollDisbursement } from '../_hooks';
import {
  PayrollSummaryCards,
  DisbursementForm,
  RecentPaymentsTable
} from './widgets';
import type { RecipientGroup } from '../_types';
import type { SupportedToken } from '../_constants';

export function PayrollContent() {
  useWalletRedirect();
  
  const {
    employees,
    recipients,
    stats,
    loading,
    isDisbursing,
    setIsDisbursing,
    balances,
    refetch,
    getGroupTotalAmount,
    getFilteredRecipients
  } = usePayrollData();

  const [selectedGroup, setSelectedGroup] = useState<RecipientGroup>('active');
  const [selectedToken, setSelectedToken] = useState<SupportedToken>('USDT');
  const [paymentMonth, setPaymentMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { disburse } = usePayrollDisbursement({
    recipients,
    onSuccess: () => {
      refetch(selectedToken);
    }
  });

  const handleDisbursement = async () => {
    try {
      if (!paymentMonth) {
        toast.error('Please select payment month and year');
        return;
      }

      setIsDisbursing(true);
      const loadingToastId = toast.loading('Processing disbursement...', {
        duration: Infinity
      });

      try {
        await disburse(selectedGroup, paymentMonth, selectedToken);
        toast.dismiss(loadingToastId);
        toast.success('Disbursement completed successfully!');
      } catch (error) {
        toast.dismiss(loadingToastId);
        throw error;
      }
    } catch (error) {
      console.error('Disbursement error:', error);
      toast.error(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsDisbursing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const balance = balances.loading ? '...' : balances.USDT || balances.USDC || '0';
  const totalAmount = getGroupTotalAmount(selectedGroup);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Summary Cards */}
      <PayrollSummaryCards
        stats={stats}
        balance={balance}
        isLoadingBalance={balances.loading}
        selectedToken={selectedToken}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Disbursement Form */}
        <div className="lg:col-span-1">
          <DisbursementForm
            selectedGroup={selectedGroup}
            onGroupChange={setSelectedGroup}
            selectedToken={selectedToken}
            onTokenChange={setSelectedToken}
            paymentMonth={paymentMonth}
            onMonthChange={setPaymentMonth}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
            totalAmount={totalAmount}
            onDisburse={handleDisbursement}
            isDisbursing={isDisbursing}
          />
        </div>

        {/* Recent Payments Table */}
        <div className="lg:col-span-2">
          <RecentPaymentsTable employees={employees} />
        </div>
      </div>
    </div>
  );
}
