"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiCheck, 
  FiCreditCard, 
  FiPackage, 
  FiTruck, 
  FiEye, 
  FiFileText, 
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiUser,
  FiX
} from 'react-icons/fi';
import { Notification } from '@/types/notification';

interface RichNotificationProps {
  notification: Notification;
  onClose: () => void;
  onAction: (actionType: string, notification: Notification) => void;
}

const RichNotification: React.FC<RichNotificationProps> = ({ 
  notification, 
  onClose, 
  onAction 
}) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'payment':
        return <FiCreditCard className="w-6 h-6 text-green-500" />;
      case 'order':
        return <FiPackage className="w-6 h-6 text-blue-500" />;
      case 'shipping':
        return <FiTruck className="w-6 h-6 text-purple-500" />;
      default:
        return <FiCheck className="w-6 h-6 text-gray-500" />;
    }
  };

  const getActionButton = () => {
    switch (notification.actionType) {
      case 'view_order':
        return (
          <button
            onClick={() => onAction('view_order', notification)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <FiEye className="w-4 h-4" />
            View Order
          </button>
        );
      case 'view_invoice':
        return (
          <button
            onClick={() => onAction('view_invoice', notification)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            <FiFileText className="w-4 h-4" />
            View Invoice
          </button>
        );
      case 'track_order':
        return (
          <button
            onClick={() => onAction('track_order', notification)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <FiMapPin className="w-4 h-4" />
            Track Order
          </button>
        );
      default:
        return null;
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderPaymentNotification = () => (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
          {getNotificationIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {notification.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiDollarSign className="w-4 h-4" />
              <span>Payment processed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiCreditCard className="w-4 h-4" />
              <span>Card payment</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <FiClock className="w-4 h-4" />
            <span>{formatDate(notification.isCreated)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <FiCheck className="w-4 h-4" />
              <span>Payment processed successfully</span>
            </div>
            {getActionButton()}
          </div>
        </div>
      </div>
    </div>
  );

  const renderOrderNotification = () => (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
          {getNotificationIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {notification.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiPackage className="w-4 h-4" />
              <span>Order #{notification.orderNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiDollarSign className="w-4 h-4" />
              <span>Order confirmed</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <FiClock className="w-4 h-4" />
            <span>{formatDate(notification.isCreated)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
              <FiCheck className="w-4 h-4" />
              <span>Order confirmed and processing</span>
            </div>
            {getActionButton()}
          </div>
        </div>
      </div>
    </div>
  );

  const renderShippingNotification = () => (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
          {getNotificationIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {notification.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiPackage className="w-4 h-4" />
              <span>Order #{notification.orderNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiMapPin className="w-4 h-4" />
              <span>Order shipped</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <FiClock className="w-4 h-4" />
            <span>{formatDate(notification.isCreated)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
              <FiTruck className="w-4 h-4" />
              <span>Your order is on its way</span>
            </div>
            {getActionButton()}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDefaultNotification = () => (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          {getNotificationIcon()}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {notification.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <FiClock className="w-4 h-4" />
            <span>{formatDate(notification.isCreated)}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <FiUser className="w-4 h-4" />
              <span>System notification</span>
            </div>
            {getActionButton()}
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationContent = () => {
    switch (notification.type) {
      case 'payment':
        return renderPaymentNotification();
      case 'order':
        return renderOrderNotification();
      case 'shipping':
        return renderShippingNotification();
      default:
        return renderDefaultNotification();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md mx-auto"
    >
      {renderNotificationContent()}
    </motion.div>
  );
};

export default RichNotification; 