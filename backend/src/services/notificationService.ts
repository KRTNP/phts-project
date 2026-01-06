import { RowDataPacket } from 'mysql2/promise';
import { query } from '../config/database.js';

const DEFAULT_CHUNK_SIZE = 200; // avoid oversized packets on bulk inserts

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

  static async notifyRole(
    role: string,
    title: string,
    message: string,
    link: string = '#',
    chunkSize: number = DEFAULT_CHUNK_SIZE,
  ) {
    const users = await query<RowDataPacket[]>(
      'SELECT id FROM users WHERE role = ? AND is_active = 1',
      [role],
    );

    if (users.length > 0) {
      for (let i = 0; i < users.length; i += chunkSize) {
        const batch = users.slice(i, i + chunkSize).map((u: any) => [u.id, title, message, link, 'INFO']);
        const placeholders = batch.map(() => '(?, ?, ?, ?, ?)').join(', ');
        const flatValues = batch.flat();
        await query(
          `INSERT INTO pts_notifications (user_id, title, message, link, type) VALUES ${placeholders}`,
          flatValues,
        );
      }
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
