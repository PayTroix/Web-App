import React from 'react';

export const PendingRequest = ({ count = 0 }) => {
  return (
    <div className="bg-black border border-[#2C2C2C] rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <h2 className="text-white text-lg font-medium">Salary Advancement</h2>
        </div>
        <div className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-white text-4xl font-semibold">{count}</h2>
        <p className="text-gray-500 text-sm">Pending Request</p>
      </div>
    </div>
  );
};

// PendingPayrollVolume.jsx
export const PendingPayrollVolume = ({ volume = 0 }) => {
  return (
    <div className="bg-black border border-[#2C2C2C] rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-white p-3 rounded-full mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
        </div>
        <div className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-white text-4xl font-semibold">{volume}</h2>
        <p className="text-gray-500 text-sm">Pending Payroll volume</p>
      </div>
    </div>
  );
};