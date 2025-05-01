'use client';

import { useState, useEffect } from 'react';
import { profileService } from '@/services/api';
import { useAppKitAccount } from '@reown/appkit/react';
import { getToken } from '@/app/register/token';
import { showToast } from '@/utils/toast';

interface OrganizationData {
  id: number;
  name: string;
  email: string;
  organization_address: string;
  organization_phone?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [formData, setFormData] = useState<Partial<OrganizationData>>({});
  const { isConnected } = useAppKitAccount();

  useEffect(() => {
    fetchOrganizationData();
  }, [isConnected]);

  const fetchOrganizationData = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const profiles = await profileService.listOrganizationProfiles(token);
      if (profiles.length > 0) {
        setOrganizationData(profiles[0]);
        setFormData(profiles[0]);
      }
    } catch (error) {
      showToast.error('Failed to fetch organization data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationData?.id) return;

    showToast.loading('Updating organization data...');
    try {
      const token = getToken();
      if (!token) throw new Error('No token found');

      await profileService.partialUpdateOrganizationProfile(
        organizationData.id,
        formData,
        token
      );

      showToast.success('Organization data updated successfully');
      setIsEditing(false);
      fetchOrganizationData(); // Refresh data
    } catch (error) {
      showToast.error('Failed to update organization data');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-black rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-white">Organization Settings</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Organization Name</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg 
                  text-white disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg 
                  text-white disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Organization Address</label>
              <input
                type="text"
                name="organization_address"
                value={formData.organization_address || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg 
                  text-white disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Phone Number</label>
              <input
                type="tel"
                name="organization_phone"
                value={formData.organization_phone || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg 
                  text-white disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm text-gray-400">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg 
                  text-white disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                  transition-colors flex items-center gap-2"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}