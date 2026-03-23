export enum UserRole {
  CREATOR = 'CREATOR',
  SUBSCRIBER = 'SUBSCRIBER',
  VIEWER = 'VIEWER',
  ADMIN = 'ADMIN',
}

export interface UserProfile {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

export interface RegisterDto {
  email: string;
  password?: string;
  displayName?: string;
}

export interface LoginDto {
  email: string;
  password?: string;
}

export interface CreatorProfile {
  userId: string;
  username: string;
  bio?: string;
  subscriptionPrice: number;
  stripeAccountId?: string;
}

export interface ContentItem {
  id: string;
  creatorId: string;
  creatorName: string;
  type: 'IMAGE' | 'VIDEO' | 'POST';
  accessRule: 'FREE' | 'SUBSCRIPTION' | 'PPV';
  price?: number;
  thumbnailUrl?: string;
  title?: string;
  createdAt: string;
  isUnlocked: boolean;
}

export interface LiveSession {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  status: 'OFFLINE' | 'LIVE' | 'ENDED';
  hlsUrl?: string;
  viewerCount: number;
}
