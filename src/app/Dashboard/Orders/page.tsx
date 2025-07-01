"use client";

import { useState } from 'react';
import { useOrders } from '@/app/hooks/useOrders';
import { Order } from '@/appwrite/db/orders';
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
  FiRefreshCw
} from 'react-icons/fi';

export default function OrdersPage() {
  const { orders, isLoading, updateOrderStatus, updatePaymentStatus, deleteOrder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FiClock className="text-yellow-400" />;
      case 'processing': return <FiRefreshCw className="text-blue-400" />;
      case 'shipped': return <FiTruck className="text-purple-400" />;
      case 'delivered': return <FiCheckCircle className="text-green-400" />;
      case 'cancelled': return <FiXCircle className="text-red-400" />;
      default: return <FiPackage className="text-gray-400" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(order => order.status === 'pending').length,
      processing: orders.filter(order => order.status === 'processing').length,
      delivered: orders.filter(order => order.status === 'delivered').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0)
    };
    return stats;
  };

  const stats = getOrderStats();

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(56,189,248,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-400 text-lg">Loading orders...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(56,189,248,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05),transparent_50%)]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10 container mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Order Management
          </h1>
          <p className="text-gray-400 text-lg">Monitor and manage all customer orders</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Total Orders */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 text-center">
              <FiPackage className="text-3xl text-cyan-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-gray-400 text-sm">Total Orders</div>
            </div>
          </motion.div>

          {/* Pending Orders */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-xl p-6 text-center">
              <FiClock className="text-3xl text-yellow-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
              <div className="text-gray-400 text-sm">Pending</div>
            </div>
          </motion.div>

          {/* Processing Orders */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-black/60 backdrop-blur-xl border border-blue-500/30 rounded-xl p-6 text-center">
              <FiRefreshCw className="text-3xl text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{stats.processing}</div>
              <div className="text-gray-400 text-sm">Processing</div>
            </div>
          </motion.div>

          {/* Delivered Orders */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-black/60 backdrop-blur-xl border border-green-500/30 rounded-xl p-6 text-center">
              <FiCheckCircle className="text-3xl text-green-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">{stats.delivered}</div>
              <div className="text-gray-400 text-sm">Delivered</div>
            </div>
          </motion.div>

          {/* Revenue */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 text-center">
              <FiDollarSign className="text-3xl text-purple-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-white">${stats.totalRevenue.toFixed(0)}</div>
              <div className="text-gray-400 text-sm">Revenue</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur opacity-50" />
          <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden
                        hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] transition-all duration-500">
            
            {/* Table Header */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-6 border-b border-gray-700/50">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FiPackage className="text-cyan-400" />
                Recent Orders
              </h2>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700/50 hover:bg-gray-800/20">
                    <TableHead className="text-cyan-400 font-semibold">Order Number</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Date</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Customer</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Total Amount</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Status</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Payment</TableHead>
                    <TableHead className="text-cyan-400 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {orders.map((order: Order, index) => (
                      <motion.tr
                        key={order.$id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-gray-700/30 hover:bg-gray-800/30 transition-colors group/row"
                      >
                        <TableCell className="text-white font-mono">
                          <div className="flex items-center gap-2">
                            <FiEye className="text-gray-400 group-hover/row:text-cyan-400 transition-colors" />
                            {order.orderNumber}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-gray-500" />
                            {format(new Date(order.createdAt || ''), 'MMM dd, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex items-center gap-2">
                            <FiUser className="text-gray-500" />
                            {order.userId}
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-bold">
                          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            ${order.totalAmount.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <Select
                              defaultValue={order.status}
                              onValueChange={(value) => handleStatusChange(order.$id!, value as Order['status'])}
                            >
                              <SelectTrigger className="w-[140px] bg-black/60 border-gray-600 text-white hover:border-cyan-400/40 transition-colors">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-black/90 backdrop-blur-xl border-gray-600">
                                <SelectItem value="pending" className="text-yellow-400">Pending</SelectItem>
                                <SelectItem value="processing" className="text-blue-400">Processing</SelectItem>
                                <SelectItem value="shipped" className="text-purple-400">Shipped</SelectItem>
                                <SelectItem value="delivered" className="text-green-400">Delivered</SelectItem>
                                <SelectItem value="cancelled" className="text-red-400">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            defaultValue={order.paymentStatus}
                            onValueChange={(value) => handlePaymentStatusChange(order.$id!, value as Order['paymentStatus'])}
                          >
                            <SelectTrigger className="w-[120px] bg-black/60 border-gray-600 text-white hover:border-cyan-400/40 transition-colors">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-black/90 backdrop-blur-xl border-gray-600">
                              <SelectItem value="pending" className="text-yellow-400">Pending</SelectItem>
                              <SelectItem value="paid" className="text-green-400">Paid</SelectItem>
                              <SelectItem value="failed" className="text-red-400">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteOrder(order.$id!)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 
                                     rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                          >
                            <FiTrash2 />
                          </motion.button>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>

            {orders.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <FiPackage className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Orders Found</h3>
                <p className="text-gray-500">Orders will appear here once customers start placing them.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}