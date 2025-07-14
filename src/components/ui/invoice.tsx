import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiPrinter, FiX, FiCheck, FiUser, FiCreditCard, FiPackage } from 'react-icons/fi';

interface InvoiceProps {
  orderDetails: {
    orderId: string;
    date: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
    subtotal: number;
    deliveryFee: number;
    total: number;
    paymentMethod: string;
  };
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      region: string;
      country: string;
      postalCode: string;
    };
  };
  onClose: () => void;
}

const Invoice: React.FC<InvoiceProps> = ({ orderDetails, customerDetails, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    window.print(); // For now, we'll use print to PDF. Later we can implement proper PDF generation
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl overflow-y-auto max-h-[90vh] print:max-h-full print:shadow-none">
        {/* Invoice Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white print:text-black">
                  Order Confirmed
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Your order has been successfully placed</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Order ID: <span className="font-medium text-gray-900">#{orderDetails.orderId}</span></p>
              <p className="text-sm text-gray-500">Date: <span className="font-medium text-gray-900">{orderDetails.date}</span></p>
            </div>
          </div>
          
          <div className="flex gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <FiPrinter className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-6 space-y-8">
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 print:text-black">Billing Information</h2>
              </div>
              <div className="space-y-2 text-gray-700 print:text-gray-700">
                <p className="font-medium text-gray-900">{customerDetails.firstName} {customerDetails.lastName}</p>
                <p>{customerDetails.email}</p>
                <p>{customerDetails.phone}</p>
                <div className="pt-2 border-t border-gray-200">
                  <p className="font-medium text-gray-900 mb-1">Delivery Address:</p>
                  <p>{customerDetails.address.street}</p>
                  <p>{customerDetails.address.city}, {customerDetails.address.region}</p>
                  <p>{customerDetails.address.country}, {customerDetails.address.postalCode}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCreditCard className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 print:text-black">Payment Method</h2>
              </div>
              <p className="text-gray-700 print:text-gray-700 font-medium">{orderDetails.paymentMethod}</p>
              <p className="text-sm text-gray-500 mt-2">
                {orderDetails.paymentMethod === 'Cash on Delivery' ? 
                  'Payment will be collected upon delivery' : 
                  'Payment processed successfully'
                }
              </p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <FiPackage className="w-4 h-4 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 print:text-black">Order Items</h2>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 print:text-gray-700">Item</th>
                      <th className="py-3 px-4 text-center text-sm font-medium text-gray-700 print:text-gray-700">Quantity</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-700 print:text-gray-700">Price</th>
                      <th className="py-3 px-4 text-right text-sm font-medium text-gray-700 print:text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderDetails.items.map((item, index) => (
                      <tr key={index} className="text-gray-700 print:text-gray-700">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${item.image}/view?project=679b0257003b758db270`}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-medium">${item.price.toFixed(2)}</td>
                        <td className="py-4 px-4 text-right font-semibold text-gray-900">${(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>${orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span>${orderDetails.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-semibold text-gray-900 pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>${orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You Note */}
          <div className="text-center py-6 border-t border-gray-200">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you for your order!</h3>
              <p className="text-gray-600 text-sm">
                We'll send you a confirmation email shortly with tracking information once your order is processed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Invoice; 