import { ID, Query } from 'appwrite';
import db from './index';
import { Notification, CreateNotificationData } from '@/types/notification';
import { Product, getStockStatus } from '@/app/Dashboard/ListProduct/types/product';

const DATABASE_ID = '679b031a001983d2ec66';
const NOTIFICATIONS_COLLECTION_ID = '6874b8bc00118bfbe390';
const PRODUCTS_COLLECTION_ID = '67a2fec400214f3c891b';

// In-memory cache for notifications to reduce API calls
class NotificationCache {
  private cache = new Map<string, Notification[]>();
  private unreadCountCache = new Map<string, number>();
  private lastFetchTime = new Map<string, number>();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  private getCacheKey(userId?: string): string {
    return userId ? `user_${userId}` : 'all';
  }

  isValid(userId?: string): boolean {
    const key = this.getCacheKey(userId);
    const lastFetch = this.lastFetchTime.get(key);
    return lastFetch ? (Date.now() - lastFetch) < this.CACHE_DURATION : false;
  }

  get(userId?: string): Notification[] | null {
    const key = this.getCacheKey(userId);
    if (this.isValid(userId)) {
      return this.cache.get(key) || null;
    }
    return null;
  }

  set(notifications: Notification[], userId?: string): void {
    const key = this.getCacheKey(userId);
    this.cache.set(key, notifications);
    this.lastFetchTime.set(key, Date.now());
  }

  getUnreadCount(userId?: string): number | null {
    const key = this.getCacheKey(userId);
    if (this.isValid(userId)) {
      return this.unreadCountCache.get(key) || null;
    }
    return null;
  }

  setUnreadCount(count: number, userId?: string): void {
    const key = this.getCacheKey(userId);
    this.unreadCountCache.set(key, count);
  }

  invalidate(userId?: string): void {
    const key = this.getCacheKey(userId);
    this.cache.delete(key);
    this.unreadCountCache.delete(key);
    this.lastFetchTime.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.unreadCountCache.clear();
    this.lastFetchTime.clear();
  }
}

const notificationCache = new NotificationCache();

// Low Stock Alert Manager
class LowStockAlertManager {
  private alertedProducts = new Set<string>();
  private readonly CHECK_INTERVAL = 60000; // Check every minute
  private intervalId?: NodeJS.Timeout;

  // Check all products for low stock and create notifications
  async checkAndCreateLowStockAlerts(): Promise<void> {
    try {
      // Get all products with stock tracking enabled
      const response = await db.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [
          Query.equal('TrackStock', true),
          Query.limit(500)
        ]
      );

      const products = response.documents as Product[];
      const lowStockProducts: Product[] = [];

      for (const product of products) {
        const stockStatus = getStockStatus(product.Stock || 0, product.MinStock || 5);
        
        if (stockStatus === 'low_stock' || stockStatus === 'out_of_stock') {
          // Check if we haven't already alerted for this product
          if (!this.alertedProducts.has(product.$id)) {
            lowStockProducts.push(product);
            this.alertedProducts.add(product.$id);
          }
        } else {
          // Remove from alerted products if stock is restored
          this.alertedProducts.delete(product.$id);
        }
      }

      // Create notifications for low stock products
      for (const product of lowStockProducts) {
        await this.createLowStockNotification(product);
      }

    } catch (error) {
      console.error('Error checking low stock alerts:', error);
    }
  }

  // Create a low stock notification for a specific product
  private async createLowStockNotification(product: Product): Promise<void> {
    const stockStatus = getStockStatus(product.Stock || 0, product.MinStock || 5);
    
    let title = '';
    let priority: 'high' | 'medium' | 'low' = 'medium';
    
    if (stockStatus === 'out_of_stock') {
      title = `Out of Stock: ${product.Name}`;
      priority = 'high';
    } else if (stockStatus === 'low_stock') {
      title = `Low Stock Alert: ${product.Name}`;
      priority = 'high';
    }

    await notificationService.createNotification({
      type: 'stock_alert',
      title,
      priority,
      productId: product.$id,
      actionType: 'manage_stock'
    });
  }

  // Start monitoring low stock
  startMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.checkAndCreateLowStockAlerts();
    }, this.CHECK_INTERVAL);

    // Run initial check
    this.checkAndCreateLowStockAlerts();
  }

  // Stop monitoring
  stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  // Manual check for low stock
  async manualCheck(): Promise<Product[]> {
    try {
      const response = await db.listDocuments(
        DATABASE_ID,
        PRODUCTS_COLLECTION_ID,
        [
          Query.equal('TrackStock', true),
          Query.limit(500)
        ]
      );

      const products = response.documents as Product[];
      const lowStockProducts: Product[] = [];

      for (const product of products) {
        const stockStatus = getStockStatus(product.Stock || 0, product.MinStock || 5);
        
        if (stockStatus === 'low_stock' || stockStatus === 'out_of_stock') {
          lowStockProducts.push(product);
        }
      }

      return lowStockProducts;
    } catch (error) {
      console.error('Error in manual low stock check:', error);
      return [];
    }
  }
}

const lowStockAlertManager = new LowStockAlertManager();

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
          productId: data.productId || '',
          actionType: data.actionType || 'none'
        }
      );
      
      // Invalidate cache for affected users
      notificationCache.invalidate(data.userId);
      notificationCache.invalidate(); // Invalidate admin cache
      
      return notification as unknown as Notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get all notifications with caching (for admin)
  async getNotifications(userId?: string, limit = 50): Promise<Notification[]> {
    try {
      // Check cache first
      const cached = notificationCache.get(userId);
      if (cached) {
        return cached;
      }

      const queries = [Query.orderDesc('isCreated'), Query.limit(limit)];
      
      // If userId is provided, filter by user
      if (userId) {
        queries.unshift(Query.equal('userId', userId));
      }

      const response = await db.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        queries
      );
      
      const notifications = response.documents as unknown as Notification[];
      
      // Cache the result
      notificationCache.set(notifications, userId);
      
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Get notifications for a specific user with caching
  async getUserNotifications(userId: string, limit = 50): Promise<Notification[]> {
    try {
      // Check cache first
      const cached = notificationCache.get(userId);
      if (cached) {
        return cached;
      }

      const response = await db.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('isCreated'),
          Query.limit(limit)
        ]
      );
      
      const notifications = response.documents as unknown as Notification[];
      
      // Cache the result
      notificationCache.set(notifications, userId);
      
      return notifications;
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  },

  // Optimized method to get notifications and unread count in one call
  async getNotificationsWithCount(userId?: string, limit = 50): Promise<{ notifications: Notification[], unreadCount: number }> {
    try {
      // Check cache first
      const cachedNotifications = notificationCache.get(userId);
      const cachedUnreadCount = notificationCache.getUnreadCount(userId);
      
      if (cachedNotifications && cachedUnreadCount !== null) {
        return { notifications: cachedNotifications, unreadCount: cachedUnreadCount };
      }

      const queries = [Query.orderDesc('isCreated'), Query.limit(limit)];
      if (userId) {
        queries.unshift(Query.equal('userId', userId));
      }

      const response = await db.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        queries
      );
      
      const notifications = response.documents as unknown as Notification[];
      const unreadCount = notifications.filter(n => !n.isRead).length;
      
      // Cache the results
      notificationCache.set(notifications, userId);
      notificationCache.setUnreadCount(unreadCount, userId);
      
      return { notifications, unreadCount };
    } catch (error) {
      console.error('Error fetching notifications with count:', error);
      throw error;
    }
  },

  // Get unread count for specific user with caching
  async getUserUnreadCount(userId: string): Promise<number> {
    try {
      // Check cache first
      const cached = notificationCache.getUnreadCount(userId);
      if (cached !== null) {
        return cached;
      }

      const response = await db.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.equal('isRead', false),
          Query.limit(1000) // Reasonable limit for counting
        ]
      );
      
      const count = response.total;
      
      // Cache the result
      notificationCache.setUnreadCount(count, userId);
      
      return count;
    } catch (error) {
      console.error('Error fetching user unread count:', error);
      throw error;
    }
  },

  // Get unread notifications count with caching
  async getUnreadCount(): Promise<number> {
    try {
      // Check cache first
      const cached = notificationCache.getUnreadCount();
      if (cached !== null) {
        return cached;
      }

      const response = await db.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        [
          Query.equal('isRead', false),
          Query.limit(1000) // Reasonable limit for counting
        ]
      );
      
      const count = response.total;
      
      // Cache the result
      notificationCache.setUnreadCount(count);
      
      return count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      throw error;
    }
  },

  // Mark notification as read with cache invalidation
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
      
      // Invalidate relevant caches
      notificationCache.clear(); // Clear all caches since we don't know which user this belongs to
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Batch mark notifications as read - more efficient
  async markMultipleAsRead(notificationIds: string[]): Promise<void> {
    try {
      const promises = notificationIds.map(id => 
        db.updateDocument(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          id,
          { isRead: true }
        )
      );
      
      await Promise.all(promises);
      
      // Invalidate all caches
      notificationCache.clear();
    } catch (error) {
      console.error('Error marking multiple notifications as read:', error);
      throw error;
    }
  },

  // Optimized mark all notifications as read
  async markAllAsRead(userId?: string): Promise<void> {
    try {
      // Get unread notifications first
      const queries = [Query.equal('isRead', false), Query.limit(1000)];
      if (userId) {
        queries.unshift(Query.equal('userId', userId));
      }

      const response = await db.listDocuments(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        queries
      );
      
      const unreadNotifications = response.documents;
      
      if (unreadNotifications.length > 0) {
        // Batch update all unread notifications
        await this.markMultipleAsRead(unreadNotifications.map(n => n.$id));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  // Delete notification with cache invalidation
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await db.deleteDocument(
        DATABASE_ID,
        NOTIFICATIONS_COLLECTION_ID,
        notificationId
      );
      
      // Invalidate all caches
      notificationCache.clear();
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  // Batch delete notifications - more efficient
  async deleteMultipleNotifications(notificationIds: string[]): Promise<void> {
    try {
      const promises = notificationIds.map(id => 
        db.deleteDocument(
          DATABASE_ID,
          NOTIFICATIONS_COLLECTION_ID,
          id
        )
      );
      
      await Promise.all(promises);
      
      // Invalidate all caches
      notificationCache.clear();
    } catch (error) {
      console.error('Error deleting multiple notifications:', error);
      throw error;
    }
  },

  // Clear cache manually (useful for testing or force refresh)
  clearCache(): void {
    notificationCache.clear();
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
      actionType: 'view_invoice'
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
      actionType: 'view_order'
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
      actionType: 'view_order'
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
      actionType: 'track_order'
    });
  },

  // Create product notification
  async createProductNotification(productId: string, productName: string, action: string): Promise<Notification> {
    return this.createNotification({
      type: 'product',
      title: `Product "${productName}" has been ${action}`,
      priority: 'medium',
      productId,
      actionType: 'view_product'
    });
  },

  // Low Stock Alert Methods
  async createLowStockAlert(productId: string, productName: string, currentStock: number, minStock: number): Promise<Notification> {
    const isOutOfStock = currentStock <= 0;
    
    return this.createNotification({
      type: 'stock_alert',
      title: isOutOfStock 
        ? `Out of Stock: ${productName}` 
        : `Low Stock Alert: ${productName} (${currentStock} left)`,
      priority: 'high',
      productId,
      actionType: 'manage_stock'
    });
  },

  // Get low stock products
  async getLowStockProducts(): Promise<Product[]> {
    return lowStockAlertManager.manualCheck();
  },

  // Start low stock monitoring
  startLowStockMonitoring(): void {
    lowStockAlertManager.startMonitoring();
  },

  // Stop low stock monitoring
  stopLowStockMonitoring(): void {
    lowStockAlertManager.stopMonitoring();
  },

  // Manual low stock check
  async checkLowStock(): Promise<void> {
    await lowStockAlertManager.checkAndCreateLowStockAlerts();
  }
}; 