export interface Notification {
  $id: string;
  type: 'order' | 'product' | 'system' | 'user';
  title: string;
  isRead: boolean;
  isCreated: string;
  priority: 'low' | 'medium' | 'high';
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
} 