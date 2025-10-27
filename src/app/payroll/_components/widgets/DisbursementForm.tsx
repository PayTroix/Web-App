/**
 * DisbursementForm Widget
 * Form for disbursing payroll
 */

import React, { useState } from 'react';
import { SUPPORTED_TOKENS, MONTHS } from '../../_constants';
import type { SupportedToken } from '../../_constants';
import type { RecipientGroup } from '../../_types';

interface DisbursementFormProps {
    selectedGroup: RecipientGroup;
    onGroupChange: (group: RecipientGroup) => void;
    selectedToken: SupportedToken;
    onTokenChange: (token: SupportedToken) => void;
    paymentMonth: string;
    onMonthChange: (month: string) => void;
    selectedYear: number;
    onYearChange: (year: number) => void;
    totalAmount: number;
    onDisburse: () => void;
    isDisbursing: boolean;
}

export function DisbursementForm({
    selectedGroup,
    onGroupChange,
    selectedToken,
    onTokenChange,
    paymentMonth,
    onMonthChange,
    selectedYear,
    onYearChange,
    totalAmount,
    onDisburse,
    isDisbursing
}: DisbursementFormProps) {
    const [showMonthPicker, setShowMonthPicker] = useState(false);

    const handleMonthSelect = (month: string) => {
        onMonthChange(`${month} ${selectedYear}`);
        setShowMonthPicker(false);
    };

    return (
        <div className="bg-black rounded-lg p-6 border border-[#2C2C2C]">
            <h2 className="text-white text-xl font-medium mb-6">Payment Settings</h2>

            <div className="space-y-4">
                {/* Select Group */}
                <div>
                    <label className="text-gray-400 text-sm mb-2 block">Select Group</label>
                    <select
                        value={selectedGroup}
                        onChange={(e) => onGroupChange(e.target.value as RecipientGroup)}
                        className="w-full bg-gray-900 border border-[#2C2C2C] rounded-lg p-3 text-white focus:border-blue-500/50 focus:outline-none transition-all"
                    >
                        <option value="all">All Employees</option>
                        <option value="active">Active Employees</option>
                        <option value="onLeave">On Leave</option>
                    </select>
                </div>

                {/* Select Token */}
                <div>
                    <label className="text-gray-400 text-sm mb-2 block">Payment Token</label>
                    <select
                        value={selectedToken}
                        onChange={(e) => onTokenChange(e.target.value as SupportedToken)}
                        className="w-full bg-gray-900 border border-[#2C2C2C] rounded-lg p-3 text-white focus:border-blue-500/50 focus:outline-none transition-all"
                    >
                        {SUPPORTED_TOKENS.map(token => (
                            <option key={token.symbol} value={token.symbol}>
                                {token.symbol} - {token.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Month/Year Picker */}
                <div className="relative month-picker-container">
                    <label className="text-gray-400 text-sm mb-2 block">Payment Period</label>
                    <input
                        type="text"
                        value={paymentMonth}
                        onClick={() => setShowMonthPicker(!showMonthPicker)}
                        placeholder="Select month and year"
                        readOnly
                        className="w-full bg-gray-900 border border-[#2C2C2C] rounded-lg p-3 text-white cursor-pointer focus:border-blue-500/50 focus:outline-none transition-all"
                    />

                    {showMonthPicker && (
                        <div className="absolute top-full left-0 mt-2 bg-gray-900 border border-[#2C2C2C] rounded-lg p-4 w-full z-10 shadow-xl">
                            {/* Year Selector */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => onYearChange(selectedYear - 1)}
                                    className="p-2 hover:bg-gray-800 rounded"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                        <polyline points="15 18 9 12 15 6" />
                                    </svg>
                                </button>
                                <span className="text-white font-medium">{selectedYear}</span>
                                <button
                                    onClick={() => onYearChange(selectedYear + 1)}
                                    className="p-2 hover:bg-gray-800 rounded"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                                        <polyline points="9 18 15 12 9 6" />
                                    </svg>
                                </button>
                            </div>

                            {/* Month Grid */}
                            <div className="grid grid-cols-3 gap-2">
                                {MONTHS.map(month => (
                                    <button
                                        key={month}
                                        onClick={() => handleMonthSelect(month)}
                                        className="p-2 text-sm text-white hover:bg-blue-500/20 rounded transition-colors"
                                    >
                                        {month.slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Total Amount */}
                <div className="bg-gray-900/50 rounded-lg p-4 border border-[#2C2C2C]">
                    <p className="text-gray-400 text-sm mb-1">Total Amount to Disburse</p>
                    <p className="text-2xl font-semibold text-white">
                        ${totalAmount.toLocaleString()} <span className="text-sm text-gray-400">({selectedToken})</span>
                    </p>
                </div>

                {/* Disburse Button */}
                <button
                    onClick={onDisburse}
                    disabled={isDisbursing || !paymentMonth}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                    {isDisbursing ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            Disburse Salary
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
