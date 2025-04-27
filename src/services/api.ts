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

// Waitlist API service
export const waitlistService = {
  
  joinWaitlist: async (email: string) => {
    try {
      const response = await apiClient.post('/api/v1/waitlist/waitlist/', {
        email,
      });
      return response.data;
    } catch (error) {
      console.error('Error joining waitlist:', error);
      throw error;
    }
  },
};

export default apiClient; 