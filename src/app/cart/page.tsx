"use client";

import { useCart } from '@/session/CartContext';
import { useOrders } from '@/app/hooks/useOrders';
import { useAuth } from '@/session/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowRight, FiPackage, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { createOrder } = useOrders();
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

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(56,189,248,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05),transparent_50%)]" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight 
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 container mx-auto py-32 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <motion.div 
              className="mb-8 relative"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <FiShoppingCart className="text-8xl text-cyan-400 mx-auto drop-shadow-[0_0_30px_rgba(34,211,238,0.5)]" />
              <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-3xl rounded-full" />
            </motion.div>
            
            <motion.h1 
              className="text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Your Cart is Empty
            </motion.h1>
            
            <motion.p 
              className="text-gray-400 mb-12 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover amazing products and start your shopping journey.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                onClick={() => router.push('/Products')}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 
                         text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] 
                         hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transform hover:scale-105 transition-all duration-300
                         border border-cyan-400/20 backdrop-blur-sm"
              >
                <FiShoppingBag className="mr-2" />
                Continue Shopping
                <FiArrowRight className="ml-2" />
              </Button>
            </motion.div>
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

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto py-12 px-4">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <FiPackage className="text-cyan-400" />
            <span>{cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart</span>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2 space-y-6">
            <AnimatePresence>
              {cart.items.map((item, index) => (
                <motion.div
                  key={item.productId}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
                  <div className="relative bg-black/40 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-6 
                                hover:border-cyan-400/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <div className="flex items-center gap-6">
                      {/* Product Image */}
                      <motion.div 
                        className="relative group-hover:scale-105 transition-transform duration-300"
                        whileHover={{ scale: 1.1 }}
                      >
                        <img
                          src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${item.image}/view?project=679b0257003b758db270`}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-xl border border-cyan-400/20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl text-white mb-2">{item.name}</h3>
                        <p className="text-cyan-400 text-lg font-bold">${item.price.toFixed(2)}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-4 mt-4">
                          <span className="text-gray-400">Quantity:</span>
                          <div className="flex items-center gap-2 bg-black/60 rounded-xl p-1 border border-cyan-500/20">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <FiMinus />
                            </motion.button>
                            
                            <span className="px-4 py-2 text-white font-semibold min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                              className="p-2 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                            >
                              <FiPlus />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Item Total & Remove */}
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white mb-4">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.productId)}
                          className="p-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 
                                   rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                        >
                          <FiTrash2 />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-50" />
            <div className="relative bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 h-fit
                          hover:shadow-[0_0_40px_rgba(147,51,234,0.3)] transition-all duration-500 sticky top-8">
              <h2 className="text-2xl font-bold text-white mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Order Summary
              </h2>
              
              <div className="space-y-6">
                {/* Summary Items */}
                <div className="space-y-4 pb-6 border-b border-gray-700/50">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-gray-300">
                      <span className="truncate pr-2">{item.name} x{item.quantity}</span>
                      <span className="text-cyan-400 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                {/* Totals */}
                <div className="space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white font-semibold">${cart.total.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-300">Shipping</span>
                    <span className="text-green-400 font-semibold">Free</span>
                  </div>
                  
                  <div className="border-t border-gray-700/50 pt-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span className="text-white">Total</span>
                      <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                        ${cart.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-6"
                >
                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 
                             hover:from-cyan-400 hover:via-purple-500 hover:to-pink-500 
                             text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] 
                             hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transform hover:scale-105 transition-all duration-300
                             border border-cyan-400/20 backdrop-blur-sm"
                  >
                    <FiArrowRight className="mr-2" />
                    Proceed to Checkout
                  </Button>
                </motion.div>
                
                {/* Continue Shopping */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => router.push('/Products')}
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:text-white 
                             hover:border-cyan-400/40 transition-all duration-300 py-3 rounded-xl"
                  >
                    <FiShoppingBag className="mr-2" />
                    Continue Shopping
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}