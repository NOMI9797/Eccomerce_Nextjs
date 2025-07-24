"use client";

import { useCart } from '@/session/CartContext';
import { useAuth } from '@/session/AuthContext';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiPackage, FiShoppingBag, FiChevronLeft, FiShield, FiCheckCircle } from 'react-icons/fi';
import Link from 'next/link';
import { getStorageFileUrl, isCompleteUrl } from '@/lib/appwrite-utils';
import Image from 'next/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout');
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  const subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const total = subtotal + shipping;

  if (cart.items.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiShoppingCart className="w-16 h-16 text-amber-500 dark:text-amber-400" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-md mx-auto leading-relaxed">
                Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
              </p>
              <Link href="/Products">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <FiShoppingBag className="w-5 h-5" />
                    Continue Shopping
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
        {/* Enhanced Header Section */}
        <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <Link 
                href="/Products" 
                className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <FiChevronLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </nav>

            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  Shopping Cart
                </h1>
                <div className="text-lg text-gray-600 dark:text-gray-400 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <FiPackage className="w-4 h-4 text-white" />
                  </div>
                  <span>{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</span>
                </div>
              </div>
              <div className="hidden sm:block">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={() => router.push('/Products')}
                    variant="outline"
                    className="inline-flex items-center gap-3 border-amber-300 text-amber-600 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/20 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    <FiShoppingBag className="w-5 h-5" />
                    Continue Shopping
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Cart Items</h2>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  <AnimatePresence>
                    {cart.items.map((item) => (
                      <motion.div
                        key={item.productId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-8 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-300"
                      >
                        <div className="flex items-center space-x-6">
                          {/* Product Image */}
                          <div className="flex-shrink-0 w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden relative shadow-md">
                            <Image
                              src={item.image ? 
                                (isCompleteUrl(item.image) ? item.image : getStorageFileUrl(item.image)) :
                                "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                              onError={() => {
                                // Fallback is handled by the src prop
                              }}
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {item.name}
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                              Rs {item.price.toFixed(2)} each
                            </p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <span className="w-12 text-center text-lg font-bold text-gray-900 dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                            >
                              <FiPlus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              Rs {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeFromCart(item.productId)}
                            className="p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Order Summary</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg text-gray-600 dark:text-gray-400">Subtotal ({cart.items.length} items)</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Rs {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Rs {shipping.toFixed(2)}</span>
                  </div>
                  
                  <hr className="border-gray-200 dark:border-gray-700" />
                  
                  <div className="flex justify-between items-center py-4">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">Rs {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={handleCheckout}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-3 text-lg"
                    >
                      Proceed to Checkout
                      <FiArrowRight className="w-5 h-5" />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      onClick={clearCart}
                      variant="outline"
                      className="w-full border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold py-4 px-6 rounded-xl transition-all duration-300 text-lg"
                    >
                      Clear Cart
                    </Button>
                  </motion.div>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <FiShield className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium">Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <FiCheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="font-medium">30-Day Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}