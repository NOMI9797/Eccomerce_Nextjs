// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/session/AuthContext";
import { useCart } from "@/session/CartContext";
import { useNotifications } from "@/session/NotificationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiShoppingCart, FiUser, FiLogOut, FiSettings, FiSearch, FiMenu, FiX, FiHome } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
      const response = await ordersService.getOrders();
      const order = response.documents.find((o: Order) => o.$id === orderId);
      if (order) {
        setSelectedOrder(order);
        setIsInvoiceModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    }
  };

  const handleNotificationClick = (notification: { actionType?: string; orderId?: string; isRead?: boolean; $id: string }) => {
    if (notification.actionType === 'view_invoice' && notification.orderId) {
      handleShowInvoice(notification.orderId);
    }
    
    if (!notification.isRead) {
      markAsRead(notification.$id);
    }
  };

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-[100] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Styleora
                </span>
              </Link>
              
              {/* Real-time status indicator - simple green dot */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-green-500">
                    <motion.div
                      initial={{ scale: 0, opacity: 0.7 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-green-500"
                    />
                  </div>
                </div>
                <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Live
                </span>
              </div>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className={`pl-10 transition-all duration-300 ${
                    isSearchFocused ? 'ring-2 ring-primary' : ''
                  }`}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
              <nav className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/Homepage')}
                  className="text-sm font-medium hover:text-primary flex items-center gap-2"
                >
                  <FiHome className="w-4 h-4" />
                  Homepage
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/Products')}
                  className="text-sm font-medium hover:text-primary"
                >
                  Products
                </Button>
                {isUserAdmin && (
                  <Button
                    variant="ghost"
                    onClick={() => router.push('/Dashboard')}
                    className="text-sm font-medium hover:text-primary"
                  >
                    Dashboard
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => router.push('/cart')}
                  className="relative text-sm font-medium hover:text-primary"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItemsCount}
                    </span>
                  )}
                </Button>
              </nav>

              {/* User Actions */}
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <NotificationDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  onDeleteNotification={deleteNotification}
                  onNotificationClick={handleNotificationClick}
                />
                
                {/* User Menu */}
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <FiUser className="w-5 h-5" />
                  </Button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-3 border-b">
                      <p className="font-medium truncate">{user.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push('/profile')}
                        className="w-full justify-start"
                      >
                        <FiSettings className="w-4 h-4 mr-2" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLogout}
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <FiLogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden mt-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t bg-background"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col gap-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push('/Homepage');
                    setIsMobileMenuOpen(false);
                  }}
                  className="justify-start text-sm font-medium"
                >
                  <FiHome className="w-4 h-4" />
                  Homepage
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push('/Products');
                    setIsMobileMenuOpen(false);
                  }}
                  className="justify-start text-sm font-medium"
                >
                  Products
                </Button>
                {isUserAdmin && (
                  <Button
                    variant="ghost"
                    onClick={() => {
                      router.push('/Dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start text-sm font-medium"
                  >
                    Dashboard
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push('/cart');
                    setIsMobileMenuOpen(false);
                  }}
                  className="justify-start text-sm font-medium"
                >
                  <FiShoppingCart className="w-5 h-5 mr-2" />
                  Cart ({cartItemsCount})
                </Button>
                <div className="border-t pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <ThemeToggle />
                    <NotificationDropdown
                      notifications={notifications}
                      unreadCount={unreadCount}
                      onMarkAsRead={markAsRead}
                      onMarkAllAsRead={markAllAsRead}
                      onDeleteNotification={deleteNotification}
                      onNotificationClick={handleNotificationClick}
                    />
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        router.push('/profile');
                        setIsMobileMenuOpen(false);
                      }}
                      className="justify-start text-sm w-full"
                    >
                      <FiSettings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="justify-start text-sm w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <FiLogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </header>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      {/* Customer Invoice Modal */}
      <CustomerInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
        order={selectedOrder}
      />
    </>
  );
}
