"use client";

import React from "react";
import Layout from "@/components/RecipientSidebar";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

function RecipientDashboard() {
  return (
    <Layout>
      <main className="min-h-screen bg-black text-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total Salary Card */}
            <div className="bg-zinc-900 rounded-xl p-6 flex flex-col">
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
              <div className="mt-auto">
                <p className="text-gray-400 text-sm">Total Salary</p>
                <div className="flex items-baseline">
                  <h2 className="text-4xl font-bold">$4000</h2>
                  <span className="ml-2 text-gray-400 text-sm">Monthly</span>
                </div>
              </div>
            </div>

            {/* Last Payment Card */}
            <div className="bg-zinc-900 rounded-xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <Image
                    src="/pass.png"
                    alt="Wallet"
                    width={70}
                    height={40}
                    className="bg-opacity-20 p-3 rounded-full"
                    priority
                  />
                </div>
                <h1 className="text-[#B0B0B0] mr-20">Last Payment</h1>
                <ChevronRight className="h-6 w-6 text-gray-500" />
              </div>
              <div className="mt-auto">
                <p className="text-gray-400 text-sm">Apr 25, 2025</p>
                <div className="flex items-baseline">
                  <h2 className="text-4xl font-bold">$4000</h2>
                  <span className="ml-2 text-green-500 text-sm">Paid</span>
                </div>
              </div>
            </div>

            {/* Next Payment Card */}
            <div className="bg-zinc-900 rounded-xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <Image
                    src="/clock.png"
                    alt="Wallet"
                    width={70}
                    height={40}
                    className="bg-opacity-20 p-3 rounded-full"
                    priority
                  />
                </div>
                <h1 className="text-[#B0B0B0] mr-20">Next Payment</h1>
                <ChevronRight className="h-6 w-6 text-gray-500" />
              </div>
              <div className="mt-auto">
                <p className="text-gray-400 text-sm">May 30, 2025</p>
                <div className="flex items-baseline">
                  <h2 className="text-4xl font-bold">$4000</h2>
                  <span className="ml-2 text-amber-500 text-sm">
                    Due in 31 days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Overview Section */}
          <div className="bg-zinc-900 rounded-xl p-6">
            <div className="flex items-center gap-0.2 mb-6">
              <div>
                <Image
                  src="/vector.png"
                  alt="Wallet"
                  width={50}
                  height={20}
                  className="bg-opacity-20 p-3 rounded-full"
                  priority
                />
              </div>
              <h3 className="text-lg font-medium">Payment Overview</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800 text-left text-gray-400 text-sm">
                    <th className="pb-4 font-normal">Net Pay</th>
                    <th className="pb-4 font-normal">Payment Date</th>
                    <th className="pb-4 font-normal">Next Payment</th>
                    <th className="pb-4 font-normal">Leave Taken</th>
                    <th className="pb-4 font-normal">Status</th>
                    <th className="pb-4 font-normal"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-left">
                    <td className="py-4 font-medium">$4,000</td>
                    <td className="py-4">Apr 29, 2025</td>
                    <td className="py-4">May 30, 2025</td>
                    <td className="py-4">5</td>
                    <td className="py-4">Crypto (USDT)</td>
                    <td className="py-4 text-right">
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium">
                        View
                      </button>
                    </td>
                  </tr>
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
