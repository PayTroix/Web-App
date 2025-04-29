import { User, Mail, UploadCloud, X } from 'lucide-react';
import { TbCurrencyEthereum } from "react-icons/tb";

interface CreateRecipientProps {
  onClose: () => void;
}

export default function CreateRecipient({ onClose }: CreateRecipientProps) {
  return (
    <div className="bg-black text-white rounded-2xl p-8 shadow-xl border border-[#00468C]">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute left-4 top-4 text-gray-400 hover:text-white"
      >
        <X />
      </button>

      {/* Title */}
      <h2 className="text-center text-2xl font-semibold text-blue-500 mb-8">
        Create Recipient
      </h2>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recipient Name */}
        <div>
          <label className="flex items-center text-sm mb-1">
            <User className="w-4 h-4 mr-2 text-[#00468C]" /> Recipient Name
          </label>
          <input
            type="text"
            placeholder="Enter Recipient Name"
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center text-sm mb-1">
            <Mail className="w-4 h-4 mr-2 text-[#00468C]" /> Email
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none"
          />
        </div>

        {/* ETH */}
        <div>
          <label className="flex items-center text-sm mb-1">
            <TbCurrencyEthereum className="w-4 h-4 text-[#00468C] mr-2" /> Wallet Address
          </label>
          <input
            type="text"
            placeholder="Enter Recipient Ethereum Wallet Address"
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none"
          />
        </div>

        {/* Position */}
        <div>
          <label className="text-sm mb-1">
            Position <span className="text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            placeholder="Enter Recipient Position"
            className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-2 focus:outline-none"
          />
        </div>
      </div>

      {/* Upload Section */}
      <label className="mt-8 cursor-pointer border border-gray-600 rounded-md p-6 flex flex-col items-center justify-center hover:bg-gray-800 transition">
  <UploadCloud className="w-8 h-8 text-[#00468C] mb-2" />
  <p className="text-sm text-white">Upload .CSV File</p>
  <p className="text-xs text-orange-400 mt-1">Upload .csv and .xlsx files only</p>
  <input
    type="file"
    accept=".csv,.xlsx"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];
      if (file) {
        console.log('Selected file:', file.name);
    
      }
    }}
  />
</label>
{/* Template + Save Button */}
       <div className="flex justify-between items-center mt-6">
          <button className="border border-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition">
            Download Template
          </button>
          <button className="bg-blue-600 px-6 py-2 text-white font-semibold rounded-md hover:bg-blue-700 transition">
            Save
          </button>
        </div>
</div>
  );
}
