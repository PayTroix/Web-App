"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function LeaveRequestModal({ onClose }: { onClose: () => void }) {
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#0A0A0A] text-white w-full max-w-3xl rounded-lg px-6 py-8 shadow-lg border border-[#1A1A1A] relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 left-4 text-blue-500 hover:text-white">
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-blue-500 mb-10">
          Leave Request
        </h2>

        {/* Leave Type & Dates */}
        <div className="grid grid-cols-5 gap-6 mb-6">
          <div className="col-span-2">
            <label className="flex items-center gap-1 mb-2 text-sm">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Leave Type
            </label>
            <select
              className="w-[90%] bg-transparent border border-gray-700 rounded px-4 py-4 text-sm text-gray-300 focus:outline-none"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              style={{ backgroundColor: '#0A0A0A' }}
            >
              <option value="" className="text-gray-500 bg-black p-4 border-b border-gray-600">Select Leave Type</option>
              <option value="sick" className="bg-black p-4 border-b border-gray-600">Sick Leave</option>
              <option value="vacation" className="bg-black p-4 border-b border-gray-600">Annual</option>
              <option value="casual" className="bg-black p-4 border-b border-gray-600">Casual</option>
              <option value="maternity" className="bg-black p-4 border-b border-gray-600">Maternity</option>
            </select>
          </div>

          <div className="col-span-3">
            <label className="flex items-center gap-1 mb-2 text-sm">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Date
            </label>
            <div className="flex gap-4 ">
              <div className="flex border col-span-1.5 border-gray-700 rounded  px-4 py-4 text-sm text-gray-300 focus:outline-none gap-4 items-center text-center">
                <h3 className="">Start</h3>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-300 focus:outline-none"
                />
              </div>
              <div className="flex border col-span-1.5 border-gray-700 rounded  px-4 py-4 text-sm text-gray-300 focus:outline-none gap-4 items-center text-center">
              <h3>End</h3>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-300 focus:outline-none"
              />
              </div>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="mb-8">
          <label className="text-sm mb-2 block">Reason</label>
          <textarea
            rows={4}
            placeholder="Enter your reason for leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-transparent border border-gray-700 rounded px-4 py-2 text-sm text-gray-300 focus:outline-none placeholder:italic placeholder-gray-500"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4">
          <button onClick={onClose} className="text-sm text-white hover:underline">
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 transition">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
