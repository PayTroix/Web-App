import axios from 'axios';

// Base API URL for our backend service
const baseURL = 'https://backend-lk8r.onrender.com';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to set JWT token in headers
const setAuthHeader = (token: string) => {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Type definitions
interface OrganizationProfile {
  id: number;
  name: string;
  email: string;
  organization_address: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

interface RecipientProfile {
  id: number;
  name: string;
  email: string;
  wallet_address: string;
  organization: number;
  created_at: string;
  updated_at: string;
}

interface WaitlistEntry {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

interface OrganizationProfileData {
  name: string;
  email: string;
  organization_address: string;
  website?: string;
}

interface RecipientProfileData {
  name: string;
  email: string;
  wallet_address: string;
  organization: number;
}

interface WaitlistEntryData {
  email: string;
}

// Profile API services
export const profileService = {
  // Organization Profile Endpoints
  listOrganizationProfiles: async (token: string): Promise<OrganizationProfile[]> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get('/api/v1/profile/organization-profile/');
      return response.data;
    } catch (error) {
      console.error('Error fetching organization profiles:', error);
      throw error;
    }
  },

  createOrganizationProfile: async (data: OrganizationProfileData, token: string): Promise<OrganizationProfile> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.post('/api/v1/profile/organization-profile/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating organization profile:', error);
      throw error;
    }
  },

  getOrganizationProfile: async (id: number, token: string): Promise<OrganizationProfile> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get(`/api/v1/profile/organization-profile/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching organization profile:', error);
      throw error;
    }
  },

  updateOrganizationProfile: async (id: number, data: OrganizationProfileData, token: string): Promise<OrganizationProfile> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.put(`/api/v1/profile/organization-profile/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating organization profile:', error);
      throw error;
    }
  },

  partialUpdateOrganizationProfile: async (id: number, data: Partial<OrganizationProfileData>, token: string): Promise<OrganizationProfile> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.patch(`/api/v1/profile/organization-profile/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error partially updating organization profile:', error);
      throw error;
    }
  },

  deleteOrganizationProfile: async (id: number, token: string): Promise<void> => {
    try {
      setAuthHeader(token);
      await apiClient.delete(`/api/v1/profile/organization-profile/${id}/`);
    } catch (error) {
      console.error('Error deleting organization profile:', error);
      throw error;
    }
  },

  // Recipient Profile Endpoints
  listRecipientProfiles: async (token: string): Promise<RecipientProfile[]> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get('/api/v1/profile/recipient-profile/');
      return response.data;
    } catch (error) {
      console.error('Error fetching recipient profiles:', error);
      throw error;
    }
  },

  createRecipientProfile: async (data: RecipientProfileData, token: string): Promise<RecipientProfile> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.post('/api/v1/profile/recipient-profile/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating recipient profile:', error);
      throw error;
    }
  },

  getRecipientProfile: async (id: number, token: string): Promise<RecipientProfile> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get(`/api/v1/profile/recipient-profile/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recipient profile:', error);
      throw error;
    }
  },

  updateRecipientProfile: async (id: number, data: RecipientProfileData, token: string): Promise<RecipientProfile> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.put(`/api/v1/profile/recipient-profile/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating recipient profile:', error);
      throw error;
    }
  },

  partialUpdateRecipientProfile: async (id: number, data: Partial<RecipientProfileData>, token: string): Promise<RecipientProfile> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.patch(`/api/v1/profile/recipient-profile/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error partially updating recipient profile:', error);
      throw error;
    }
  },

  deleteRecipientProfile: async (id: number, token: string): Promise<void> => {
    try {
      setAuthHeader(token);
      await apiClient.delete(`/api/v1/profile/recipient-profile/${id}/`);
    } catch (error) {
      console.error('Error deleting recipient profile:', error);
      throw error;
    }
  },

  batchCreateRecipientProfiles: async (id: number, data: RecipientProfileData[], token: string): Promise<RecipientProfile[]> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.post(`/api/v1/profile/recipient-profile/${id}/batch_create/`, data);
      return response.data;
    } catch (error) {
      console.error('Error batch creating recipient profiles:', error);
      throw error;
    }
  },
};

// Waitlist API service
export const waitlistService = {
  listWaitlistEntries: async (token?: string): Promise<WaitlistEntry[]> => {
    try {
      if (token) setAuthHeader(token);
      const response = await apiClient.get('/api/v1/waitlist/waitlist/');
      return response.data;
    } catch (error) {
      console.error('Error fetching waitlist entries:', error);
      throw error;
    }
  },

  joinWaitlist: async (email: string, token?: string): Promise<WaitlistEntry> => {
    try {
      if (token) setAuthHeader(token);
      const response = await apiClient.post('/api/v1/waitlist/waitlist/', { email });
      return response.data;
    } catch (error) {
      console.error('Error joining waitlist:', error);
      throw error;
    }
  },

  getWaitlistEntry: async (id: number, token?: string): Promise<WaitlistEntry> => {
    try {
      if (token) setAuthHeader(token);
      const response = await apiClient.get(`/api/v1/waitlist/waitlist/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching waitlist entry:', error);
      throw error;
    }
  },

  updateWaitlistEntry: async (id: number, data: WaitlistEntryData, token?: string): Promise<WaitlistEntry> => {
    try {
      if (token) setAuthHeader(token);
      const response = await apiClient.put(`/api/v1/waitlist/waitlist/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating waitlist entry:', error);
      throw error;
    }
  },

  partialUpdateWaitlistEntry: async (id: number, data: Partial<WaitlistEntryData>, token?: string): Promise<WaitlistEntry> => {
    try {
      if (token) setAuthHeader(token);
      const response = await apiClient.patch(`/api/v1/waitlist/waitlist/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error partially updating waitlist entry:', error);
      throw error;
    }
  },

  deleteWaitlistEntry: async (id: number, token?: string): Promise<void> => {
    try {
      if (token) setAuthHeader(token);
      await apiClient.delete(`/api/v1/waitlist/waitlist/${id}/`);
    } catch (error) {
      console.error('Error deleting waitlist entry:', error);
      throw error;
    }
  },
};

// Web3Auth API service
export const web3AuthService = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login: async (data: any, token?: string) => {
    try {
      if (token) setAuthHeader(token);
      const response = await apiClient.post('/api/v1/web3auth/login/', data);
      return response.data;
    } catch (error) {
      console.error('Error with Web3Auth login:', error);
      throw error;
    }
  },

  getNonce: async (address: string, token?: string) => {
    try {
      if (token) setAuthHeader(token);
      const response = await apiClient.get(`/api/v1/web3auth/nonce/${address}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting nonce:', error);
      throw error;
    }
  },

  verifyAddress: async (address: string, token?: string) => {
    try {
      if (token) setAuthHeader(token);
      const response = await apiClient.get(`/api/v1/web3auth/verify-address/${address}/`);
      return response.data;
    } catch (error) {
      console.error('Error verifying address:', error);
      throw error;
    }
  },

  getUser: async (token: string) => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get('/api/v1/web3auth/user/');
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },
};

export default apiClient;