import { useState } from 'react';

export default function SalaryAdvance() {
  const [amount, setAmount] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [reason, setReason] = useState('');
  const [repaymentMethod, setRepaymentMethod] = useState('');
  const [repaymentDate, setRepaymentDate] = useState('');

  return (
    <div className="min-h-screen bg-black text-white p-8 border border-[#2C2C2C] rounded-lg shadow-lg">
      <div className="w-full max-w-4xl rounded-lg ">
        <h2 className="text-xl font-semibold mb-6">Request Salary Advance</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount Requested */}
          <div className="space-y-2">
            <label className="block text-sm">💳 Amount Requested</label>
            <input
              type="text"
              placeholder="e.g., $1,000 (limit based on rules)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black border border-gray-700 px-3 py-3 rounded text-sm placeholder-gray-500 focus:outline-none"
            />
            <div className="flex items-center gap-4 mt-2">
              <div>
              <label className="text-sm">Advance Percentage</label>
              <input
                type="range"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full"
              />
              </div>
              <span className="text-sm mt-4">{percentage}%</span>
            </div>
          </div>

          {/* Repayment Method */}
          <div className="space-y-2">
            <label className="block text-sm">Repayment Method</label>
            <select
              value={repaymentMethod}
              onChange={(e) => setRepaymentMethod(e.target.value)}
              className="w-full bg-black border border-gray-700 px-3 py-3 rounded text-sm focus:outline-none"
            >
              <option value="">Select Repayment Method</option>
              <option value="deduct_next " className='mb-4'>Deduct from Next Salary</option>
              <option value="installments">Monthly Installments</option>
            </select>

            <label className="block text-sm mt-4">Repayment Date</label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              value={repaymentDate}
              onChange={(e) => setRepaymentDate(e.target.value)}
              className="w-full bg-black border border-gray-700 px-3 py-3 rounded text-sm placeholder-gray-500 focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional if not deducted immediately
            </p>
          </div>

          {/* Reason */}
          <div className="md:col-span-2">
            <label className="block text-sm mb-2">Reason</label>
            <textarea
              placeholder="Enter your reason for salary advance"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-black border border-gray-700 px-3 py-2 rounded text-sm placeholder-gray-500 focus:outline-none h-28 resize-none"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-8 mt-6">
          <button className="text-sm text-white hover:underline">Cancel</button>
          <button className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-sm rounded text-white">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
