import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function LeaveManagementDetails() {
  const [isApproved, setIsApproved] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);

  const handleApprove = () => {
    setIsApproved(true);
  };

  const handleDecline = () => {
    setIsDeclined(true);
  };

  return (
    <div className="bg-[#111111] text-gray-100 p-8 rounded-lg border border-[#333333]">
      <div className="max-w-4xl mx-auto">
        {/* Header - Improved text contrast */}
        <div className="flex items-center justify-between mb-8 mt-6">
          <div className="flex items-center">
            <Link href="/employees" className="mr-4 text-white hover:text-blue-400 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-semibold text-white">Recipient Leave</h1>
          </div>
          <div className="text-white text-sm">
            <span className="text-gray-300">Date Submitted:</span>
            <span className="ml-4 text-white font-medium">May 12, 2025</span>
          </div>
        </div>

        {/* User Profile Section - Enhanced text visibility */}
        <div className="mb-8 bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
          <div className="flex items-center">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
              <div className="absolute inset-0 bg-blue-600 rounded-full">
                <div className="w-full h-full relative flex items-center justify-center text-white text-2xl font-bold">
                  JS
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-white">John Smith</h2>
                <span className="text-green-400 text-sm px-3 py-1 bg-green-400/10 rounded-full border border-green-400/20">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section - Improved text contrast and sizing */}
        <div className="border-t border-[#333333] py-6">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 text-sm font-medium mb-2">Position</p>
                <p className="text-white text-lg">Software Engineer</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm font-medium mb-2">Leave Balance</p>
                <div className="flex items-center gap-2">
                  <p className="text-white text-lg">3 Days Remaining</p>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 text-sm font-medium mb-2">Total Days</p>
                <p className="text-white text-lg">3 Working Days</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm font-medium mb-2">Date Range</p>
                <p className="text-white text-lg">May 22 - May 25, 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reason Section - Enhanced readability */}
        <div className="border-t border-[#333333] py-6 mb-8">
          <p className="text-gray-300 text-sm font-medium mb-3">Reason for Leave</p>
          <div className="bg-[#1A1A1A] p-6 rounded-lg border border-[#333333]">
            <p className="text-white leading-relaxed">
              I have a scheduled medical appointment that requires my full attention, followed by a short recovery period as advised by my physician. Due to this, I will not be able to perform my duties effectively during this time. I kindly request medical leave from May 20 to May 22, 2025, to prioritize my health and return to work fully recovered. A medical certificate can be provided upon request to support this leave application. I appreciate your understanding and support.
            </p>
          </div>
        </div>

        {/* Actions - Improved button visibility */}
        <div className="flex justify-end mt-8 gap-4">
          {isDeclined ? (
            <div className="text-red-400 bg-red-400/10 px-6 py-3 rounded-lg border border-red-400/20 font-medium">
              Request declined
            </div>
          ) : isApproved ? (
            <div className="text-green-400 bg-green-400/10 px-6 py-3 rounded-lg border border-green-400/20 font-medium">
              Request approved
            </div>
          ) : (
            <>
              <button
                onClick={handleDecline}
                className="px-6 py-3 rounded-lg border border-[#333333] text-white hover:bg-[#1A1A1A] transition-colors font-medium"
              >
                Decline
              </button>
              <button
                onClick={handleApprove}
                className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
              >
                Approve
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}