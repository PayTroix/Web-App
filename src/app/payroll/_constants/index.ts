/**
 * Payroll Module Constants
 * Centralized constants for payroll operations
 */

export const SUPPORTED_TOKENS = [
  { symbol: 'USDT', name: 'Tether USD' },
  { symbol: 'USDC', name: 'USD Coin' }
] as const;

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

export const TRANSITION_CLASSES = {
  card: "transition-all duration-300 ease-in-out hover:border-blue-500/20",
  button: "transition-all duration-300 ease-in-out hover:bg-blue-700",
  input: "transition-all duration-200 ease-in-out focus:border-blue-500/50",
} as const;

export const USDT_DECIMALS = 6;

export type SupportedToken = typeof SUPPORTED_TOKENS[number]['symbol'];
export type Month = typeof MONTHS[number];
