import { apiClient } from './client';

export const paymentsAdapter = {
  subscribe: async (creatorId: string): Promise<{ checkoutUrl: string }> => {
    const response = await apiClient.post(`/payments/subscribe/${creatorId}`);
    return response.data;
  },

  purchaseContent: async (contentId: string): Promise<{ clientSecret: string }> => {
    const response = await apiClient.post(`/payments/purchase/content/${contentId}`);
    return response.data;
  },

  purchaseLive: async (liveSessionId: string): Promise<{ clientSecret: string }> => {
    const response = await apiClient.post(`/payments/purchase/live/${liveSessionId}`);
    return response.data;
  },

  tip: async (creatorId: string, amount: number, message?: string): Promise<{ clientSecret: string }> => {
    const response = await apiClient.post(`/payments/tip/${creatorId}`, { amount, message });
    return response.data;
  },

  getPortal: async (): Promise<{ url: string }> => {
    const response = await apiClient.get('/payments/portal');
    return response.data;
  },
};
