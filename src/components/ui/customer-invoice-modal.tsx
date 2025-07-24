"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPackage, FiCalendar, FiMapPin, FiCreditCard } from 'react-icons/fi';
import Image from 'next/image';
import { Order } from '@/appwrite/db/orders';
import { format } from 'date-fns';

interface CustomerInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomerInvoiceModal: React.FC<CustomerInvoiceModalProps> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'processing': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'shipped': return 'text-purple-700 bg-purple-100 border-purple-200';
      case 'delivered': return 'text-green-700 bg-green-100 border-green-200';
      case 'cancelled': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-700 bg-green-100 border-green-200';
      case 'pending': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'failed': return 'text-red-700 bg-red-100 border-red-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  return (
    <AnimatePresence>
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
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Order #{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Order Status */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Order Status</p>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payment Status</p>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <FiCalendar className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiCreditCard className="text-gray-500 dark:text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
                <p className="font-semibold text-gray-900 dark:text-white text-lg">Rs {order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FiMapPin className="text-blue-600 dark:text-blue-400" />
              Shipping Address
            </h3>
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <p className="font-medium text-gray-900 dark:text-white">{order.shippingFirstName} {order.shippingLastName}</p>
              <p className="text-gray-700 dark:text-gray-300 mt-1">{order.shippingStreet}</p>
              <p className="text-gray-700 dark:text-gray-300">{order.shippingCity}, {order.shippingRegion} {order.shippingPostalCode}</p>
              <p className="text-gray-700 dark:text-gray-300">{order.shippingCountry}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <FiPackage className="text-blue-600 dark:text-blue-400" />
              Items Ordered
            </h3>
            <div className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                  {item.image && (
                    <div className="w-16 h-16 relative">
                      <Image 
                        src={item.image.startsWith('http') ? item.image : `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${item.image}/view?project=679b0257003b758db270`}
                        alt={item.name} 
                        fill
                        className="object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                        onError={() => {
                          // Fallback is handled by the src prop
                        }}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">{item.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">Rs {(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rs {item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Rs {order.total.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CustomerInvoiceModal; 