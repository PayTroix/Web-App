/**
 * Recipient Module Utilities
 */

export const SALARY_DIVISOR = 1e6;

/**
 * Calculate total salary from completed payrolls
 */
export function calculateTotalSalary(payrolls: Array<{ amount: string }>): number {
  return payrolls.reduce((sum, payment) => sum + Number(payment.amount) / SALARY_DIVISOR, 0);
}

/**
 * Calculate next payment date (end of next month from last payment)
 */
export function calculateNextPaymentDate(lastPaymentDate: Date): Date {
  const nextPaymentDate = new Date(lastPaymentDate);
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 2); // Add 2 months to get to next month
  nextPaymentDate.setDate(0); // Sets to last day of the month
  return nextPaymentDate;
}

/**
 * Calculate days until a given date
 */
export function calculateDaysUntil(targetDate: Date): number {
  return Math.ceil((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format amount by dividing by salary divisor
 */
export function formatPayrollAmount(amount: string | number): string {
  return (Number(amount) / SALARY_DIVISOR).toFixed(2);
}
