"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import type { Notification } from '@/types/notification';
import { notificationService } from '@/appwrite/db/notifications';
import { ToastProps } from '@/components/ui/toast';
import { useAuth } from './AuthContext';
import { createRealtimeSubscription } from '@/appwrite/client';
import { notificationPerformanceMonitor } from '@/lib/notification-performance';

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

  // Stable user ID reference
  const userId = useMemo(() => user?.$id, [user?.$id]);

  // Request notification permissions for admin users
  useEffect(() => {
    if (isUserAdmin && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, [isUserAdmin]);

  // Memoized fetch notifications function
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
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
          notificationService.getUserNotifications(userId),
          notificationService.getUserUnreadCount(userId)
        ]);
      }
      
      setNotifications(notificationsList);
      setUnreadCount(unreadCountData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, isUserAdmin]);

  // Memoized mark as read function
  const markAsRead = useCallback(async (id: string) => {
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
  }, []);

  // Memoized mark all as read function
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // Memoized delete notification function
  const deleteNotification = useCallback(async (id: string) => {
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
  }, [notifications]);

  // Memoized create order notification function
  const createOrderNotification = useCallback(async (orderId: string, orderNumber: string, customerName: string) => {
    try {
      const notification = await notificationService.createOrderNotification(orderId, orderNumber, customerName);
      // The real-time listener will handle adding this to the state
      
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
  }, []);

  // Memoized toast functions
  const showToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: removeToast
    };
    
    setToasts(prev => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Real-time subscription setup - only depends on stable userId and isUserAdmin
  useEffect(() => {
    if (!userId) return;

    let cleanup: (() => void) | undefined;

    const setupRealTimeSubscription = async () => {
      try {
        // Initial fetch
        await fetchNotifications();

        // Set up real-time subscription
        cleanup = createRealtimeSubscription(
          `databases.679b031a001983d2ec66.collections.6874b8bc00118bfbe390.documents`,
          (response) => {
            const startTime = Date.now();
            const payload = response.payload as any;
            const notification = payload as Notification;

            // Track real-time event performance
            const responseTime = Date.now() - startTime;
            notificationPerformanceMonitor.trackRealtimeEvent(responseTime);

            // Handle different event types
            switch (response.events[0]) {
              case 'databases.679b031a001983d2ec66.collections.6874b8bc00118bfbe390.documents.*.create':
                // New notification created
                const shouldShowToUser = isUserAdmin || notification.userId === userId;
                
                if (shouldShowToUser) {
                  setNotifications(prev => [notification, ...prev]);
                  if (!notification.isRead) {
                    setUnreadCount(prev => prev + 1);
                  }
                  
                  // Enhanced toast notifications for admin users
                  if (isUserAdmin) {
                    // Admin sees clean, minimal toast notifications
                    let toastMessage = '';
                    let toastTitle = '';
                    let toastType: 'info' | 'success' | 'warning' | 'error' = 'info';
                    
                    // Create minimal, professional toast messages
                    if (notification.type === 'order') {
                      if (notification.title.includes('New Order')) {
                        toastTitle = 'New Order';
                        toastMessage = 'Order received';
                        toastType = 'success';
                      } else if (notification.title.includes('shipped')) {
                        toastTitle = 'Order Shipped';
                        toastMessage = 'Package dispatched';
                        toastType = 'info';
                      } else if (notification.title.includes('delivered')) {
                        toastTitle = 'Order Delivered';
                        toastMessage = 'Successfully delivered';
                        toastType = 'success';
                      } else {
                        toastTitle = 'Order Update';
                        toastMessage = 'Status changed';
                        toastType = 'info';
                      }
                    } else if (notification.type === 'payment') {
                      toastTitle = 'Payment';
                      toastMessage = 'Payment received';
                      toastType = 'success';
                    } else if (notification.priority === 'high') {
                      toastTitle = 'Alert';
                      toastMessage = 'Requires attention';
                      toastType = 'warning';
                    } else {
                      toastTitle = 'Update';
                      toastMessage = 'New notification';
                      toastType = 'info';
                    }
                    
                    // Play notification sound for admin users
                    try {
                      // Create a short beep sound for admin notifications
                      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                      const oscillator = audioContext.createOscillator();
                      const gainNode = audioContext.createGain();
                      
                      oscillator.connect(gainNode);
                      gainNode.connect(audioContext.destination);
                      
                      oscillator.frequency.value = notification.priority === 'high' ? 800 : 600;
                      oscillator.type = 'sine';
                      
                      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                      
                      oscillator.start(audioContext.currentTime);
                      oscillator.stop(audioContext.currentTime + 0.2);
                    } catch (error) {
                      console.log('Could not play notification sound:', error);
                    }
                    
                    showToast({
                      type: toastType,
                      title: toastTitle,
                      message: toastMessage,
                      duration: 3000
                    });
                    
                    // Simple browser notification for admin users (minimal)
                    if ('Notification' in window && Notification.permission === 'granted') {
                      const browserNotification = new Notification(toastTitle, {
                        body: toastMessage,
                        icon: '/favicon.ico',
                        tag: notification.$id,
                        requireInteraction: false,
                        silent: true
                      });
                      
                      // Auto-close browser notification quickly
                      setTimeout(() => {
                        browserNotification.close();
                      }, 2000);
                    }
                  } else {
                    // Customer sees simple toast for their own notifications
                    let simpleTitle = 'Notification';
                    let simpleMessage = 'You have a new update';
                    
                    if (notification.title.includes('placed successfully')) {
                      simpleTitle = 'Order Placed';
                      simpleMessage = 'Successfully placed';
                    } else if (notification.title.includes('shipped')) {
                      simpleTitle = 'Order Shipped';
                      simpleMessage = 'Package dispatched';
                    } else if (notification.title.includes('delivered')) {
                      simpleTitle = 'Order Delivered';
                      simpleMessage = 'Successfully delivered';
                    } else if (notification.title.includes('Payment')) {
                      simpleTitle = 'Payment';
                      simpleMessage = 'Payment processed';
                    }
                    
                    showToast({
                      type: 'info',
                      title: simpleTitle,
                      message: simpleMessage,
                      duration: 3000
                    });
                  }
                }
                break;

              case 'databases.679b031a001983d2ec66.collections.6874b8bc00118bfbe390.documents.*.update':
                // Notification updated (e.g., marked as read)
                const shouldUpdateForUser = isUserAdmin || notification.userId === userId;
                
                if (shouldUpdateForUser) {
                  setNotifications(prev => 
                    prev.map(n => n.$id === notification.$id ? notification : n)
                  );
                  
                  // Update unread count if read status changed
                  if (notification.isRead) {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                  }
                }
                break;

              case 'databases.679b031a001983d2ec66.collections.6874b8bc00118bfbe390.documents.*.delete':
                // Notification deleted
                setNotifications(prev => prev.filter(n => n.$id !== notification.$id));
                
                // Update unread count if deleted notification was unread
                if (!notification.isRead) {
                  setUnreadCount(prev => Math.max(0, prev - 1));
                }
                break;
            }
          }
        );

        // Track successful connection
        notificationPerformanceMonitor.trackConnectionSuccess();
        console.log('Real-time notification subscription established');
      } catch (error) {
        console.error('Error setting up real-time subscription:', error);
        notificationPerformanceMonitor.trackConnectionError();
        
        // Fallback to polling if real-time fails
        const interval = setInterval(() => {
          fetchNotifications();
          notificationPerformanceMonitor.trackFallbackPoll();
        }, 60000); // Fallback poll every minute
        
        cleanup = () => clearInterval(interval);
      }
    };

    setupRealTimeSubscription();

    // Cleanup function
    return () => {
      if (cleanup) {
        cleanup();
        console.log('Real-time notification subscription closed');
      }
    };
  }, [userId, isUserAdmin]);

  // Memoized context value to prevent unnecessary re-renders
  const value = useMemo<NotificationContextType>(() => ({
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
  }), [
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
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 