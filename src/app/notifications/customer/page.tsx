"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/session/NotificationContext';
import { useAuth } from '@/session/AuthContext';
import { Notification } from '@/types/notification';
import { Button } from '@/components/ui/button';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { 
  FiBell, 
  FiCheck, 
  FiTrash2, 
  FiFilter, 
  FiRefreshCw, 
  FiPackage, 
  FiCreditCard, 
  FiTruck,
  FiChevronLeft,
  FiCheckSquare,
  FiSquare,
  FiAlertCircle,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiEye
} from 'react-icons/fi';
import Header from '@/components/Header';
import CustomerInvoiceModal from '@/components/ui/customer-invoice-modal';
import { ordersService, Order } from '@/appwrite/db/orders';

const CustomerNotificationsPage: React.FC = () => {
  const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useNotifications();
  const { isUserAdmin } = useAuth();
  const router = useRouter();
  
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'order' | 'payment'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Redirect admin users to admin page
  useEffect(() => {
    if (isUserAdmin) {
      router.push('/notifications/admin');
    }
  }, [isUserAdmin, router]);

  // Filter notifications for customer-specific content
  const filteredNotifications = notifications.filter(notification => {
    const matchesReadFilter = filter === 'all' || 
      (filter === 'read' && notification.isRead) || 
      (filter === 'unread' && !notification.isRead);
    
    const matchesTypeFilter = typeFilter === 'all' || 
      (typeFilter === 'order' && notification.type === 'order' && !notification.title.includes('Payment')) ||
      (typeFilter === 'payment' && notification.title.includes('Payment'));
    
    return matchesReadFilter && matchesTypeFilter;
  });

  const handleShowInvoice = async (orderId: string) => {
    try {
      const order = await ordersService.getOrder(orderId);
      setSelectedOrder(order);
      setIsInvoiceModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const getNotificationIcon = (notification: Notification) => {
    if (notification.title.includes('Payment')) {
      if (notification.title.includes('confirmed')) {
        return <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      } else if (notification.title.includes('failed')) {
        return <FiXCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      }
      return <FiCreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
    
    if (notification.title.includes('shipped')) {
      return <FiTruck className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    } else if (notification.title.includes('delivered')) {
      return <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
    } else if (notification.title.includes('placed successfully')) {
      return <FiCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
    
    return <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
  };

  const getStatusColor = (notification: Notification) => {
    if (notification.title.includes('Payment')) {
      if (notification.title.includes('confirmed')) return 'border-l-green-500';
      if (notification.title.includes('failed')) return 'border-l-red-500';
      return 'border-l-blue-500';
    }
    
    if (notification.title.includes('delivered')) return 'border-l-green-500';
    if (notification.title.includes('shipped')) return 'border-l-purple-500';
    if (notification.priority === 'high') return 'border-l-red-500';
    if (notification.priority === 'medium') return 'border-l-yellow-500';
    return 'border-l-blue-500';
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.$id));
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  const handleBulkMarkAsRead = async () => {
    try {
      await Promise.all(
        selectedNotifications.map(id => markAsRead(id))
      );
      setSelectedNotifications([]);
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedNotifications.length} notification(s)?`)) {
      try {
        await Promise.all(
          selectedNotifications.map(id => deleteNotification(id))
        );
        setSelectedNotifications([]);
      } catch (error) {
        console.error('Failed to delete notifications:', error);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL your notifications? This action cannot be undone.')) {
      try {
        await Promise.all(
          notifications.map(notification => deleteNotification(notification.$id))
        );
        setSelectedNotifications([]);
      } catch (error) {
        console.error('Failed to clear all notifications:', error);
      }
    }
  };

  const getStats = () => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const orderNotifications = notifications.filter(n => n.type === 'order' && !n.title.includes('Payment')).length;
    const paymentNotifications = notifications.filter(n => n.title.includes('Payment')).length;

    return { total, unread, orderNotifications, paymentNotifications };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-200 dark:border-blue-600 border-t-blue-600 dark:border-t-blue-400 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your notifications...</p>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <FiChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Notifications</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Stay updated on your orders and account activity</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Notifications</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                  </div>
                  <FiBell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.unread}</p>
                  </div>
                  <FiAlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Order Updates</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.orderNotifications}</p>
                  </div>
                  <FiPackage className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Payment Updates</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.paymentNotifications}</p>
                  </div>
                  <FiCreditCard className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters and Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <FiFilter className="text-gray-500 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
                </div>

                <Select value={filter} onValueChange={(value: 'all' | 'unread' | 'read') => setFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={typeFilter} onValueChange={(value: 'all' | 'order' | 'payment') => setTypeFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="order">Orders</SelectItem>
                    <SelectItem value="payment">Payments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchNotifications}
                  className="flex items-center gap-2"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Refresh
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  className="flex items-center gap-2"
                >
                  <FiCheck className="w-4 h-4" />
                  Mark All Read
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedNotifications.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4"
              >
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedNotifications.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkMarkAsRead}
                  className="flex items-center gap-2"
                >
                  <FiCheck className="w-4 h-4" />
                  Mark Read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/20"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </Button>
              </motion.div>
            )}
          </div>

          {/* Notifications List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            {/* List Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSelectAll}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0 ? (
                      <FiCheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <FiSquare className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Notifications ({filteredNotifications.length})
                  </h2>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <FiBell className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filter === 'unread' ? 'All caught up! No unread notifications.' : 
                     typeFilter !== 'all' ? `No ${typeFilter} notifications found.` :
                     'You have no notifications at the moment.'}
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.$id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4 ${getStatusColor(notification)} ${
                        !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => {
                        if (notification.orderId) {
                          handleShowInvoice(notification.orderId);
                        }
                        if (!notification.isRead) {
                          markAsRead(notification.$id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectNotification(notification.$id);
                          }}
                          className="mt-1 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                        >
                          {selectedNotifications.includes(notification.$id) ? (
                            <FiCheckSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <FiSquare className="w-4 h-4 text-gray-400" />
                          )}
                        </button>

                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full flex-shrink-0"></div>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <FiClock className="w-3 h-3" />
                              {format(new Date(notification.isCreated), 'MMM dd, yyyy - HH:mm')}
                            </p>
                            {notification.orderId && (
                              <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                <FiEye className="w-3 h-3" />
                                Click to view details
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.$id);
                              }}
                              className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 rounded transition-colors"
                              title="Mark as read"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.$id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Modal */}
        <CustomerInvoiceModal 
          order={selectedOrder}
          isOpen={isInvoiceModalOpen}
          onClose={() => {
            setIsInvoiceModalOpen(false);
            setSelectedOrder(null);
          }}
        />
      </div>
    </>
  );
};

export default CustomerNotificationsPage; 