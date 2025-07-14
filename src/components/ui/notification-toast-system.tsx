"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import RichNotification from './rich-notification';
import { Notification } from '@/types/notification';
import { useRouter } from 'next/navigation';

interface NotificationToast extends Notification {
  id: string;
  autoClose?: boolean;
  duration?: number;
}

interface NotificationToastSystemProps {
  notifications: NotificationToast[];
  onNotificationClose: (id: string) => void;
  onNotificationAction: (actionType: string, notification: Notification) => void;
}

const NotificationToastSystem: React.FC<NotificationToastSystemProps> = ({
  notifications,
  onNotificationClose,
  onNotificationAction
}) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Auto-close notifications after specified duration
    notifications.forEach(notification => {
      if (notification.autoClose !== false) {
        const duration = notification.duration || 8000; // 8 seconds default
        const timer = setTimeout(() => {
          onNotificationClose(notification.id);
        }, duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, onNotificationClose]);

  const handleNotificationAction = (actionType: string, notification: Notification) => {
    // Handle different action types
    switch (actionType) {
      case 'view_order':
        router.push(`/Dashboard?feature=Orders`);
        break;
      case 'view_invoice':
        // This would typically open an invoice modal or page
        console.log('View invoice for order:', notification.orderNumber);
        break;
      case 'track_order':
        // This would typically open a tracking page
        console.log('Track order:', notification.orderNumber);
        break;
      default:
        break;
    }
    
    // Close the notification after action
    const notificationToast = notification as NotificationToast;
    onNotificationClose(notificationToast.id);
    
    // Call the parent handler
    onNotificationAction(actionType, notification);
  };

  if (!mounted) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-4 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3
            }}
            className="pointer-events-auto"
          >
            <RichNotification
              notification={notification}
              onClose={() => onNotificationClose(notification.id)}
              onAction={handleNotificationAction}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
};

// Hook for managing notification toasts
export const useNotificationToasts = () => {
  const [toasts, setToasts] = useState<NotificationToast[]>([]);

  const addToast = (notification: Omit<NotificationToast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: NotificationToast = {
      ...notification,
      id,
      autoClose: notification.autoClose !== false,
      duration: notification.duration || 8000
    };
    
    setToasts(prev => [...prev, newToast]);
    
    // Play notification sound for high priority notifications
    if (notification.priority === 'high') {
      playNotificationSound();
    }
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts
  };
};

// Notification sound utility
const playNotificationSound = () => {
  // Create a subtle notification sound
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};

// Pre-built notification creators for common scenarios
export const createPaymentSuccessToast = (
  orderNumber: string, 
  amount: number, 
  paymentMethod: string
): Omit<NotificationToast, 'id'> => ({
  $id: `payment-${Date.now()}`,
  type: 'payment',
  title: `Payment Successful - Order #${orderNumber}`,
  isRead: false,
  isCreated: new Date().toISOString(),
  priority: 'high',
  actionType: 'view_invoice',
  orderNumber,
  metadata: {
    paymentAmount: amount,
    paymentMethod,
    timestamp: new Date().toISOString()
  },
  duration: 10000, // 10 seconds for payment success
  autoClose: false // Don't auto-close payment notifications
});

export const createOrderConfirmationToast = (
  orderNumber: string, 
  totalAmount: number, 
  estimatedDelivery: string
): Omit<NotificationToast, 'id'> => ({
  $id: `order-${Date.now()}`,
  type: 'order',
  title: `Order Confirmed - #${orderNumber}`,
  isRead: false,
  isCreated: new Date().toISOString(),
  priority: 'high',
  actionType: 'view_order',
  orderNumber,
  metadata: {
    totalAmount,
    estimatedDelivery,
    timestamp: new Date().toISOString()
  },
  duration: 8000,
  autoClose: false
});

export const createShippingToast = (
  orderNumber: string, 
  trackingNumber?: string
): Omit<NotificationToast, 'id'> => ({
  $id: `shipping-${Date.now()}`,
  type: 'shipping',
  title: `Order Shipped - #${orderNumber}`,
  isRead: false,
  isCreated: new Date().toISOString(),
  priority: 'medium',
  actionType: 'track_order',
  orderNumber,
  metadata: {
    trackingNumber,
    timestamp: new Date().toISOString()
  },
  duration: 8000,
  autoClose: true
});

export default NotificationToastSystem; 