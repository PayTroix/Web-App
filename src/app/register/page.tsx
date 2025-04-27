'use client';

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/Sidebar';

function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Construct organization data
    const orgData = {
      name: formData.get('orgName'),
      email: formData.get('email'),
      address1: formData.get('address1'),
      address2: formData.get('address2'),
      country: formData.get('country'),
      state: formData.get('state'),
      website: formData.get('website'),
    };

    try {
      // Here you would typically make an API call to register the organization
      console.log('Submitting organization data:', orgData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulating successful registration
      router.push('/dashboard');
    } catch (error) {
      console.error('Error registering organization:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" flex flex-col bg-black">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="https://res.cloudinary.com/dxswouxj5/image/upload/v1745718689/Hompage_1_ncxtux.png"
          alt="Background" 
          fill 
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center mx-32 my-8 bg-[#060D13]  px-8 py-4  rounded-md">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={120} height={120} />
          </Link>
        </div>
        <div className="flex items-center text-blue-400">
          <span className="mr-2">✓</span>
          <span className="text-sm text-gray-400">0xB9.....4aba</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex justify-center items-center px-4 mt-12">
        <div className="bg-black bg-opacity-80 border border-gray-800 rounded-lg p-8 w-full max-w-4xl">
          <h2 className="text-blue-500 text-2xl font-semibold text-center mb-8">Register as an Organization</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Organization Name */}
            <div className="flex flex-col">
              <label className="flex items-center mb-2 text-gray-300">
                <span className="mr-2">🏢</span>
                <span>Organization Name</span>
              </label>
              <input 
                name="orgName"
                type="text" 
                placeholder="Enter Organization's Name"
                required
                className="bg-black border border-gray-700 rounded p-3 text-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="flex items-center mb-2 text-gray-300">
                <span className="mr-2">📧</span>
                <span>Email</span>
              </label>
              <input 
                name="email"
                type="email" 
                placeholder="Enter Email"
                required
                className="bg-black border border-gray-700 rounded p-3 text-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Address 1 */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Address 1</label>
              <input 
                name="address1"
                type="text" 
                placeholder="Enter your address"
                required
                className="bg-black border border-gray-700 rounded p-3 text-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Address 2 */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Address 2 <span className="text-gray-500">(Optional)</span></label>
              <input 
                name="address2"
                type="text" 
                placeholder="Enter your address"
                className="bg-black border border-gray-700 rounded p-3 text-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Country */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">Country</label>
              <div className="relative">
                <select 
                  name="country"
                  required
                  className="bg-black border border-gray-700 rounded p-3 text-gray-400 w-full appearance-none focus:outline-none focus:border-blue-500"
                >
                  <option value="">Select country</option>
                  <option value="us">United States</option>
                  <option value="ca">Canada</option>
                  <option value="uk">United Kingdom</option>
                  <option value="au">Australia</option>
                  <option value="de">Germany</option>
                  <option value="jp">Japan</option>
                  <option value="sg">Singapore</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* State */}
            <div className="flex flex-col">
              <label className="mb-2 text-gray-300">State</label>
              <input 
                name="state"
                type="text" 
                placeholder="Enter your state"
                required
                className="bg-black border border-gray-700 rounded p-3 text-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Website */}
            <div className="flex flex-col md:col-span-2">
              <label className="flex items-center mb-2 text-gray-300">
                <span className="mr-2">🌐</span>
                <span>Website <span className="text-gray-500">(Optional)</span></span>
              </label>
              <input 
                name="website"
                type="url" 
                placeholder="Enter your website"
                className="bg-black border border-gray-700 rounded p-3 text-gray-300 w-full focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end mt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`${
                  isSubmitting ? 'bg-blue-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-medium py-2 px-10 rounded flex items-center justify-center`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}

export default RegisterPage