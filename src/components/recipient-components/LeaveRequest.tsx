"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { leaveRequestService } from "@/services/api";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { getToken } from "@/utils/token";
import { toast } from "react-hot-toast";
import { useWalletRedirect } from "@/hooks/useWalletRedirect";

export default function LeaveRequestModal({ onClose }: { onClose: () => void }) {
  useWalletRedirect();
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate inputs
    if (!leaveType || !startDate || !endDate || !reason) {
      toast.error("Please fill in all fields");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("End date cannot be before start date");
      return;
    }

    const token = getToken();
    if (!token) {
      toast.error("Please connect your wallet first");
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading("Submitting leave request...");

    try {
      await leaveRequestService.createLeaveRequest({
        leave_type: leaveType as 'sick' | 'vacation' | 'personal' | 'other',
        start_date: startDate,
        end_date: endDate,
        reason,
        status: 'pending',
      }, token);

      toast.success("Leave request submitted successfully", { id: loadingToast });
      onClose();
    } catch (error) {
      console.error("Error submitting leave request:", error);
      toast.error("Failed to submit leave request", { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0A0A] text-white w-full max-w-3xl rounded-lg px-6 py-8 shadow-lg border border-[#1A1A1A] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:text-gray-500 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Title */}
        <h2 className="text-center text-2xl font-semibold text-blue-500 mb-8">
          Leave Request
        </h2>

        {/* Leave Type & Dates */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 mb-2 text-sm text-gray-300">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Leave Type
            </label>
            <div className="relative">
              <select
                className="appearance-none w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="" className="text-gray-500">Select Leave Type</option>
                <option value="sick">Sick Leave</option>
                <option value="vacation">Annual Leave</option>
                <option value="personal">Personal Leave</option>
                <option value="other">Other</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="text-sm mb-2 block text-gray-300">Date Range</label>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Start Date Input */}
              <div className="flex-1">
                <div className="relative">
                  {/* <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div> */}
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={`peer w-full bg-[#0A0A0A] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm
                              text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                              transition-all cursor-pointer appearance-none`}
                    disabled={isSubmitting}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <label
                    htmlFor="start-date"
                    className={`absolute left-10 -top-2 text-xs px-1 bg-[#0A0A0A] text-gray-400
                               transition-all pointer-events-none
                               peer-placeholder-shown:text-sm
                               peer-placeholder-shown:top-1/2
                               peer-placeholder-shown:-translate-y-1/2
                               peer-focus:-top-2
                               peer-focus:text-xs
                               peer-focus:text-blue-500`}
                  >
                    Start Date
                  </label>
                </div>
              </div>

              {/* End Date Input */}
              <div className="flex-1">
                <div className="relative">
                  {/* <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div> */}
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={`peer w-full bg-[#0A0A0A] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-sm
                              text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                              transition-all cursor-pointer appearance-none`}
                    disabled={isSubmitting}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                  <label
                    htmlFor="end-date"
                    className={`absolute left-10 -top-2 text-xs px-1 bg-[#0A0A0A] text-gray-400
                               transition-all pointer-events-none
                               peer-placeholder-shown:text-sm
                               peer-placeholder-shown:top-1/2
                               peer-placeholder-shown:-translate-y-1/2
                               peer-focus:-top-2
                               peer-focus:text-xs
                               peer-focus:text-blue-500`}
                  >
                    End Date
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="mb-8">
          <label className="text-sm mb-2 block text-gray-300">Reason</label>
          <textarea
            rows={4}
            placeholder="Enter your reason for leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-[#0A0A0A] border border-gray-700 rounded-lg px-4 py-3 text-sm text-gray-300 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                      placeholder-gray-500"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-sm text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:text-gray-500 disabled:hover:bg-transparent"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-all 
                     disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting && 
            <div className="scale-[0.35]"> {/* Scale down wrapper for LoadingSpinner */}
              <LoadingSpinner className="!h-4 !w-4" />
            </div>
            }
            <span>Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
}