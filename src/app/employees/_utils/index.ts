/**
 * Employees Module Utilities
 * Helper functions for employees module
 */

import type { RecipientProfile, Recipient } from '../_types';

/**
 * Transform API recipient profile to UI display format
 */
export function transformRecipient(recipient: RecipientProfile): Recipient {
    return {
        id: recipient.id,
        name: recipient.name || 'Unknown',
        position: recipient.position || 'Not specified',
        wallet: recipient.recipient_ethereum_address
            ? `${recipient.recipient_ethereum_address.substring(0, 4)}...${recipient.recipient_ethereum_address.substring(recipient.recipient_ethereum_address.length - 3)}`
            : 'No wallet',
        salary: recipient.salary ? `$${recipient.salary}(USDT)` : '$0(USDT)',
        status: recipient.status || 'inactive'
    };
}

/**
 * Get CSS class for status badge
 */
export function getStatusColorClass(status: string): string {
    switch (status.toLowerCase()) {
        case 'active':
            return 'text-green-500';
        case 'on leave':
            return 'text-yellow-500';
        default:
            return 'text-gray-500';
    }
}

/**
 * Calculate stroke dashoffset for circular progress
 */
export function calculateStrokeDashoffset(active: number, total: number): string {
    if (total <= 0 || active <= 0) {
        return '339.3';
    }
    const ratio = active / total;
    const offset = 339.3 * (1 - ratio);
    return offset.toString();
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
}
