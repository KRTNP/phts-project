import { Request, Response } from 'express';
import { NotificationService } from '../services/notificationService.js';

export const getMyNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id ?? (req.user as any).userId;
    const notifications = await NotificationService.getMyNotifications(userId);
    const unreadCount = await NotificationService.getUnreadCount(userId);
    res.json({ success: true, data: { notifications, unreadCount } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const markRead = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id ?? (req.user as any).userId;
    const { id } = req.params;

    if (id === 'all') {
      await NotificationService.markAllAsRead(userId);
    } else {
      await NotificationService.markAsRead(Number(id), userId);
    }

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
