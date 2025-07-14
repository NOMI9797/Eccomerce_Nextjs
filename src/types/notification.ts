export interface Notification {
  $id: string;
  type: 'order' | 'product' | 'system' | 'user';
  title: string;
  isRead: boolean;
  isCreated: string;
  priority: 'low' | 'medium' | 'high';
  userId?: string; // For customer-specific notifications
  orderId?: string; // For order-related notifications
  orderNumber?: string; // For displaying order number
  actionType?: 'view_order' | 'view_invoice' | 'view_product' | 'none'; // What happens when clicked
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: {
    order: number;
    product: number;
    system: number;
    user: number;
  };
}

export interface CreateNotificationData {
  type: Notification['type'];
  title: string;
  priority?: Notification['priority'];
  userId?: string;
  orderId?: string;
  orderNumber?: string;
  actionType?: Notification['actionType'];
} 