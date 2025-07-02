import React from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiPrinter } from 'react-icons/fi';

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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 print:p-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-black/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl w-full max-w-4xl overflow-y-auto max-h-[90vh] print:max-h-full print:bg-white print:text-black">
        {/* Invoice Header */}
        <div className="border-b border-gray-700/50 p-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent print:text-black">
              Invoice
            </h1>
            <p className="text-gray-400 mt-2 print:text-gray-600">Order #{orderDetails.orderId}</p>
            <p className="text-gray-400 print:text-gray-600">{orderDetails.date}</p>
          </div>
          <div className="flex gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 
                       text-cyan-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]
                       flex items-center gap-2"
            >
              <FiPrinter className="w-5 h-5" />
              Print
            </button>
            <button
              onClick={handleDownload}
              className="p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 
                       text-purple-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]
                       flex items-center gap-2"
            >
              <FiDownload className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="p-8 space-y-8">
          {/* Customer Details */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 print:text-black">Bill To</h2>
              <div className="space-y-2 text-gray-300 print:text-gray-700">
                <p className="font-medium">{customerDetails.firstName} {customerDetails.lastName}</p>
                <p>{customerDetails.email}</p>
                <p>{customerDetails.phone}</p>
                <p>{customerDetails.address.street}</p>
                <p>{customerDetails.address.city}, {customerDetails.address.region}</p>
                <p>{customerDetails.address.country}, {customerDetails.address.postalCode}</p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-4 print:text-black">Payment Method</h2>
              <p className="text-gray-300 print:text-gray-700">{orderDetails.paymentMethod}</p>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-white mb-4 print:text-black">Order Items</h2>
            <div className="border border-gray-700/50 rounded-xl overflow-hidden print:border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-800/50 print:bg-gray-100">
                  <tr>
                    <th className="py-4 px-6 text-left text-gray-300 print:text-gray-700">Item</th>
                    <th className="py-4 px-6 text-left text-gray-300 print:text-gray-700">Quantity</th>
                    <th className="py-4 px-6 text-right text-gray-300 print:text-gray-700">Price</th>
                    <th className="py-4 px-6 text-right text-gray-300 print:text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/50 print:divide-gray-200">
                  {orderDetails.items.map((item, index) => (
                    <tr key={index} className="text-gray-300 print:text-gray-700">
                      <td className="py-4 px-6">{item.name}</td>
                      <td className="py-4 px-6">{item.quantity}</td>
                      <td className="py-4 px-6 text-right">${item.price.toFixed(2)}</td>
                      <td className="py-4 px-6 text-right">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 border-t border-gray-700/50 pt-8 print:border-gray-200">
            <div className="w-full max-w-xs ml-auto space-y-4">
              <div className="flex justify-between text-gray-300 print:text-gray-700">
                <span>Subtotal</span>
                <span>${orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300 print:text-gray-700">
                <span>Delivery Fee</span>
                <span>${orderDetails.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-semibold text-white print:text-black pt-4 border-t border-gray-700/50 print:border-gray-200">
                <span>Total</span>
                <span>${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Thank You Note */}
          <div className="mt-12 text-center text-gray-400 print:text-gray-600">
            <p>Thank you for shopping with us!</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Invoice; 