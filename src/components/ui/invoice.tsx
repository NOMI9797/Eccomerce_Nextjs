import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiPrinter, FiX, FiCheck, FiUser, FiCreditCard, FiPackage } from 'react-icons/fi';
import Image from 'next/image';

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
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4 print:p-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] print:max-h-full print:shadow-none border border-gray-200 flex flex-col">
        {/* Invoice Header - Fixed */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200 p-6 flex justify-between items-start flex-shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <FiCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Order Confirmed
                </h1>
                <p className="text-gray-600 text-sm">Your order has been successfully placed</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Order ID: <span className="font-semibold text-gray-900">#{orderDetails.orderId}</span></p>
              <p className="text-sm text-gray-600">Date: <span className="font-semibold text-gray-900">{orderDetails.date}</span></p>
            </div>
          </div>
          
          <div className="flex gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FiPrinter className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              <FiDownload className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className="p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Invoice Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-8 space-y-8">
          {/* Customer Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Billing Information</h2>
              </div>
              <div className="space-y-3 text-gray-700">
                <p className="font-semibold text-lg text-gray-900">{customerDetails.firstName} {customerDetails.lastName}</p>
                <p className="text-gray-600">{customerDetails.email}</p>
                <p className="text-gray-600">{customerDetails.phone}</p>
                <div className="pt-3 border-t border-blue-200">
                  <p className="font-semibold text-gray-900 mb-2">Delivery Address:</p>
                  <p className="text-gray-600">{customerDetails.address.street}</p>
                  <p className="text-gray-600">{customerDetails.address.city}, {customerDetails.address.region}</p>
                  <p className="text-gray-600">{customerDetails.address.country}, {customerDetails.address.postalCode}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <FiCreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
              </div>
              <p className="text-gray-700 font-semibold text-lg">{orderDetails.paymentMethod}</p>
              <p className="text-sm text-gray-600 mt-2">
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
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-md">
                <FiPackage className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Order Items</h2>
            </div>
            
            <div className="border-2 border-gray-200 rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-bold text-gray-700">Item</th>
                      <th className="py-4 px-6 text-center text-sm font-bold text-gray-700">Quantity</th>
                      <th className="py-4 px-6 text-right text-sm font-bold text-gray-700">Price</th>
                      <th className="py-4 px-6 text-right text-sm font-bold text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orderDetails.items.map((item, index) => (
                      <tr key={index} className="text-gray-700 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            {item.image && (
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-gray-200">
                                <Image
                                  src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${item.image}/view?project=679b0257003b758db270`}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-gray-900 text-lg">{item.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                            {item.quantity}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right font-semibold text-gray-900">Rs {item.price.toFixed(2)}</td>
                        <td className="py-4 px-6 text-right font-bold text-gray-900 text-lg">Rs {(item.quantity * item.price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-8">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-8 border border-gray-200 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-700 text-lg">
                  <span className="font-semibold">Subtotal</span>
                  <span className="font-semibold">Rs {orderDetails.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700 text-lg">
                  <span className="font-semibold">Delivery Fee</span>
                  <span className="font-semibold">Rs {orderDetails.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold text-gray-900 pt-4 border-t-2 border-gray-300">
                  <span>Total</span>
                  <span className="text-blue-600">Rs {orderDetails.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thank You Note */}
          <div className="text-center py-8 border-t border-gray-200">
            <div className="max-w-lg mx-auto bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <FiCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Thank you for your order!</h3>
              <p className="text-gray-600 text-lg">
                We&apos;ll send you a confirmation email shortly with tracking information once your order is processed.
              </p>
            </div>
          </div>
          
          {/* Bottom padding for better scrolling */}
          <div className="pb-8"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default Invoice; 