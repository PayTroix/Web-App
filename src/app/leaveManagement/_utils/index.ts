/**
 * Leave Management Utilities
 */

import { differenceInDays } from 'date-fns';
import type { LeaveRequest } from '../_types';

/**
 * Calculate the number of days between start and end date
 */
export function calculateLeaveDays(startDate: string, endDate: string): number {
  return differenceInDays(new Date(endDate), new Date(startDate));
}

/**
 * Get status badge color class
 */
export function getStatusColorClass(status: string): string {
  switch (status) {
    case 'approved':
      return 'text-green-400';
    case 'pending':
      return 'text-yellow-400';
    case 'rejected':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
}

/**
 * Capitalize first letter of string
 */
export function capitalizeFirst(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Calculate stroke dash offset for circular progress
 */
export function calculateCircleStrokeDashoffset(percentage: number): number {
  const circumference = 251.2;
  return circumference * (1 - percentage / 100);
}

/**
 * Check if employee is currently on leave
 */
export function isCurrentlyOnLeave(request: LeaveRequest): boolean {
  const currentDate = new Date();
  return (
    request.status === 'approved' &&
    new Date(request.start_date) <= currentDate &&
    new Date(request.end_date) >= currentDate
  );
}
