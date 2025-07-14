import { ID, Query } from 'appwrite';
import db from './index';
import { Notification, CreateNotificationData } from '@/types/notification';

const DATABASE_ID = '679b031a001983d2ec66';
const NOTIFICATIONS_COLLECTION_ID = '6874b8bc00118bfbe390';

export const notificationService = {
  // Create a new notification
  async createNotification(data: CreateNotificationData): Promise<Notification> {
    try {
      const notification = await db.createDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        {
          type: data.type,
          title: data.title,
          isRead: false,
          isCreated: new Date().toISOString(),
          priority: data.priority || 'medium'
        }
      );
      return notification as unknown as Notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get all notifications (for admin)
  async getNotifications(limit = 50): Promise<Notification[]> {
    try {
      const response = await db.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.orderDesc('isCreated'),
          Query.limit(limit)
        ]
      );
      return response.documents as unknown as Notification[];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get unread notifications count
  async getUnreadCount(): Promise<number> {
    try {
      const response = await db.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.equal('isRead', false)
        ]
      );
      return response.total;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<void> {
    try {
      await db.updateDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        notificationId,
        {
          isRead: true
        }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Mark all notifications as read
  async markAllAsRead(): Promise<void> {
    try {
      const notifications = await this.getNotifications();
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      await Promise.all(
        unreadNotifications.map(notification => 
          this.markAsRead(notification.$id)
        )
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await db.deleteDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        notificationId
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Create order notification
  async createOrderNotification(orderId: string, orderNumber: string, customerName: string): Promise<Notification> {
    return this.createNotification({
      type: 'order',
      title: `New Order #${orderNumber} from ${customerName}`,
      priority: 'high'
    });
  },

  // Create product notification
  async createProductNotification(productId: string, productName: string, action: string): Promise<Notification> {
    return this.createNotification({
      type: 'product',
      title: `Product "${productName}" has been ${action}`,
      priority: 'medium'
    });
  }
}; 