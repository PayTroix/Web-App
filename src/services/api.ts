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

// Helper function to clear JWT token from headers
const clearAuthHeader = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

interface LoginResponse {
  user: UserData;
  refresh: string;
  access: string;
}

interface LoginRequest { 
  address: string;
  signature: string; 
}

interface UserData {
  id: number;
  username: string;
  wallet_address: string;
  user_type: string;
}

export interface Payroll {
  id: number;
  recipient: number;
  amount: string;
  description: string;
  date: string;
  status: string;
  batch_reference?: string;
}

interface Notification {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  user: number;
}

interface PatchedNotification {
  type?: string;
  message?: string;
  is_read?: boolean;
}

interface OrganizationProfile {
  id: number;
  name: string;
  email: string;
  user: UserData;
  organization_address: string;
  organization_phone?: string;
  website?: string;
  recipients: RecipientProfile[];
  created_at: string;
  updated_at: string;
}

export interface RecipientProfile {
  id: number;
  name: string;
  email: string;
  user?: UserData; 
  image?: string | null;
  recipient_ethereum_address: string;
  organization: number;
  phone_number: string;
  salary: number;
  position: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LeaveRequest {
  id: number;
  recipient: RecipientProfile;
  start_date: string;
  end_date: string;
  leave_type: 'sick' | 'vacation' | 'personal' | 'other';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
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
  recipient_ethereum_address: string;
  // organization: number;
}

interface WaitlistEntryData {
  email: string;
}

// Profile API services
export const profileService = {
  // Organization Profile Endpoints
  listOrganizationProfiles: async (token: string | null): Promise<OrganizationProfile[]> => {
    try {
      if (token) setAuthHeader(token);
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
  getOrganizationRecipients: async (token: string | null): Promise<OrganizationProfile> => {
    try {
      if (token) setAuthHeader(token);
      const response = await apiClient.get('/api/v1/profile/organization-profile/get_organization_recipients/');
      return response.data;
    } catch (error) {
      console.error('Error fetching organization recipients:', error);
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
  listWaitlistEntries: async (): Promise<WaitlistEntry[]> => {
    try {
      clearAuthHeader(); // Public endpoint
      const response = await apiClient.get('/api/v1/waitlist/waitlist/');
      return response.data;
    } catch (error) {
      console.error('Error fetching waitlist entries:', error);
      throw error;
    }
  },

  joinWaitlist: async (email: string): Promise<WaitlistEntry> => {
    try {
      clearAuthHeader(); // Public endpoint
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
  login: async (data: LoginRequest) => {
    try {
      clearAuthHeader(); // Login should not require auth
      const response = await apiClient.post('/api/v1/web3auth/login/', data);
      return response.data;
    } catch (error) {
      console.error('Error with Web3Auth login:', error);
      throw error;
    }
  },

  getNonce: async (address: string) => {
    try {
      clearAuthHeader(); // Getting nonce is public
      const response = await apiClient.get(`/api/v1/web3auth/nonce/${address}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting nonce:', error);
      throw error;
    }
  },

  verifyAddress: async (address: string) => {
    try {
      clearAuthHeader(); // Address verification is public
      const response = await apiClient.get(`/api/v1/web3auth/verify-address/${address}/`);
      return response.data;
    } catch (error) {
      console.error('Error verifying address:', error);
      throw error;
    }
  },

  getUser: async (token: string): Promise<UserData> => {
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

export const notificationsService = {
  // List all notifications
  listNotifications: async (token: string | null): Promise<Notification[]> => {
    try {
      if (token) setAuthHeader(token);
      const response = await apiClient.get('/api/v1/notifications/notifications/');
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Create a new notification
  createNotification: async (data: Omit<Notification, 'id' | 'is_read' | 'created_at' | 'user'>, token: string): Promise<Notification> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.post('/api/v1/notifications/notifications/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Retrieve a specific notification
  getNotification: async (id: number, token: string): Promise<Notification> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get(`/api/v1/notifications/notifications/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw error;
    }
  },

  // Update a notification
  updateNotification: async (id: number, data: Omit<Notification, 'id' | 'is_read' | 'created_at' | 'user'>, token: string): Promise<Notification> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.put(`/api/v1/notifications/notifications/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  },

  // Partially update a notification
  partialUpdateNotification: async (id: number, data: PatchedNotification, token: string): Promise<Notification> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.patch(`/api/v1/notifications/notifications/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error partially updating notification:', error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (id: number, token: string): Promise<void> => {
    try {
      setAuthHeader(token);
      await apiClient.delete(`/api/v1/notifications/notifications/${id}/`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },
};

export const payrollService = {
  createPayroll: async (data: Omit<Payroll, 'id'>, token: string): Promise<Payroll> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.post('/api/v1/payroll/payrolls/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating payroll:', error);
      throw error;
    }
  },

  updatePayrollStatus: async (id: number, status: string, token: string): Promise<Payroll> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.patch(`/api/v1/payroll/payrolls/${id}/`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating payroll status:', error);
      throw error;
    }
  },

  listPayrolls: async (token: string): Promise<Payroll[]> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get('/api/v1/payroll/payrolls/');
      return response.data;
    } catch (error) {
      console.error('Error listing payrolls:', error);
      throw error;
    }
  },

  getPayroll: async (id: number, token: string): Promise<Payroll> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get(`/api/v1/payroll/payrolls/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting payroll:', error);
      throw error;
    }
  },

  markAsPaid: async (id: number, token: string): Promise<Payroll> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.post(`/api/v1/payroll/payrolls/${id}/mark_as_paid/`);
      return response.data;
    } catch (error) {
      console.error('Error marking payroll as paid:', error);
      throw error;
    }
  },

  getPayrollSummary: async (token: string): Promise<PayrollSummary> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get('/api/v1/payroll/payrolls/summary/');
      return response.data;
    } catch (error) {
      console.error('Error getting payroll summary:', error);
      throw error;
    }
  },

  getMonthlyReport: async (token: string, year?: number): Promise<MonthlyReport> => {
    try {
      setAuthHeader(token);
      const url = year
        ? `/api/v1/payroll/payrolls/monthly_report/?year=${year}`
        : '/api/v1/payroll/payrolls/monthly_report/';
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error getting monthly report:', error);
      throw error;
    }
  }
};


// Add new leaveRequestService
export const leaveRequestService = {
  createLeaveRequest: async (data: Omit<LeaveRequest, 'id' | 'recipient' | 'created_at' | 'updated_at'>, token: string): Promise<LeaveRequest> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.post('/api/v1/leave_requests/leave_requests/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }
  },

  listLeaveRequests: async (token: string): Promise<LeaveRequest[]> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get('/api/v1/leave_requests/leave_requests/');
      return response.data;
    } catch (error) {
      console.error('Error listing leave requests:', error);
      throw error;
    }
  },

  getLeaveRequest: async (id: number, token: string): Promise<LeaveRequest> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get(`/api/v1/leave_requests/leave_requests/${id}/`);
      return response.data;
    } catch (error) {
      console.error('Error getting leave request:', error);
      throw error;
    }
  },

  updateLeaveRequest: async (id: number, data: Partial<LeaveRequest>, token: string): Promise<LeaveRequest> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.patch(`/api/v1/leave_requests/leave_requests/${id}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating leave request:', error);
      throw error;
    }
  },

  deleteLeaveRequest: async (id: number, token: string): Promise<void> => {
    try {
      setAuthHeader(token);
      await apiClient.delete(`/api/v1/leave_requests/leave_requests/${id}/`);
    } catch (error) {
      console.error('Error deleting leave request:', error);
      throw error;
    }
  },

  approveLeaveRequest: async (id: number, token: string): Promise<LeaveRequest> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.post(`/api/v1/leave_requests/leave_requests/${id}/approve_leave_request/`);
      return response.data;
    } catch (error) {
      console.error('Error approving leave request:', error);
      throw error;
    }
  },

  getUserLeaveRequests: async (usertype: string, token: string): Promise<LeaveRequest[]> => {
    try {
      setAuthHeader(token);
      const response = await apiClient.get(`/api/v1/leave_requests/leave_requests/get_leave_requests/?usertype=${usertype}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user leave requests:', error);
      throw error;
    }
  }
};

// Add new interfaces for Payroll responses
interface PayrollSummary {
  total_paid: number;
  total_pending: number;
  total_entries: number;
}

interface MonthlyReport {
  [month: number]: number;
}

export default apiClient;