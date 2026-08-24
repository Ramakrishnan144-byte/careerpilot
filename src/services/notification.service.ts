import { db } from '@/lib/db';

export interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  category?: 'OPPORTUNITY' | 'DEADLINE' | 'APPLICATION' | 'INTERVIEW' | 'PLACEMENT_ALERT';
  level?: 'INFO' | 'REMINDER' | 'URGENT';
  actionUrl?: string;
}

export class NotificationService {
  public static async createNotification(input: CreateNotificationInput) {
    try {
      return await db.notification.create({
        data: {
          userId: input.userId,
          title: input.title,
          message: input.message,
          category: input.category || 'OPPORTUNITY',
          level: input.level || 'INFO',
          actionUrl: input.actionUrl,
          isRead: false,
        },
      });
    } catch (err) {
      console.error('Error creating in-app notification:', err);
      return null;
    }
  }

  public static async broadcastNotification(
    title: string,
    message: string,
    category: string = 'PLACEMENT_ALERT',
    level: string = 'INFO',
    targetRole?: string
  ) {
    try {
      const users = await db.user.findMany({
        where: targetRole ? { role: targetRole } : undefined,
        select: { id: true },
      });

      const records = users.map((u) => ({
        userId: u.id,
        title,
        message,
        category,
        level,
        isRead: false,
      }));

      await db.notification.createMany({
        data: records,
      });

      return { count: users.length };
    } catch (err) {
      console.error('Broadcast notification error:', err);
      return { count: 0 };
    }
  }

  public static async markAsRead(notificationId: string, userId: string) {
    return db.notification.updateMany({
      where: { id: notificationId, userId },
      data: { isRead: true },
    });
  }

  public static async markAllAsRead(userId: string) {
    return db.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });
  }
}
