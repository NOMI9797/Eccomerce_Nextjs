"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/session/NotificationContext';
import { useAuth } from '@/session/AuthContext';
import { Notification } from '@/types/notification';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  FiUser, 
  FiSettings,
  FiChevronLeft,
  FiCheckSquare,
  FiSquare,
  FiAlertCircle,
  FiClock,
  FiTrendingUp
} from 'react-icons/fi';
import Header from '@/components/Header';
import AdminRoute from '@/components/AdminRoute';

const AdminNotificationsContent: React.FC = () => {
  const { notifications, isLoading, markAsRead, markAllAsRead, deleteNotification, fetchNotifications } = useNotifications();
  const { isUserAdmin } = useAuth();
  const router = useRouter();
  
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'order' | 'product' | 'system' | 'user'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Redirect non-admin users
  useEffect(() => {
    if (!isUserAdmin) {
      router.push('/notifications/customer');
    }
  }, [isUserAdmin, router]);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesReadFilter = filter === 'all' || 
      (filter === 'read' && notification.isRead) || 
      (filter === 'unread' && !notification.isRead);
    
    const matchesTypeFilter = typeFilter === 'all' || notification.type === typeFilter;
    const matchesPriorityFilter = priorityFilter === 'all' || notification.priority === priorityFilter;
    
    return matchesReadFilter && matchesTypeFilter && matchesPriorityFilter;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'user': return <FiUser className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'system': return <FiSettings className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case 'product': return <FiPackage className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      default: return <FiBell className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 dark:border-l-red-400';
      case 'medium': return 'border-l-yellow-500 dark:border-l-yellow-400';
      case 'low': return 'border-l-green-500 dark:border-l-green-400';
      default: return 'border-l-gray-300 dark:border-l-gray-600';
    }
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
    if (window.confirm('Are you sure you want to delete ALL notifications? This action cannot be undone.')) {
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
    const byType = {
      order: notifications.filter(n => n.type === 'order').length,
      product: notifications.filter(n => n.type === 'product').length,
      system: notifications.filter(n => n.type === 'system').length,
      user: notifications.filter(n => n.type === 'user').length,
    };
    const byPriority = {
      high: notifications.filter(n => n.priority === 'high').length,
      medium: notifications.filter(n => n.priority === 'medium').length,
      low: notifications.filter(n => n.priority === 'low').length,
    };

    return { total, unread, byType, byPriority };
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
            <p className="text-gray-600 dark:text-gray-400 text-lg">Loading notifications...</p>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Notifications</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all system and customer notifications</p>
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
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.byType.order}</p>
                  </div>
                  <FiPackage className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.byPriority.high}</p>
                  </div>
                  <FiTrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
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

                <Select value={typeFilter} onValueChange={(value: 'all' | 'order' | 'product' | 'system' | 'user') => setTypeFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="order">Orders</SelectItem>
                    <SelectItem value="product">Products</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={(value: 'all' | 'high' | 'medium' | 'low') => setPriorityFilter(value)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
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
                    Notifications ({filteredNotifications.length})
                  </h2>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <FiBell className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filter === 'unread' ? 'All caught up! No unread notifications.' : 
                     typeFilter !== 'all' ? `No ${typeFilter} notifications found.` :
                     'No notifications to display.'}
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
                      className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-l-4 ${getPriorityColor(notification.priority)} ${
                        !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => {
                        if (notification.actionType === 'view_order') {
                          window.location.href = '/Dashboard?feature=Orders';
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
                          {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </p>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full flex-shrink-0"></div>
                            )}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300' :
                              'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                            }`}>
                              {notification.priority}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <FiClock className="w-3 h-3" />
                              {format(new Date(notification.isCreated), 'MMM dd, yyyy - HH:mm')}
                            </p>
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
      </div>
    </>
  );
};

const AdminNotificationsPage: React.FC = () => {
  return (
    <AdminRoute>
      <AdminNotificationsContent />
    </AdminRoute>
  );
};

export default AdminNotificationsPage; 