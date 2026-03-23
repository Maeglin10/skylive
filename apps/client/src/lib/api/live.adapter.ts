import { apiClient } from './client';
import { LiveSession } from './types';

export const liveAdapter = {
  getSessions: async (status?: string): Promise<LiveSession[]> => {
    const response = await apiClient.get('/live/sessions', { params: { status } });
    return response.data;
  },

  getSession: async (id: string): Promise<LiveSession> => {
    const response = await apiClient.get(`/live/sessions/${id}`);
    return response.data;
  },

  createSession: async (data: { title: string, accessRule: string, price?: number }): Promise<LiveSession & { streamKey: string }> => {
    const response = await apiClient.post('/live/sessions', data);
    return response.data;
  },

  startLive: async (id: string): Promise<void> => {
    await apiClient.patch(`/live/sessions/${id}/start`);
  },

  endLive: async (id: string): Promise<void> => {
    await apiClient.patch(`/live/sessions/${id}/end`);
  },
};
