'use client';
import React, { useEffect, useState } from 'react';
import { getToken, isTokenExpired } from '@/utils/token';
import { profileService, payrollService, Payroll, RecipientProfile } from '@/services/api';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider, type Provider } from '@reown/appkit/react';
import toast from 'react-hot-toast';
import useTokenBalances from '@/hooks/useBalance';
import { ethers } from 'ethers';
import abi from '@/services/abi.json';
import orgAbi from '@/services/organization_abi.json';
import { batchDisburseSalaryAtomic, disburseSalaryAtomic } from '@/services/payRoll';
import { useWalletRedirect } from '@/hooks/useWalletRedirect';

// Update the Employee interface to match backend status types
interface Employee {
  id: number;
  name: string;
  avatar: string;
  date: string;
  salary: string;
  status: 'Completed' | 'Pending' | 'Failed';  // Match backend status options
}

interface Recipient {
  id: number;
  name: string;
  status: string;
  salary?: number;
  wallet_address?: string;
  position?: string;
}

interface RecipientProfiles {
  recipients: Recipient[];
}

// interface Payroll {
//   id: number;
//   recipient: string;
//   date: string;
//   amount: number;
//   status: 'completed' | 'pending' | 'failed';
//   batch_reference?: string;
// }

// Add CSS transitions
const transitionClasses = {
  card: "transition-all duration-300 ease-in-out hover:border-blue-500/20",
  button: "transition-all duration-300 ease-in-out hover:bg-blue-700",
  input: "transition-all duration-200 ease-in-out focus:border-blue-500/50",
};

// Add constants for supported tokens and months
const SUPPORTED_TOKENS = [
  { symbol: 'USDT', name: 'Tether USD' },
  { symbol: 'USDC', name: 'USD Coin' }
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const PayrollContent = () => {
  const a = useWalletRedirect();
  const [activeTab, setActiveTab] = useState('payment');
  const [selectedGroup, setSelectedGroup] = useState('active');
  const [paymentMonth, setPaymentMonth] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const { address, isConnected } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const { balances, getTokenBalances } = useTokenBalances();
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  // const [, setPendingPayments] = useState(0);
  const [isDisbursing, setIsDisbursing] = useState(false);

  // Add new state variables
  const [selectedToken, setSelectedToken] = useState(SUPPORTED_TOKENS[0].symbol);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  // Add this near other state declarations
  const [payrollHistory, setPayrollHistory] = useState<Payroll[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Add this interface near other state declarations
  interface PayrollWithRecipient extends Payroll {
    recipientDetails?: RecipientProfile;
  }

  // Add this state
  const [payrollWithRecipients, setPayrollWithRecipients] = useState<PayrollWithRecipient[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !address) return;

      setLoading(true);
      try {
        const token = getToken();
        if (!token || isTokenExpired()) return;

        await getTokenBalances(address, walletProvider);

        const orgProfile = await profileService.listOrganizationProfiles(token);
        const recipientProfiles: RecipientProfiles = orgProfile[0];

        if (recipientProfiles && recipientProfiles.recipients) {
          const allRecipients = recipientProfiles.recipients;
          setTotalEmployees(allRecipients.length);

          // Filter active employees
          const activeCount = allRecipients.filter(r => r.status === 'active').length;
          setActiveEmployees(activeCount);

          // Update employees based on status
          const filteredEmployees = allRecipients.slice(0, 5).map((recipient: Recipient) => ({
            id: recipient.id,
            name: recipient.name || 'Unknown',
            avatar: '',
            date: new Date().toLocaleString('default', { month: 'long' }),
            salary: `$${recipient.salary || '0'}(${selectedToken})`,
            status: (recipient.status === 'active' ? 'Completed' :
              recipient.status === 'on_leave' ? 'Pending' : 'Failed') as 'Completed' | 'Pending' | 'Failed'
          }));

          setEmployees(filteredEmployees);
        }
      } catch (error) {
        console.error('Error fetching payroll data:', error);
        toast.error('Failed to load payroll data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isConnected, address, walletProvider, chainId, getTokenBalances]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showMonthPicker && !target.closest('.month-picker-container')) {
        setShowMonthPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMonthPicker]);

  // Update the renderStatus function to handle all possible states
  // const renderStatus = (status: string) => {
  //   switch (status) {
  //     case 'Completed':
  //       return <span className="text-green-500">{status}</span>;
  //     case 'Failed':
  //       return <span className="text-red-500">{status}</span>;
  //     case 'Pending':
  //       return <span className="text-yellow-500">{status}</span>;
  //     default:
  //       return <span className="text-gray-400">{status}</span>;
  //   }
  // };

  const handleDisburse = async () => {
    try {
      if (!isConnected || !address || !walletProvider) {
        toast.error('Please connect your wallet first');
        return;
      }

      if (!paymentMonth) {
        toast.error('Please specify payment month');
        return;
      }

      const token = getToken();
      if (!token || isTokenExpired()) {
        toast.error('Authentication required');
        return;
      }

      setIsDisbursing(true);

      // Get organization profile to get the ID
      const orgProfile = await profileService.listOrganizationProfiles(token);
      const organizationId = orgProfile[0]?.id;

      if (!organizationId) {
        throw new Error('Organization ID not found');
      }

      const recipientProfiles = orgProfile[0]?.recipients || [];

      // Update the filtering logic to match backend status
      const filteredRecipients = selectedGroup === 'all'
        ? recipientProfiles
        : recipientProfiles.filter(r => {
          if (selectedGroup === 'active') return r.status === 'active';
          if (selectedGroup === 'onLeave') return r.status === 'on_leave';
          return false;
        });

      if (filteredRecipients.length === 0) {
        toast.error('No recipients found for selected group');
        throw new Error('No recipients found for selected group');
      }

      // Validate recipient data
      const invalidRecipients = filteredRecipients.filter(
        r => !r.recipient_ethereum_address || !r.salary || r.salary <= 0
      );

      if (invalidRecipients.length > 0) {
        throw new Error(
          `Invalid recipient data found for: ${invalidRecipients.map(r => r.name).join(', ')}`
        );
      }

      const provider = new ethers.BrowserProvider(walletProvider, chainId);
      const signer = await provider.getSigner();

      const factoryContractAddress = process.env.NEXT_PUBLIC_LISK_CONTRACT_ADDRESS;
      if (!factoryContractAddress) {
        throw new Error('Factory contract address not configured');
      }

      const factoryContract = new ethers.Contract(factoryContractAddress, abi, provider);
      const contractAddress = await factoryContract.getOrganizationContract(address);

      if (!contractAddress) {
        throw new Error('Organization contract address not found');
      }

      // Add this check after getting the contract address:
      const contractCode = await provider.getCode(contractAddress);
      if (contractCode === '0x') {
        throw new Error('Organization contract not deployed at address: ' + contractAddress);
      }

      const payrollContract = new ethers.Contract(contractAddress, orgAbi, signer);

      const usdtAddress = process.env.NEXT_PUBLIC_USDT_ADDRESS;
      if (!usdtAddress) {
        throw new Error('USDT token address not found');
      }

      const usdtContract = new ethers.Contract(
        usdtAddress,
        ['function allowance(address,address) view returns (uint256)',
          'function approve(address,uint256) returns (bool)',
          'function balanceOf(address) view returns (uint256)'],
        signer
      );

      // Add this check before calculating amounts:
      const usdtDecimals = 6;  //await usdtContract.decimals();
      console.log('Token setup:', {
        decimals: usdtDecimals,
        tokenAddress: usdtAddress,
        contractAddress: contractAddress
      });

      // Update the amount parsing to use the correct decimals
      const totalNetAmount = filteredRecipients.reduce(
        (sum, r) => sum + (r.salary || 0),
        0
      );

      // Parse with correct decimals
      const parsedAmount = ethers.parseUnits(
        totalNetAmount.toString(),
        usdtDecimals
      );

      // Calculate total net amount
      const totalGrossAmount = await payrollContract.calculateGrossAmount(
        parsedAmount
      );

      // Check current allowance
      const currentAllowance = await usdtContract.allowance(address, contractAddress);
      console.log('Allowance check:', {
        current: ethers.formatUnits(currentAllowance, 6),
        required: ethers.formatUnits(totalGrossAmount, 6)
      });

      if (currentAllowance < totalGrossAmount) {
        console.log('Requesting token approval...');
        const approveTx = await usdtContract.approve(
          contractAddress,
          totalGrossAmount
        );
        console.log('Approval transaction sent:', approveTx.hash);
        const approveReceipt = await approveTx.wait();
        console.log('Approval confirmed:', approveReceipt.hash);
      }

      // Check balance
      const balance = await usdtContract.balanceOf(address);
      if (balance < totalGrossAmount) {
        throw new Error(
          `Insufficient USDT balance. Required: ${ethers.formatUnits(totalGrossAmount, 6)} USDT`
        );
      }

      // Prepare recipients data
      const recipients = filteredRecipients.map(r => ({
        id: r.id,
        address: r.recipient_ethereum_address,
        amount: ethers.parseUnits(r.salary?.toString() || '0', 6),
      }));

      console.log('Disbursement data:', {
        recipients,
        tokenAddress: process.env.NEXT_PUBLIC_USDT_ADDRESS,
        paymentMonth,
        contractAddress,
        organizationId
      });

      // Add this logging right before the disbursement attempt:
      console.log('Pre-disbursement check:', {
        recipients: filteredRecipients.map(r => ({
          address: r.recipient_ethereum_address,
          amount: ethers.formatUnits(r.salary || 0, 6),
          id: r.id
        })),
        contractAddress,
        usdtAddress,
        balance: await usdtContract.balanceOf(address),
        allowance: await usdtContract.allowance(address, contractAddress),
        totalAmount: totalGrossAmount
      });

      if (recipients.length === 1) {
        const recipient = recipients[0];
        await disburseSalaryAtomic({
          recipientId: recipient.id,
          recipientAddress: recipient.address,
          amount: recipient.amount,
          tokenAddress: usdtAddress,
          paymentMonth,
          token,
          signer,
          contractAddress,
          organizationId,
        });
      } else {
        await batchDisburseSalaryAtomic({
          recipients,
          tokenAddress: usdtAddress,
          paymentMonth,
          token,
          signer,
          contractAddress,
          organizationId,
        });
      }

      // Refresh data after successful disbursement
      const updatedOrgProfile = await profileService.listOrganizationProfiles(token);
      const updatedRecipients = updatedOrgProfile[0]?.recipients || [];

      setTotalEmployees(updatedRecipients.length);
      setActiveEmployees(updatedRecipients.filter(r => r.status === 'active').length);

      toast.success('Salary disbursement completed successfully!');
    } catch (error: unknown) {
      console.error('Detailed disbursement error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        code: error && typeof error === 'object' && 'code' in error ? error.code : undefined,
        data: error && typeof error === 'object' && 'data' in error ? error.data : undefined
      });

      // Throw a more descriptive error
      throw new Error(
        error instanceof Error ? error.message :
          (error && typeof error === 'object' && 'data' in error ? String(error.data) :
            'Failed to process disbursement. Please check console for details.')
      );
    } finally {
      setIsDisbursing(false);
    }
  };

  const handleDisbursement = async () => {
    if (!isConnected || !address || !walletProvider) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsDisbursing(true);
    const loadingToast = toast.loading('Processing disbursement...');

    try {
      await handleDisburse();
      toast.success('Disbursement completed successfully!', {
        id: loadingToast,
      });
    } catch (error) {
      console.error('Disbursement error:', error);
      toast.error(error instanceof Error ? error.message : 'Unknown error', {
        id: loadingToast,
      });
    } finally {
      setIsDisbursing(false);
    }
  };

  const calculateTotalAmount = () => {
    if (selectedGroup === 'all') {
      return employees.reduce((sum, emp) => sum + parseFloat(emp.salary.replace('$', '').split('(')[0]), 0);
    } else if (selectedGroup === 'active') {
      return employees.filter(emp => emp.status !== 'Pending').reduce((sum, emp) => sum + parseFloat(emp.salary.replace('$', '').split('(')[0]), 0);
    } else {
      return employees.filter(emp => emp.status === 'Pending').reduce((sum, emp) => sum + parseFloat(emp.salary.replace('$', '').split('(')[0]), 0);
    }
  };

  // Add this function to filter employees based on selected group
  // const getFilteredEmployees = () => {
  //   switch (selectedGroup) {
  //     case 'all':
  //       return employees;
  //     case 'active':
  //       return employees.filter(emp => emp.status === 'Completed');
  //     case 'onLeave':
  //       return employees.filter(emp => emp.status === 'Pending');
  //     default:
  //       return employees;
  //   }
  // };

  useEffect(() => {
    const fetchPayrollHistory = async () => {
      if (!isConnected || activeTab !== 'history') return;

      setIsLoadingHistory(true);
      try {
        const token = getToken();
        if (!token || isTokenExpired()) return;

        const [payrolls, recipients] = await Promise.all([
          payrollService.listPayrolls(token),
          profileService.listRecipientProfiles(token)
        ]);

        const payrollsWithDetails = payrolls.map(payroll => ({
          ...payroll,
          recipientDetails: recipients.find(r => r.id === payroll.recipient)
        }));

        setPayrollWithRecipients(payrollsWithDetails);
      } catch (error) {
        console.error('Error fetching payroll history:', error);
        toast.error('Failed to load payroll history');
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchPayrollHistory();
  }, [isConnected, activeTab]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:gap-6">
        {/* Treasury Card */}
        <div className={`col-span-full md:col-span-3 bg-black rounded-lg p-6 border border-[#2C2C2C] ${transitionClasses.card}`}>
          <div className="flex items-center justify-between mb-8">
            <div className="bg-white/10 p-3 rounded-full transform transition-transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <p className="text-gray-400 text-sm">Treasury wallet balance</p>
            <div className="flex items-baseline gap-2">
              <h2 className="text-2xl md:text-4xl font-semibold text-white">
                {balances.loading ? (
                  <div className="animate-pulse bg-gray-700 h-8 w-32 rounded" />
                ) : (
                  `$${balances.USDT || '0'}`
                )}
              </h2>
              <p className="text-gray-400 text-sm">(USDT)</p>
            </div>
          </div>
        </div>

        {/* Active Employees Card */}
        <div className={`col-span-full md:col-span-1 bg-black rounded-lg p-6 border border-[#2C2C2C] ${transitionClasses.card}`}>
          <div className="relative w-24 h-24 mx-auto">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="54" fill="none" stroke="white" strokeWidth="6" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray="339.3"
                strokeDashoffset={totalEmployees > 0 ? 339.3 * (1 - (activeEmployees / totalEmployees)) : 339.3}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-xl font-bold">
                {totalEmployees > 0 ? `${Math.round((activeEmployees / totalEmployees) * 100)}%` : '0%'}
              </span>
            </div>
          </div>
          <div className="mt-4 whitespace-nowrap">
            <h2 className="text-white text-3xl font-semibold text-center">{activeEmployees}</h2>
            <p className="text-gray-500 text-sm text-center">Active employee</p>
          </div>
        </div>



        {/* Payment Section */}
        <div className={`col-span-full bg-black rounded-lg p-6 border border-[#2C2C2C] ${transitionClasses.card}`}>
          {/* Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-lg ${activeTab === 'payment'
                ? 'text-blue-500 border border-blue-500/30'
                : 'text-gray-400'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              Payment
            </button>
            <button
              onClick={() => setActiveTab('history')} // Update this from 'salary' to 'history'
              className={`px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-lg ${activeTab === 'history'
                ? 'bg-blue-600/10 text-blue-500 border border-blue-500/30'
                : 'text-gray-400'
                }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Payroll History
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-8">
            {/* Groups Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-gray-400 mb-4">Select Groups For Payment</h3>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="employeeGroup"
                      value="all"
                      checked={selectedGroup === 'all'}
                      onChange={() => setSelectedGroup('all')}
                      className="form-radio h-4 w-4 text-blue-500 hidden"
                    />
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${selectedGroup === 'all' ? 'border-blue-500 bg-blue-500' : 'border-[#0072E5]'
                      }`}>
                      {selectedGroup === 'all' && (
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                      )}
                    </span>
                    <span className="ml-2 text-white">All Employees</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="employeeGroup"
                      value="active"
                      checked={selectedGroup === 'active'}
                      onChange={() => setSelectedGroup('active')}
                      className="form-radio h-4 w-4 text-blue-500 hidden"
                    />
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${selectedGroup === 'active' ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
                      }`}>
                      {selectedGroup === 'active' && (
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                      )}
                    </span>
                    <span className="ml-2 text-white">Active</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="employeeGroup"
                      value="onLeave"
                      checked={selectedGroup === 'onLeave'}
                      onChange={() => setSelectedGroup('onLeave')}
                      className="form-radio h-4 w-4 text-blue-500 hidden"
                    />
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${selectedGroup === 'onLeave' ? 'border-blue-500 bg-blue-500' : 'border-[#0072E5]'
                      }`}>
                      {selectedGroup === 'onLeave' && (
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                      )}
                    </span>
                    <span className="ml-2 text-white">On Leave</span>
                  </label>
                </div>
              </div>

              {/* Total Amount Section */}
              <div className="items-center">
                <div className="text-gray-400 text-sm">Total amount to be disbursed</div>
                <div className="flex items-center text-white font-medium">
                  <div className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-3xl">${calculateTotalAmount().toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`border border-gray-800 rounded-lg p-4 ${transitionClasses.card}`}>
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-teal-500 rounded-md mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-white">Currency</div>
                    <select
                      value={selectedToken}
                      onChange={(e) => setSelectedToken(e.target.value)}
                      className={`bg-transparent text-gray-400 text-sm w-full mt-1 focus:outline-none ${transitionClasses.input}`}
                    >
                      {SUPPORTED_TOKENS.map(token => (
                        <option key={token.symbol} value={token.symbol}>
                          {token.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className={`border border-gray-800 rounded-lg p-4 ${transitionClasses.card}`}>
                <div className="text-white mb-2">Payment Month</div>
                <div className="relative month-picker-container">
                  <div
                    onClick={() => setShowMonthPicker(!showMonthPicker)}
                    className={`
                      flex items-center justify-between
                      bg-transparent text-gray-400 cursor-pointer
                      py-2 px-3 rounded-md border border-gray-800
                      ${transitionClasses.input}
                    `}
                  >
                    <span>{paymentMonth || 'Select month and year'}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${showMonthPicker ? 'transform rotate-180' : ''}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>

                  {showMonthPicker && (
                    <div className="absolute z-50 mt-2 w-full bg-gray-900 rounded-lg shadow-lg border border-gray-800">
                      <div className="p-4">
                        {/* Year selector */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            className="p-1 hover:bg-gray-800 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedYear(selectedYear - 1);
                            }}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                          <span className="text-white">{selectedYear}</span>
                          <button
                            className="p-1 hover:bg-gray-800 rounded"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedYear(selectedYear + 1);
                            }}
                          >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path d="M9 18l6-6-6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </button>
                        </div>

                        {/* Months grid */}
                        <div className="grid grid-cols-3 gap-2">
                          {MONTHS.map((month) => (
                            <button
                              key={month}
                              className={`
                                p-2 text-sm rounded-md transition-colors
                                ${paymentMonth === `${month} ${selectedYear}`
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-400 hover:bg-gray-800'
                                }
                              `}
                              onClick={() => {
                                setPaymentMonth(`${month} ${selectedYear}`);
                                setShowMonthPicker(false);
                              }}
                            >
                              {month}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              <button
                onClick={handleDisbursement}
                disabled={isDisbursing}
                className={`
                  bg-blue-600 text-white px-8 py-3 rounded-lg 
                  font-medium flex items-center gap-2
                  ${transitionClasses.button}
                  ${isDisbursing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}
                `}
              >
                {isDisbursing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Disburse
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll History Table - New Section */}
      {activeTab === 'history' && (
        <div className="w-full">
          {isLoadingHistory ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Table Headers */}
              <div className="grid grid-cols-4 gap-4 text-gray-400 border-b border-gray-800 pb-4 mb-4">
                <div>Recipient Address</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
              </div>

              {/* Table Rows */}
              <div className="space-y-6">
                {payrollWithRecipients.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    No payroll history found
                  </div>
                ) : (
                  payrollWithRecipients.map((payroll) => (
                    <div key={payroll.id} className="grid grid-cols-4 gap-4 items-center border-b border-gray-800 pb-6">
                      <div className="text-white text-sm font-mono truncate">
                        {payroll.recipientDetails?.recipient_ethereum_address || 'Unknown'}
                      </div>
                      <div className="text-white">
                        {new Date(payroll.date).toLocaleDateString()}
                      </div>
                      <div className="text-white">${payroll.amount}</div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm ${payroll.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                            payroll.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                              'bg-red-500/10 text-red-500'
                          }`}>
                          {payroll.status.charAt(0).toUpperCase() + payroll.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PayrollContent;