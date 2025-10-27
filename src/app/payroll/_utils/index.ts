/**
 * Payroll Module Utilities
 * Helper functions for payroll operations
 */

import { formatUnits } from 'ethers';
import type { Recipient, Employee } from '../_types';
import { USDT_DECIMALS } from '../_constants';

/**
 * Format currency amount from wei to USD
 */
export function formatCurrency(amount: string | number): string {
  try {
    const formattedAmount = formatUnits(amount.toString(), USDT_DECIMALS);

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(formattedAmount));
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '$0.00';
  }
}

/**
 * Transform recipient to employee format for display
 */
export function transformRecipientToEmployee(
  recipient: Recipient, 
  selectedToken: string
): Employee {
  return {
    id: recipient.id,
    name: recipient.name || 'Unknown',
    avatar: '',
    date: new Date().toLocaleString('default', { month: 'long' }),
    salary: `$${recipient.salary || '0'}(${selectedToken})`,
    status: (recipient.status === 'active' ? 'Completed' :
      recipient.status === 'on_leave' ? 'Pending' : 'Failed') as 'Completed' | 'Pending' | 'Failed'
  };
}

/**
 * Calculate total amount for selected group
 */
export function calculateTotalAmount(
  recipients: Recipient[],
  selectedGroup: 'all' | 'active' | 'onLeave'
): number {
  if (selectedGroup === 'all') {
    return recipients.reduce((sum, recipient) => sum + (recipient.salary || 0), 0);
  } else if (selectedGroup === 'active') {
    return recipients
      .filter(recipient => recipient.status === 'active')
      .reduce((sum, recipient) => sum + (recipient.salary || 0), 0);
  } else {
    return recipients
      .filter(recipient => recipient.status === 'on_leave')
      .reduce((sum, recipient) => sum + (recipient.salary || 0), 0);
  }
}

/**
 * Filter recipients by group
 */
export function filterRecipientsByGroup(
  recipients: Recipient[],
  group: 'all' | 'active' | 'onLeave'
): Recipient[] {
  if (group === 'all') return recipients;
  if (group === 'active') return recipients.filter(r => r.status === 'active');
  if (group === 'onLeave') return recipients.filter(r => r.status === 'on_leave');
  return [];
}

/**
 * Validate recipients for disbursement
 */
export function validateRecipients(recipients: Recipient[]): {
  valid: boolean;
  invalidRecipients: Recipient[];
  error?: string;
} {
  const invalidRecipients = recipients.filter(
    r => !r.recipient_ethereum_address || !r.salary || r.salary <= 0
  );

  if (invalidRecipients.length > 0) {
    return {
      valid: false,
      invalidRecipients,
      error: `Invalid recipient data found for: ${invalidRecipients.map(r => r.name).join(', ')}`
    };
  }

  return { valid: true, invalidRecipients: [] };
}

/**
 * Get status badge class
 */
export function getStatusClass(status: 'Completed' | 'Pending' | 'Failed'): string {
  switch (status) {
    case 'Completed':
      return 'bg-green-500/20 text-green-500';
    case 'Pending':
      return 'bg-yellow-500/20 text-yellow-500';
    case 'Failed':
      return 'bg-red-500/20 text-red-500';
    default:
      return 'bg-gray-500/20 text-gray-500';
  }
}
