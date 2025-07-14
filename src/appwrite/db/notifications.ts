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
          priority: data.priority || 'medium',
          userId: data.userId || '',
          orderId: data.orderId || '',
          orderNumber: data.orderNumber || '',
          actionType: data.actionType || 'none'
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

  // Get notifications for a specific user (for customers)
  async getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
    try {
      const response = await db.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('isCreated'),
          Query.limit(limit)
        ]
      );
      return response.documents as unknown as Notification[];
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  },

  // Get unread count for specific user
  async getUserUnreadCount(userId: string): Promise<number> {
    try {
      const response = await db.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.equal('isRead', false)
        ]
      );
      return response.total;
    } catch (error) {
      console.error('Error fetching user unread count:', error);
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

  // Create admin order notification
  async createOrderNotification(orderId: string, orderNumber: string, customerName: string): Promise<Notification> {
    return this.createNotification({
      type: 'order',
      title: `New Order #${orderNumber} from ${customerName}`,
      priority: 'high',
      orderId,
      orderNumber,
      actionType: 'view_order'
    });
  },

  // Create customer order placed notification
  async createCustomerOrderNotification(userId: string, orderId: string, orderNumber: string): Promise<Notification> {
    return this.createNotification({
      type: 'order',
      title: `Order #${orderNumber} placed successfully!`,
      priority: 'high',
      userId,
      orderId,
      orderNumber,
      actionType: 'view_invoice'
    });
  },

  // Create customer order status update notification
  async createOrderStatusNotification(userId: string, orderId: string, orderNumber: string, newStatus: string): Promise<Notification> {
    const statusMessages = {
      'processing': 'is being prepared',
      'shipped': 'has been shipped',
      'delivered': 'has been delivered',
      'cancelled': 'has been cancelled'
    };
    
    return this.createNotification({
      type: 'order',
      title: `Order #${orderNumber} ${statusMessages[newStatus as keyof typeof statusMessages] || `status updated to ${newStatus}`}`,
      priority: newStatus === 'delivered' ? 'high' : 'medium',
      userId,
      orderId,
      orderNumber,
      actionType: 'view_order'
    });
  },

  // Create customer payment status notification
  async createPaymentStatusNotification(userId: string, orderId: string, orderNumber: string, paymentStatus: string): Promise<Notification> {
    const statusMessages = {
      'paid': 'Payment confirmed',
      'failed': 'Payment failed',
      'pending': 'Payment is pending'
    };

    return this.createNotification({
      type: 'order',
      title: `${statusMessages[paymentStatus as keyof typeof statusMessages] || 'Payment status updated'} for Order #${orderNumber}`,
      priority: paymentStatus === 'failed' ? 'high' : 'medium',
      userId,
      orderId,
      orderNumber,
      actionType: 'view_order'
    });
  },

  // Create comprehensive payment success notification for customer
  async createPaymentSuccessNotification(userId: string, orderId: string, orderNumber: string, paymentAmount: number, paymentMethod: string): Promise<Notification> {
    return this.createNotification({
      type: 'payment',
      title: `Payment Successful - Order #${orderNumber}`,
      priority: 'high',
      userId,
      orderId,
      orderNumber,
      actionType: 'view_invoice',
      metadata: {
        paymentAmount,
        paymentMethod,
        timestamp: new Date().toISOString()
      }
    });
  },

  // Create payment success notification for admin
  async createAdminPaymentNotification(orderId: string, orderNumber: string, customerName: string, paymentAmount: number, paymentMethod: string): Promise<Notification> {
    return this.createNotification({
      type: 'payment',
      title: `Payment Received - Order #${orderNumber}`,
      priority: 'high',
      orderId,
      orderNumber,
      actionType: 'view_order',
      metadata: {
        customerName,
        paymentAmount,
        paymentMethod,
        timestamp: new Date().toISOString()
      }
    });
  },

  // Create order confirmation notification for customer
  async createOrderConfirmationNotification(userId: string, orderId: string, orderNumber: string, totalAmount: number, estimatedDelivery: string): Promise<Notification> {
    return this.createNotification({
      type: 'order',
      title: `Order Confirmed - #${orderNumber}`,
      priority: 'high',
      userId,
      orderId,
      orderNumber,
      actionType: 'view_order',
      metadata: {
        totalAmount,
        estimatedDelivery,
        timestamp: new Date().toISOString()
      }
    });
  },

  // Create shipping notification for customer
  async createShippingNotification(userId: string, orderId: string, orderNumber: string, trackingNumber?: string): Promise<Notification> {
    return this.createNotification({
      type: 'shipping',
      title: `Order Shipped - #${orderNumber}`,
      priority: 'medium',
      userId,
      orderId,
      orderNumber,
      actionType: 'track_order',
      metadata: {
        trackingNumber,
        timestamp: new Date().toISOString()
      }
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