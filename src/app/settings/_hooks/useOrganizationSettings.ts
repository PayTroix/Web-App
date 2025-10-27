/**
 * useOrganizationSettings Hook
 * Manages organization settings data and operations
 */

'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { profileService } from '@/services/api';
import { getToken } from '@/utils/token';
import { showToast } from '@/utils/toast';
import type { OrganizationData, OrganizationFormData } from '../_types';

export function useOrganizationSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
  const [formData, setFormData] = useState<OrganizationFormData>({});
  const { isConnected } = useAccount();

  // Fetch organization data
  const fetchOrganizationData = async () => {
    try {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      const profiles = await profileService.listOrganizationProfiles(token);
      if (profiles.length > 0) {
        setOrganizationData(profiles[0]);
        setFormData(profiles[0]);
      }
    } catch (error) {
      showToast.error('Failed to fetch organization data');
      console.error('Error fetching organization data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizationData();
  }, [isConnected]);

  // Update form field
  const updateFormField = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Reset form to original data
  const resetForm = () => {
    if (organizationData) {
      setFormData(organizationData);
    }
  };

  // Submit organization updates
  const submitUpdate = async () => {
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
      await fetchOrganizationData(); // Refresh data
    } catch (error) {
      showToast.error('Failed to update organization data');
      console.error('Error updating organization:', error);
      throw error;
    }
  };

  return {
    isLoading,
    organizationData,
    formData,
    updateFormField,
    resetForm,
    submitUpdate,
  };
}
