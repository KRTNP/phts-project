import { RowDataPacket } from 'mysql2/promise';
import { query } from '../config/database.js';

export class NotificationService {
  static async notifyUser(
    userId: number,
    title: string,
    message: string,
    link: string = '#',
    type: string = 'INFO',
  ) {
    await query(
      `INSERT INTO pts_notifications (user_id, title, message, link, type) VALUES (?, ?, ?, ?, ?)`,
      [userId, title, message, link, type],
    );
  }

  static async notifyRole(role: string, title: string, message: string, link: string = '#') {
    const users = await query<RowDataPacket[]>(
      'SELECT id FROM users WHERE role = ? AND is_active = 1',
      [role],
    );

    if (users.length > 0) {
      const values = users.map((u: any) => [u.id, title, message, link, 'INFO']);
      const placeholders = values.map(() => '(?, ?, ?, ?, ?)').join(', ');
      const flatValues = values.flat();

      await query(
        `INSERT INTO pts_notifications (user_id, title, message, link, type) VALUES ${placeholders}`,
        flatValues,
      );
    }
  }

  static async getMyNotifications(userId: number, limit = 20) {
    return query(
      `SELECT * FROM pts_notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?`,
      [userId, limit],
    );
  }

  static async getUnreadCount(userId: number) {
    const rows = await query<RowDataPacket[]>(
      `SELECT COUNT(*) as count FROM pts_notifications WHERE user_id = ? AND is_read = 0`,
      [userId],
    );
    return rows[0].count;
  }

  static async markAsRead(notificationId: number, userId: number) {
    await query(
      `UPDATE pts_notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
      [notificationId, userId],
    );
  }

  static async markAllAsRead(userId: number) {
    await query(`UPDATE pts_notifications SET is_read = 1 WHERE user_id = ?`, [userId]);
  }
}
