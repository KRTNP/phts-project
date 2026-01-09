import { apiClient } from '@/lib/axios';

export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  link?: string | null;
  type?: string;
  is_read?: number;
  created_at?: string;
}

interface NotificationResponse {
  success: boolean;
  data?: {
    notifications: NotificationItem[];
    unreadCount: number;
  };
  error?: string;
}

export async function getMyNotifications(): Promise<NotificationResponse> {
  const response = await apiClient.get<NotificationResponse>('/api/notifications');
  return response.data;
}

export async function markNotificationRead(id: number | 'all'): Promise<void> {
  await apiClient.put(`/api/notifications/${id}/read`);
}
