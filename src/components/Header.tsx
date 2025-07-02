// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/session/AuthContext";
import { useCart } from "@/session/CartContext";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function Header() {
  const { user, logout, isUserAdmin } = useAuth();
  const { cart } = useCart();

  const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <motion.header 
      className="w-full border-b border-cyan-400/20 bg-black/80 backdrop-blur-md"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 transition-all duration-300">
              KharedLo
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/Homepage" className="text-sm font-medium text-cyan-300 hover:text-cyan-100 transition-colors duration-300 relative group">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                {isUserAdmin && (
                  <Link href="/Dashboard" className="text-sm font-medium text-purple-300 hover:text-purple-100 transition-colors duration-300 relative group">
                    Dashboard
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                <Link href="/cart" className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="relative text-cyan-300 hover:text-cyan-100 hover:bg-cyan-400/10 transition-all duration-300"
                    >
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                        <motion.span 
                          className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          style={{
                            boxShadow: '0 0 10px rgba(236, 72, 153, 0.6)'
                          }}
                        >
                        {cartItemsCount}
                        </motion.span>
                    )}
                  </Button>
                  </motion.div>
                </Link>
                <motion.button
                  onClick={logout}
                  className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors duration-300 relative group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Logout
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-400 group-hover:w-full transition-all duration-300"></span>
                </motion.button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-cyan-300 hover:text-cyan-100 transition-colors duration-300 relative group">
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/signup" className="text-sm font-medium text-purple-300 hover:text-purple-100 transition-colors duration-300 relative group">
                  Sign Up
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
