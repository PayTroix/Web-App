import React from 'react';

const ActiveEmployees = ({ activeEmployees = 0, performancePercentage = 0 }) => {
  return (
    <div className="bg-black border border-[#2C2C2C] rounded-lg p-6 flex flex-col items-center justify-center relative">
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
            strokeDashoffset={339.3 * (1 - performancePercentage / 100)} // Calculate based on percentage
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-xl font-bold">{performancePercentage}%</span>
        </div>
      </div>
      <div className="mt-2">
        <h2 className="text-white text-4xl font-semibold text-center">{activeEmployees}</h2>
        <p className="text-gray-500 text-sm text-center">Active Employee</p>
      </div>
    </div>
  );
};

export default ActiveEmployees;