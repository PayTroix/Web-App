"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/components/recipient-components/RecipientSidebar";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { payrollService, leaveRequestService, web3AuthService, LeaveRequest, Payroll, profileService, RecipientProfile } from "@/services/api";
import { getToken, isValidSession, removeToken } from "@/utils/token";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useWalletRedirect } from "@/hooks/useWalletRedirect";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface DashboardData {
  totalSalary: string;
  lastPayment: {
    amount: string;
    date: string;
    status: string;
  };
  nextPayment: {
    amount: string;
    date: string;
    dueIn: number;
  };
}

interface ApiError {
  response?: {
    status: number;
  };
}

function RecipientDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [completedPayrolls, setCompletedPayrolls] = useState<Array<Payroll>>([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const token = getToken();
  const router = useRouter();
  useWalletRedirect();

  useEffect(() => {
    const validateSession = async () => {
      const isValid = await isValidSession();
      if (!isValid) router.replace('/');
      setInitialLoad(false);
    };
    validateSession();
  }, [router]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) {
        router.replace('/');
        return;
      }
      try {
        const user = await web3AuthService.getUser(token);
        if (user.user_type !== 'recipient' && user.user_type !== 'both') {
          toast.error('Unauthorized access');
          router.replace('/');
          return;
        }

        // Fetch recipient profile for this user
        let recipientProfiles: RecipientProfile[] = [];
        try {
          recipientProfiles = await profileService.listRecipientProfiles(token);
        } catch {
          toast.error('Failed to load recipient profile');
          return;
        }
        // Find the recipient profile that matches the user
        const recipientProfile = recipientProfiles.find(rp => rp.user?.id === user.id);
        if (!recipientProfile) {
          toast.error('Recipient profile not found');
          return;
        }

        let payrolls: Payroll[] = [];
        try {
          payrolls = await payrollService.listPayrolls(token);
        } catch {
          toast.error('Failed to load payroll data');
        }

        // Use recipientProfile.id to filter payrolls
        const recipientPayrolls = payrolls.filter(p => p.recipient === recipientProfile.id);
        const completed = recipientPayrolls.filter(p => p.status === 'completed');
        setCompletedPayrolls(completed);

        const salaryDivisor = 1e6;
        const totalSalaryAmount = completed.reduce((sum, payment) =>
          sum + Number(payment.amount) / salaryDivisor, 0);

        const lastPayment = completed[0];
        const nextPayment = recipientPayrolls.find(p =>
          p.status === 'pending' && new Date(p.date) > new Date()
        );

        setDashboardData({
          totalSalary: totalSalaryAmount.toFixed(2),
          lastPayment: {
            amount: lastPayment ? (Number(lastPayment.amount) / salaryDivisor).toFixed(2) : "0",
            date: lastPayment?.date || "-",
            status: lastPayment?.status || "-"
          },
          nextPayment: {
            amount: nextPayment ? (Number(nextPayment.amount) / salaryDivisor).toFixed(2) : "0",
            date: nextPayment?.date || "-",
            dueIn: nextPayment ? Math.ceil((new Date(nextPayment.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
          }
        });

      } catch (error: unknown) {
        const apiError = error as ApiError;
        if (apiError?.response?.status === 401) {
          removeToken();
          toast.error('Session expired. Please login again.');
          router.replace('/');
        } else {
          toast.error('Failed to load user data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token, router]);

  if (initialLoad) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-black">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="min-h-screen bg-black text-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Salary Card */}
            <div className="bg-black rounded-lg p-2 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <Image
                    src="/wallet.png"
                    alt="Wallet"
                    width={70}
                    height={40}
                    className="bg-opacity-20 p-3 rounded-full"
                    priority
                  />
                </div>
                <ChevronRight className="h-6 w-6 text-gray-500" />
              </div>
              <div className="mt-auto p-2">
                <p className="text-gray-400 text-sm">Total Salary</p>
                <div className="flex items-baseline">
                  <h2 className="text-4xl font-bold">
                    ${Number(dashboardData?.totalSalary || 0).toLocaleString()}
                  </h2>
                  <span className="ml-2 text-gray-400 text-sm">Total</span>
                </div>
              </div>
            </div>

            {/* Last Payment Card */}
            <div className="bg-black rounded-lg p-2 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <Image
                    src="/pass.png"
                    alt="Last Payment"
                    width={70}
                    height={40}
                    className="bg-opacity-20 p-3 rounded-full"
                    priority
                  />
                </div>
                <h1 className="text-[#B0B0B0] text-nowrap mr-20">Last Payment</h1>
                <ChevronRight className="h-6 w-6 text-gray-500" />
              </div>
              <div className="mt-auto p-2">
                <p className="text-gray-400 text-sm">
                  {(dashboardData?.lastPayment.date && dashboardData.lastPayment.date !== "-")
                    ? format(new Date(dashboardData.lastPayment.date as string), "MMM dd, yyyy")
                    : "-"}
                </p>
                <div className="flex items-baseline">
                  <h2 className="text-4xl font-bold">
                    ${dashboardData?.lastPayment.amount}
                  </h2>
                  <span className="ml-2 text-green-500 text-sm">{dashboardData?.lastPayment.status}</span>
                </div>
              </div>
            </div>

            {/* Next Payment Card */}
            <div className="bg-black rounded-lg p-2 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <Image
                    src="/clock.png"
                    alt="Next Payment"
                    width={70}
                    height={40}
                    className="bg-opacity-20 p-3 rounded-full"
                    priority
                  />
                </div>
                <h1 className="text-[#B0B0B0] mr-20 text-nowrap">Next Payment</h1>
                <ChevronRight className="h-6 w-6 text-gray-500" />
              </div>
              <div className="mt-auto p-2">
                <p className="text-gray-400 text-sm">
                  {dashboardData?.nextPayment.date && dashboardData.nextPayment.date !== "-"
                    ? format(new Date(dashboardData.nextPayment.date), "MMM dd, yyyy")
                    : "-"}
                </p>
                <div className="flex items-baseline">
                  <h2 className="text-4xl font-bold">
                    ${dashboardData?.nextPayment.amount}
                  </h2>
                  <span className="ml-2 text-amber-500 text-sm">
                    Due in {dashboardData?.nextPayment.dueIn} days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment History Section */}
          <div className="bg-black rounded-lg p-4 md:p-6 border border-[#2C2C2C] transition-all duration-300 hover:border-blue-500/20">
            <div className="flex items-center gap-0.2 mb-6">
              <div>
                <Image
                  src="/vector.png"
                  alt="Payment History"
                  width={50}
                  height={20}
                  className="bg-opacity-20 p-3 rounded-full"
                  priority
                />
              </div>
              <h3 className="text-lg font-medium">Payment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-gray-400 text-sm">
                    <th className="pb-4 font-normal">Amount</th>
                    <th className="pb-4 font-normal">Payment Date</th>
                    <th className="pb-4 font-normal">Description</th>
                    <th className="pb-4 font-normal">Status</th>
                    <th className="pb-4 font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  {completedPayrolls.map((payment, index) => (
                    <tr key={index} className="text-left">
                      <td className="py-4 font-medium">
                        ${Number(payment.amount) / 1e6}
                      </td>
                      <td className="py-4">
                        {format(new Date(payment.date), "MMM dd, yyyy")}
                      </td>
                      <td className="py-4">{payment.description}</td>
                      <td className="py-4">
                        <span className="text-green-500">{payment.status}</span>
                      </td>
                      <td className="py-4 text-right">
                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                  {completedPayrolls.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-400">
                        No completed payments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default RecipientDashboard;
