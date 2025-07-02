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
  FiDownload
} from 'react-icons/fi';

// Utility functions
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
        className="bg-black/80 border border-cyan-500/30 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FiXCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-gray-400">Order Number</p>
            <p className="text-white font-mono">{order.orderNumber}</p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400">Date</p>
            <p className="text-white">
              {order.createdAt ? format(new Date(order.createdAt), 'PPP') : 'N/A'}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400">Status</p>
            <p className="text-white flex items-center gap-2">
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-400">Payment Status</p>
            <p className={`inline-flex px-3 py-1 rounded-full text-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </p>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Shipping Information</h3>
          <div className="grid grid-cols-2 gap-4 bg-white/5 rounded-xl p-4">
            <div className="space-y-2">
              <p className="text-gray-400">Name</p>
              <p className="text-white">{order.shippingFirstName} {order.shippingLastName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Email</p>
              <p className="text-white">{order.shippingEmail}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Phone</p>
              <p className="text-white">{order.shippingPhone}</p>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Address</p>
              <p className="text-white">
                {order.shippingStreet}<br />
                {order.shippingCity}, {order.shippingRegion} {order.shippingPostalCode}<br />
                {order.shippingCountry}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                )}
                <div className="flex-1">
                  <h4 className="text-white font-semibold">{item.name}</h4>
                  <p className="text-gray-400">Quantity: {item.quantity}</p>
                  <p className="text-cyan-400">${item.price.toFixed(2)} each</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <p className="text-lg text-white font-semibold">Total Amount</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ${order.total.toFixed(2)}
              </p>
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

        {/* Filters and Export */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px] bg-black/60 border-gray-600">
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

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[150px] bg-black/60 border-gray-600">
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
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
          >
            <FiDownload className="mr-2" />
            Export Orders
          </Button>
        </div>

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
                    {filteredOrders.map((order: Order, index) => (
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
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-gray-400 hover:text-cyan-400 transition-colors"
                            >
                              <FiEye />
                            </button>
                            {order.orderNumber}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="text-gray-500" />
                            {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
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
                            ${order.total.toFixed(2)}
                          </span>
                </TableCell>
                <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) => handleStatusChange(order.$id!, value as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')}
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

            {filteredOrders.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <FiPackage className="text-6xl text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">No Orders Found</h3>
                <p className="text-gray-500">
                  {orders.length > 0
                    ? 'No orders match the selected filters.'
                    : 'Orders will appear here once customers start placing them.'}
                </p>
              </motion.div>
            )}
          </div>
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