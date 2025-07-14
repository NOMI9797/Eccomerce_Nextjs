// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/session/AuthContext";
import { useCart } from "@/session/CartContext";
import { useNotifications } from "@/session/NotificationContext";
import { Button } from "./ui/button";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import ThemeToggle from "./ui/ThemeToggle";
import NotificationDropdown from "./ui/notification-dropdown";
import ToastContainer from "./ui/toast-container";
import CustomerInvoiceModal from "./ui/customer-invoice-modal";
import { ordersService, Order } from "@/appwrite/db/orders";

export default function Header() {
  const { user, logout, isUserAdmin } = useAuth();
  const { cart } = useCart();
  const { toasts, notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, removeToast } = useNotifications();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  const handleShowInvoice = async (orderId: string) => {
    try {
      const order = await ordersService.getOrder(orderId);
      setSelectedOrder(order);
      setIsInvoiceModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              KharedLo
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isSearchFocused ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400'}`} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {user ? (
              <>
                <Link href="/Homepage" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                  Home
                </Link>
                {isUserAdmin && (
                  <Link href="/Dashboard" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                    Dashboard
                  </Link>
                )}
                {user && (
                  <NotificationDropdown 
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onMarkAsRead={markAsRead}
                    onMarkAllAsRead={markAllAsRead}
                    onDeleteNotification={deleteNotification}
                    onNotificationClick={(notification) => {
                      // Handle different action types
                      if (notification.actionType === 'view_invoice' && notification.orderId) {
                        // Show invoice modal for customers
                        handleShowInvoice(notification.orderId);
                      } else if (notification.actionType === 'view_order' && notification.orderId) {
                        if (isUserAdmin) {
                          // Admin goes to dashboard
                          window.location.href = '/Dashboard?feature=Orders';
                        } else {
                          // Customer sees order details in modal
                          handleShowInvoice(notification.orderId);
                        }
                      } else if (notification.type === 'product' && isUserAdmin) {
                        window.location.href = '/Dashboard?feature=List Products';
                      }
                    }}
                  />
                )}
                <Link href="/cart" className="relative">
                    <Button 
                    variant="white" 
                      size="icon" 
                    className="relative"
                    >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                        <motion.span 
                        className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                        {cartItemsCount}
                        </motion.span>
                    )}
                  </Button>
                </Link>
                <Button
                  onClick={logout}
                  variant="subtle"
                  className="text-sm font-medium"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="white">
                  Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary">
                  Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden border-t border-gray-200 dark:border-gray-800 py-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col gap-4">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full h-10 pl-10 pr-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                <ThemeToggle />
              </div>

              {/* Mobile Navigation Links */}
              {user ? (
                <>
                  <Link href="/Homepage" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1">
                    Home
                  </Link>
                  {isUserAdmin && (
                    <Link href="/Dashboard" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-2 py-1">
                      Dashboard
                    </Link>
                  )}
                  <Link href="/cart" className="flex items-center justify-between px-2 py-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cart</span>
                    {cartItemsCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  <button
                    onClick={logout}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors px-2 py-1 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-2">
                  <Link href="/login">
                    <Button variant="white" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="primary" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      <CustomerInvoiceModal 
        order={selectedOrder}
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </motion.header>
  );
}
