"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '@/types/notification';
import { notificationService } from '@/appwrite/db/notifications';
import { ToastProps } from '@/components/ui/toast';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  // Notifications state
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Toast state
  toasts: ToastProps[];
  
  // Notification functions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  createOrderNotification: (orderId: string, orderNumber: string, customerName: string) => Promise<void>;
  
  // Toast functions
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void;
  removeToast: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user, isUserAdmin } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      let notificationsList: Notification[];
      let unreadCountData: number;

      if (isUserAdmin) {
        // Admin sees all notifications (no userId filter)
        [notificationsList, unreadCountData] = await Promise.all([
          notificationService.getNotifications(),
          notificationService.getUnreadCount()
        ]);
      } else {
        // Regular users see only their notifications
        [notificationsList, unreadCountData] = await Promise.all([
          notificationService.getUserNotifications(user.$id),
          notificationService.getUserUnreadCount(user.$id)
        ]);
      }
      
      setNotifications(notificationsList);
      setUnreadCount(unreadCountData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(notification => 
          notification.$id === id 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      const notification = notifications.find(n => n.$id === id);
      setNotifications(prev => prev.filter(n => n.$id !== id));
      
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Create order notification
  const createOrderNotification = async (orderId: string, orderNumber: string, customerName: string) => {
    try {
      const notification = await notificationService.createOrderNotification(orderId, orderNumber, customerName);
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      showToast({
        type: 'info',
        title: notification.title,
        message: `Order #${orderNumber} from ${customerName}`,
        duration: 8000
      });
    } catch (error) {
      console.error('Error creating order notification:', error);
    }
  };

  // Toast functions
  const showToast = (toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast
    };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Polling for new notifications (every 30 seconds)
  useEffect(() => {
    fetchNotifications();
    
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    toasts,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createOrderNotification,
    showToast,
    removeToast
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 