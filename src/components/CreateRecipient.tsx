import { useState, useRef, ChangeEvent } from 'react';
import * as Papa from 'papaparse';
import { ChevronDown, ChevronUp, User, Mail, Trash2, Plus, UploadCloud, X } from 'lucide-react';
import { TbCurrencyEthereum } from "react-icons/tb";
import toast from 'react-hot-toast';
import { createBatchRecipientsAtomic, createRecipientAtomic } from '@/services/createRecipient';
import { ethers } from 'ethers';
import { profileService } from '@/services/api';
import { useAppKitNetworkCore, useAppKitProvider, type Provider } from '@reown/appkit/react';
import { useAppKitAccount } from '@reown/appkit/react';
import { getToken, isTokenExpired } from '@/app/register/token';
import abi from '@/services/abi.json';

interface Recipient {
  name: string;
  email: string;
  recipient_ethereum_address: string;
  position: string;
  salary: string;
  isExpanded?: boolean; 
}

interface CreateRecipientProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateRecipient({ onClose, onSuccess }: CreateRecipientProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([{
    name: '',
    email: '',
    recipient_ethereum_address: '',
    position: '',
    salary: '',
    isExpanded: false
  }]);
  const [csvData, setCsvData] = useState<Recipient[]>([]);
  const [isCsvPreview, setIsCsvPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { walletProvider } = useAppKitProvider<Provider>('eip155');
  const { chainId } = useAppKitNetworkCore();
  const { address, isConnected } = useAppKitAccount();

  const toggleExpand = (index: number) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index].isExpanded = !updatedRecipients[index].isExpanded;
    setRecipients(updatedRecipients);
  };

  const handleInputChange = (index: number, field: keyof Pick<Recipient, 'name' | 'email' | 'recipient_ethereum_address' | 'position' | 'salary'>, value: string) => {
    const updatedRecipients = [...recipients];
    updatedRecipients[index][field] = value;
    setRecipients(updatedRecipients);
  };

  const addRecipient = () => {
    setRecipients([...recipients, {
      name: '',
      email: '',
      recipient_ethereum_address: '',
      position: '',
      salary: '',
      isExpanded: false // Add default expanded state
    }]);
  };

  const removeRecipient = (index: number) => {
    if (recipients.length > 1) {
      const updatedRecipients = [...recipients];
      updatedRecipients.splice(index, 1);
      setRecipients(updatedRecipients);
    }
  };

  // In CreateRecipient component - fixed CSV validation:
const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const parsedData = results.data as Partial<Recipient>[];
        if (parsedData.length === 0) {
          toast.error('CSV file is empty');
          return;
        }

        // Check required fields in first row
        const firstRow = parsedData[0];
        if (!firstRow.name || !firstRow.email || !firstRow.recipient_ethereum_address || !firstRow.salary) {
          toast.error('Invalid CSV format. Required fields: name, email, recipient_ethereum_address, salary');
          return;
        }

        // Filter out invalid rows
        const validData = parsedData.filter(item => 
          item.name && 
          item.email && 
          item.recipient_ethereum_address &&
          item.salary
        );

        if (validData.length < parsedData.length) {
          toast(`Filtered out ${parsedData.length - validData.length} invalid rows`, { icon: '⚠️' });
        }

        if (validData.length === 0) {
          toast.error('No valid data found in CSV');
          return;
        }

        setCsvData(validData as Recipient[]);
        setIsCsvPreview(true);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        toast.error(`Error parsing CSV: ${error.message}`);
      }
    });
  };

  const useCsvData = () => {
    // Ensure data has expected fields
    const validData = csvData.filter(item => 
      item.name && 
      item.email && 
      item.recipient_ethereum_address &&
      item.salary
    );
    
    if (validData.length < csvData.length) {
      toast(`${csvData.length - validData.length} invalid entries were filtered out.`, { icon: '⚠️' });
    }
    
    if (validData.length === 0) {
      toast.error('No valid data found in CSV');
      return;
    }
    
    // Add isExpanded property to each recipient
    const formattedData = validData.map(item => ({
      ...item,
      isExpanded: false
    }));
    
    setRecipients(formattedData);
    setIsCsvPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const cancelCsvPreview = () => {
    setCsvData([]);
    setIsCsvPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateWalletAddress = (address: string): boolean => {
    return ethers.isAddress(address);
  };

  const handleSave = async () => {
    console.log('Save button clicked'); // Debug log
    
    // Validation
    const validationErrors: string[] = [];
    console.log('Validating recipients:', recipients); // Debug log
    
    recipients.forEach((recipient, index) => {
      if (!recipient.name.trim()) {
        validationErrors.push(`Recipient ${index + 1}: Name is required`);
      }
      
      if (!recipient.email.trim() || !validateEmail(recipient.email)) {
        validationErrors.push(`Recipient ${index + 1}: Valid email is required`);
      }
      
      if (!validateWalletAddress(recipient.recipient_ethereum_address)) {
        validationErrors.push(`Recipient ${index + 1}: Valid Ethereum wallet address is required`);
      }
      
      const salary = parseFloat(recipient.salary);
      if (isNaN(salary) || salary <= 0) {
        validationErrors.push(`Recipient ${index + 1}: Valid salary greater than 0 is required`);
      }
    });
    
    if (validationErrors.length > 0) {
      console.error('Validation errors:', validationErrors); // Debug log
      toast.error(validationErrors.slice(0, 3).join('\n') + 
        (validationErrors.length > 3 ? `\n...and ${validationErrors.length - 3} more errors` : ''));
      return;
    }
    
    // Wallet connection check
    if (!isConnected || !walletProvider) {
      console.error('Wallet not connected - isConnected:', isConnected, 'walletProvider:', walletProvider); // Debug log
      toast.error('Wallet is not connected. Please connect your wallet first.');
      return;
    }
  
    try {
      setIsSubmitting(true);
      console.log('Submitting recipients...'); // Debug log
      
      const token = getToken();
      if (!token || isTokenExpired()) {
        throw new Error('Authentication token not found');
      }
      console.log('Token retrieved'); // Debug log

      // Get organization ID
      // const userData = await web3AuthService.getUser(token);
      const orgResponse = await profileService.listOrganizationProfiles(token);
      console.log('Organization response:', orgResponse); // Debug log
      const organizationId = orgResponse[0].id;

      // Get signer
      const provider = new ethers.BrowserProvider(walletProvider, chainId);
      const signer = await provider.getSigner();
      console.log('Signer obtained:', signer); // Debug log
  
      const factoryContractAddress = process.env.NEXT_PUBLIC_LISK_CONTRACT_ADDRESS;
      if (!factoryContractAddress) {
        throw new Error('Factory contract address not found in environment variables');
      }
      console.log('Factory contract address:', factoryContractAddress); // Debug log

      const factoryContract = new ethers.Contract(factoryContractAddress, abi, provider);
      const contractAddress = await factoryContract.getOrganizationContract(address);

      if (!contractAddress || !ethers.isAddress(contractAddress)) {
        throw new Error('Invalid contract address');
      }
      console.log('Contract address:', contractAddress); // Debug log
  
  
      // Prepare recipients data
      const formattedRecipients = recipients.map(recipient => ({
        ...recipient,
        salary: parseFloat(recipient.salary),
        recipient_ethereum_address: ethers.getAddress(recipient.recipient_ethereum_address)
      }));
      console.log('Formatted recipients:', formattedRecipients); // Debug log
  
      
      console.log('Organization ID:', organizationId); // Debug log
  
      if (formattedRecipients.length === 1) {
        console.log('Creating single recipient'); // Debug log
        const [recipient] = formattedRecipients;
        const result = await createRecipientAtomic({
          name: recipient.name,
          email: recipient.email,
          recipient_ethereum_address: recipient.recipient_ethereum_address,
          organization: organizationId,
          phone_number: '',
          salary: recipient.salary,
          position: recipient.position || '',
          token,
          signer,
          contractAddress
        });
        console.log('Single recipient created:', result); // Debug log
      } else {
        console.log('Creating batch recipients'); // Debug log
        const result = await createBatchRecipientsAtomic({
          recipients: formattedRecipients.map(r => ({
            name: r.name,
            email: r.email,
            recipient_ethereum_address: r.recipient_ethereum_address,
            phone_number: '',
            salary: r.salary,
            position: r.position || ''
          })),
          organizationId,
          token,
          signer,
          contractAddress
        });
        console.log('Batch recipients created:', result); // Debug log
      }
      
      console.log('Successfully created recipients'); // Debug log
      toast.success(
        `Successfully ${formattedRecipients.length > 1 ? 'created ' + formattedRecipients.length + ' recipients' : 'created recipient'}`
      );
      
      onClose();
      if (onSuccess) onSuccess();
  
    } catch (error) {
      console.error('Save error:', error); // Debug log
      
      let errorMessage = 'Failed to save recipients';
      if (error instanceof Error) {
        errorMessage = error.message;
        if ('reason' in error) {
          errorMessage = error.reason as string;
        } else if (error.cause && typeof error.cause === 'object' && 'message' in error.cause) {
          errorMessage = error.cause.message as string;
        }
      }
      console.error(`Full error: ${errorMessage}`); // Debug log
      toast.error(`Error: ${errorMessage.split('(')[0]}`);
    } finally {
      setIsSubmitting(false);
      console.log('Submission complete'); // Debug log
    }
  };

  
  return (
    <div className="bg-black text-white rounded-2xl p-8 shadow-xl border border-[#00468C] relative">
      {/* Close Button */}

      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-white"
      >
        <X />
      </button>

      {/* Title */}
      <h2 className="text-center text-2xl font-semibold text-blue-500 mb-8">
        Create Recipient{recipients.length > 1 ? 's' : ''}
      </h2>

      {/* CSV Preview Modal */}
      {isCsvPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a0a0a] border border-[#00468C] rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold text-blue-500 mb-4">CSV Preview</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-4">Name</th>
                    <th className="text-left py-2 px-4">Email</th>
                    <th className="text-left py-2 px-4">Wallet</th>
                    <th className="text-left py-2 px-4">Position</th>
                    <th className="text-left py-2 px-4">Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((recipient, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      <td className="py-2 px-4">{recipient.name}</td>
                      <td className="py-2 px-4">{recipient.email}</td>
                      <td className="py-2 px-4 font-mono text-xs">{recipient.recipient_ethereum_address}</td>
                      <td className="py-2 px-4">{recipient.position}</td>
                      <td className="py-2 px-4">{recipient.salary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button 
                onClick={cancelCsvPreview}
                disabled={isSubmitting}
                className="border border-gray-600 px-4 py-2 rounded-md hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button 
                onClick={useCsvData}
                disabled={isSubmitting}
                className="bg-blue-600 px-6 py-2 text-white font-semibold rounded-md hover:bg-blue-700 transition"
              >
                Use This Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recipient Forms */}
      <div className="space-y-4">
        {recipients.map((recipient, index) => (
          <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
            {/* Collapsed Header */}
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-900 transition"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center">
                <TbCurrencyEthereum className="w-5 h-5 text-[#00468C] mr-3" />
                <span className="font-mono text-sm">
                  {recipient.recipient_ethereum_address || 'New Recipient'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {recipients.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecipient(index);
                    }}
                    disabled={isSubmitting}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                {recipient.isExpanded ? (
                  <ChevronUp className="text-gray-400" size={18} />
                ) : (
                  <ChevronDown className="text-gray-400" size={18} />
                )}
              </div>
            </div>

            {/* Expanded Content */}
            {recipient.isExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900/50">
                <div>
                  <label className="flex items-center text-xs mb-1 text-gray-300">
                    <User className="w-3 h-3 mr-2 text-[#00468C]" /> Name *
                  </label>
                  <input
                    type="text"
                    value={recipient.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                    placeholder="Recipient Name"
                    disabled={isSubmitting}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center text-xs mb-1 text-gray-300">
                    <Mail className="w-3 h-3 mr-2 text-[#00468C]" /> Email *
                  </label>
                  <input
                    type="email"
                    value={recipient.email}
                    onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                    placeholder="Email Address"
                    disabled={isSubmitting}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center text-xs mb-1 text-gray-300">
                    <TbCurrencyEthereum className="w-3 h-3 mr-2 text-[#00468C]" /> ETH Wallet Address *
                  </label>
                  <input
                    type="text"
                    value={recipient.recipient_ethereum_address}
                    onChange={(e) => handleInputChange(index, 'recipient_ethereum_address', e.target.value)}
                    placeholder="0x..."
                    disabled={isSubmitting}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs mb-1 text-gray-300">
                    Salary (ETH) *
                  </label>
                  <input
                    type="text"
                    value={recipient.salary}
                    onChange={(e) => handleInputChange(index, 'salary', e.target.value)}
                    placeholder="0.00"
                    disabled={isSubmitting}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs mb-1 text-gray-300">
                    Position <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={recipient.position}
                    onChange={(e) => handleInputChange(index, 'position', e.target.value)}
                    placeholder="Job Position"
                    disabled={isSubmitting}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={addRecipient}
          disabled={isSubmitting}
          className="flex items-center text-blue-500 hover:text-blue-400 text-sm mt-2"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Another Recipient
        </button>
      </div>

      {/* Upload Section */}
      <div className="mt-8">
        <label className={`cursor-pointer border border-gray-600 rounded-md p-6 flex flex-col items-center justify-center ${isSubmitting ? 'opacity-50' : 'hover:bg-gray-800'} transition`}>
          <UploadCloud className="w-8 h-8 text-[#00468C] mb-2" />
          <p className="text-sm text-white">Upload .CSV File</p>
          <p className="text-xs text-orange-400 mt-1">Upload .csv files only</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isSubmitting}
          />
        </label>
      </div>

      {/* Template + Save Button */}
      <div className="flex justify-between items-center mt-6">
        <button 
          className="border border-gray-600 px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition"
          disabled={isSubmitting}
        >
          Download Template
        </button>
        <button 
          onClick={handleSave}
          disabled={isSubmitting}
          className={`bg-blue-600 px-6 py-2 text-white font-semibold rounded-md ${isSubmitting ? 'opacity-50' : 'hover:bg-blue-700'} transition`}
        >
          {isSubmitting ? 'Saving...' : `Save ${recipients.length > 1 ? `(${recipients.length})` : ''}`}
        </button>
      </div>
    </div>
  );
}