'use client';
import React, { useEffect, useState } from 'react';
import { getToken } from '@/app/register/token';
import { profileService } from '@/services/api';
import { useAppKitAccount, useAppKitNetwork, useAppKitProvider, type Provider } from '@reown/appkit/react';
import toast from 'react-hot-toast';
import useTokenBalances from '@/hook/useBalance';

interface Employee {
  id: number;
  name: string;
  avatar: string;
  date: string;
  salary: string;
  status: 'Completed' | 'Processing' | 'Pending';
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

export const PayrollContent = () => {
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
  const [pendingPayments, setPendingPayments] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!isConnected || !address) return;
      
      setLoading(true);
      try {
        const token = getToken();
        if (!token) return;

        await getTokenBalances(address, walletProvider);

        // const recipientProfiles: RecipientProfiles = await profileService.getOrganizationRecipients(token);
        const orgProfile = await profileService.listOrganizationProfiles(token);
        const recipientProfiles:RecipientProfiles = orgProfile[0];
        
        // Check if recipientProfiles and recipientProfiles.recipients exist before accessing properties
        if (recipientProfiles && recipientProfiles.recipients) {
          setTotalEmployees(recipientProfiles.recipients.length);
          const activeCount = recipientProfiles.recipients.filter((e: Recipient) => e.status === 'active').length;
          setActiveEmployees(activeCount);
          setPendingPayments(Math.floor(activeCount * 0.3));

          const mockPayrollData = recipientProfiles.recipients.slice(0, 5).map((recipient: Recipient, index: number) => ({
            id: recipient.id,
            name: recipient.name || 'Unknown',
            avatar: '',
            date: new Date().toLocaleString('default', { month: 'long' }),
            salary: `$${recipient.salary || '0'}(USDT)`,
            status: ['Completed', 'Processing', 'Pending'][index % 3] as 'Completed' | 'Processing' | 'Pending'
          }));

          setEmployees(mockPayrollData);
        } else {
          // Handle the case when recipients is undefined
          console.warn('No recipients data found');
          setTotalEmployees(0);
          setActiveEmployees(0);
          setPendingPayments(0);
          setEmployees([]);
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

  // Function to render the status with appropriate color
  const renderStatus = (status: string) => {
    switch (status) {
      case 'Completed':
        return <span className="text-green-500">{status}</span>;
      case 'Processing':
        return <span className="text-gray-400">{status}</span>;
      case 'Pending':
        return <span className="text-yellow-500">{status}</span>;
      default:
        return <span className="text-gray-400">{status}</span>;
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Treasury Wallet Balance */}
        <div className="bg-black rounded-lg px-4 py-4 flex border border-[#2C2C2C] flex-col relative overflow-hidden col-span-3 h-52">
          <div className="flex items-center justify-between">
            <div className="bg-white p-2 rounded-full">
              <div className="w rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <p className="text-gray-400 mt-12">Treasury wallet balance</p>
          <div className='flex items-center gap-2'>
            <h2 className="text-white text-3xl font-semibold mt-2">${balances.loading ? '...' : balances.USDT || '0'}</h2>
            <p className="text-gray-400 text-xs">(USDT)</p>
          </div>
        </div>

        {/* Active Employees */}
        <div className="bg-black rounded-lg p-2 border border-[#2C2C2C] flex flex-col items-center justify-center relative col-span-1 h-52">
          <div className="relative w-24 h-24">
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

        {/* Pending Payments */}
        <div className="bg-black rounded-lg px-2 border border-[#2C2C2C] py-2 flex flex-col relative overflow-hidden col-span-2">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-full">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <line x1="16" y1="21" x2="16" y2="3" />
                  <line x1="8" y1="21" x2="8" y2="3" />
                </svg>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
          <div className="mt-16 gap-2 flex items-center">
            <h2 className="text-white text-3xl font-semibold">{pendingPayments}</h2>
            <p className="text-gray-500 text-sm">Pending payment</p>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="bg-black rounded-lg overflow-hidden p-6">
        {/* Tabs */}
        <div className="flex space-x-4 bg-[#0C0C0C] rounded-lg p-2 mb-8">
          <button 
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-lg ${
              activeTab === 'payment' 
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
            onClick={() => setActiveTab('salary')}
            className={`px-4 py-2 flex items-center gap-2 text-sm font-medium rounded-lg ${
              activeTab === 'salary' 
                ? 'bg-blue-600/10 text-blue-500 border border-blue-500/30' 
                : 'text-gray-400'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Salary Batch
          </button>
        </div>

        {activeTab === 'payment' ? (
          <>
            {/* Selection Options */}
            <div className="mb-10 flex justify-between gap-6">
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
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                      selectedGroup === 'all' ? 'border-blue-500 bg-blue-500' : 'border-[#0072E5]'
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
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                      selectedGroup === 'active' ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
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
                    <span className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                      selectedGroup === 'onLeave' ? 'border-blue-500 bg-blue-500' : 'border-[#0072E5]'
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

            {/* Currency and Payment Month */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              <div className="border border-gray-800 rounded-lg p-4 flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-teal-500 rounded-md mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-white">USDT</div>
                  <div className="text-gray-500 text-sm">Select Currency</div>
                </div>
              </div>
              
              <div className="border border-gray-800 rounded-lg p-4">
                <div className="text-white">Payment Month</div>
                <input 
                  type="text" 
                  placeholder="E.g. April 2025"
                  value={paymentMonth}
                  onChange={(e) => setPaymentMonth(e.target.value)}
                  className="bg-transparent text-gray-400 text-sm w-full mt-1 focus:outline-none"
                />
              </div>
            </div>

            {/* Disburse Button */}
            <div className="flex justify-end">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg">
                Disburse
              </button>
            </div>
          </>
        ) : (
          /* Salary Batch Table */
          <div className="w-full">
            {/* Table Headers */}
            <div className="grid grid-cols-4 gap-4 text-gray-400 border-b border-gray-800 pb-4 mb-4">
              <div className='px-16'>Name</div>
              <div>Date</div>
              <div>Salary</div>
              <div>Status</div>
            </div>
            
            {/* Table Rows */}
            <div className="space-y-6">
              {employees.map((employee) => (
                <div key={employee.id} className="grid grid-cols-4 gap-4 items-center border-b border-gray-800 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                      <div className="text-white text-xs">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </div>
                    <span className="text-white">{employee.name}</span>
                  </div>
                  <div className="text-white">{employee.date}</div>
                  <div className="text-white">{employee.salary}</div>
                  <div className="flex justify-between items-center">
                    {renderStatus(employee.status)}
                    <button className="bg-blue-600 px-4 py-2 rounded-lg text-white text-sm">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollContent;