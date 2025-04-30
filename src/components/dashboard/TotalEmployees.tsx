import React from 'react';

const TotalEmployees = ({ totalEmployees = 0 }) => {
  return (
    <div className="bg-black border border-[#2C2C2C] rounded-lg p-6 flex flex-col col-span-2 relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="bg-white p-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <div className="text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
      <div className="flex items-center mt-20">
        <h2 className="text-white text-3xl font-semibold mt-2">{totalEmployees}</h2>
        <p className="text-gray-400 mt-3">Total Employees</p>
      </div>
    </div>
  );
};

export default TotalEmployees;