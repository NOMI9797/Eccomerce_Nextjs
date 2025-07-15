export interface Notification {
  $id: string;
  type: 'order' | 'product' | 'system' | 'user' | 'payment' | 'shipping' | 'stock_alert';
  title: string;
  isRead: boolean;
  isCreated: string;
  priority: 'low' | 'medium' | 'high';
  userId?: string; // For customer-specific notifications
  orderId?: string; // For order-related notifications
  orderNumber?: string; // For displaying order number
  productId?: string; // For product-related notifications
  actionType?: 'view_order' | 'view_invoice' | 'view_product' | 'track_order' | 'manage_stock' | 'none'; // What happens when clicked
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    order: number;
    product: number;
    system: number;
    user: number;
    payment: number;
    shipping: number;
    stock_alert: number;
  };
}

export interface CreateNotificationData {
  type: Notification['type'];
  title: string;
  priority?: Notification['priority'];
  userId?: string;
  orderId?: string;
  orderNumber?: string;
  productId?: string;
  actionType?: Notification['actionType'];
} 