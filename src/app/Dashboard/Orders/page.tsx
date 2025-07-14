"use client";

import { useState } from 'react';
import { useOrders } from '@/app/hooks/useOrders';
import { Order, OrderItem } from '@/appwrite/db/orders';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiXCircle, 
  FiClock, 
  FiDollarSign, 
  FiUser, 
  FiCalendar,
  FiTrash2,
  FiEye,
  FiRefreshCw,
  FiFilter,
  FiDownload,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';

// Utility functions
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <FiClock className="text-yellow-600" />;
    case 'processing': return <FiRefreshCw className="text-blue-600" />;
    case 'shipped': return <FiTruck className="text-purple-600" />;
    case 'delivered': return <FiCheckCircle className="text-green-600" />;
    case 'cancelled': return <FiXCircle className="text-red-600" />;
    default: return <FiPackage className="text-gray-600" />;
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800';
    case 'pending': return 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800';
    case 'failed': return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800';
    default: return 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-800';
    case 'processing': return 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800';
    case 'shipped': return 'text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/50 border-purple-200 dark:border-purple-800';
    case 'delivered': return 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-800';
    case 'cancelled': return 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-800';
    default: return 'text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700';
  }
};

// ViewOrderModal Component
const ViewOrderModal = ({ order, onClose }: { order: Order | null; onClose: () => void }) => {
  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">View complete order information</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FiXCircle className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Number</p>
              <p className="text-lg font-mono text-gray-900 dark:text-white">{order.orderNumber}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</p>
              <p className="text-lg text-gray-900 dark:text-white">
                {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Status</p>
              <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiTruck className="text-blue-600 dark:text-blue-400" />
            Shipping Information
          </h3>
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiUser className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.shippingFirstName} {order.shippingLastName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customer Name</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.shippingEmail}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiPhone className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.shippingPhone}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-gray-500 dark:text-gray-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{order.shippingStreet}</p>
                    <p className="text-gray-900 dark:text-white">{order.shippingCity}, {order.shippingRegion} {order.shippingPostalCode}</p>
                    <p className="text-gray-900 dark:text-white">{order.shippingCountry}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Shipping Address</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiPackage className="text-blue-600 dark:text-blue-400" />
            Order Items
          </h3>
          <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {order.items.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600" 
                            />
                          )}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Product Item</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900 dark:text-white font-medium">${item.price.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900 dark:text-white">{item.quantity}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-900 dark:text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Total */}
            <div className="bg-gray-50 dark:bg-gray-600 px-6 py-4 border-t border-gray-200 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function OrdersPage() {
  const { orders, isLoading, updateOrderStatus, updatePaymentStatus, deleteOrder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const handleStatusChange = async (orderId: string, newStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: Order['paymentStatus']) => {
    try {
      await updatePaymentStatus.mutateAsync({ orderId, status: newStatus });
      toast.success('Payment status updated successfully');
    } catch (error) {
      console.error('Failed to update payment status:', error);
      toast.error('Failed to update payment status');
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder.mutateAsync(orderId);
        toast.success('Order deleted successfully');
      } catch (error) {
        console.error('Failed to delete order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  const handleExportOrders = () => {
    const exportData = orders.map(order => ({
      orderNumber: order.orderNumber,
      date: order.createdAt ? format(new Date(order.createdAt), 'yyyy-MM-dd') : 'N/A',
      customerName: `${order.shippingFirstName} ${order.shippingLastName}`,
      email: order.shippingEmail,
      total: order.total,
      status: order.status,
      paymentStatus: order.paymentStatus
    }));

    const csv = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    return matchesStatus && matchesPayment;
  });

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(order => order.status === 'pending').length,
      processing: orders.filter(order => order.status === 'processing').length,
      delivered: orders.filter(order => order.status === 'delivered').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading orders...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Order Management</h1>
            <p className="text-gray-600 dark:text-gray-400">Monitor and manage all customer orders</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Total Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm mt-2">
                  <span>All time</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending}</p>
                <div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 text-sm mt-2">
                  <span>Needs attention</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center">
                <FiClock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Processing Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Processing</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.processing}</p>
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm mt-2">
                  <span>In progress</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <FiRefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Delivered Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Delivered</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.delivered}</p>
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm mt-2">
                  <span>Completed</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${stats.totalRevenue.toFixed(0)}</p>
                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 text-sm mt-2">
                  <span>Total sales</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Export */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <FiFilter className="text-gray-500 dark:text-gray-400" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by payment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleExportOrders}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              Export Orders
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Table Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FiPackage className="text-blue-600 dark:text-blue-400" />
              Orders ({filteredOrders.length})
            </h2>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Order Number</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Date</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Customer</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Total Amount</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Payment</TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredOrders.map((order: Order, index) => (
                    <motion.tr
                      key={order.$id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <TableCell className="font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                            title="View order details"
                          >
                            <FiEye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </button>
                          <span className="font-medium text-gray-900 dark:text-white">{order.orderNumber}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <FiCalendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <FiUser className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{order.shippingFirstName} {order.shippingLastName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.shippingEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900 dark:text-white">
                        ${order.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            defaultValue={order.status}
                            onValueChange={(value) => handleStatusChange(order.$id!, value as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          defaultValue={order.paymentStatus}
                          onValueChange={(value) => handlePaymentStatusChange(order.$id!, value as Order['paymentStatus'])}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDeleteOrder(order.$id!)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                          title="Delete order"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FiPackage className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">No Orders Found</h3>
              <p className="text-gray-400 dark:text-gray-500">
                {orders.length > 0
                  ? 'No orders match the selected filters.'
                  : 'Orders will appear here once customers start placing them.'}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <ViewOrderModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}