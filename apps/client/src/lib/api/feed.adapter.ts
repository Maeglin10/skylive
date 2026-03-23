import { apiClient } from './client';
import { ContentItem, LiveSession } from './types';

export const feedAdapter = {
  getFeed: async (): Promise<{ content: ContentItem[], lives: LiveSession[] }> => {
    const response = await apiClient.get('/feed');
    return response.data;
  },

  getCreatorContent: async (username: string): Promise<ContentItem[]> => {
    const response = await apiClient.get(`/creators/${username}/content`);
    return response.data;
  },
};
