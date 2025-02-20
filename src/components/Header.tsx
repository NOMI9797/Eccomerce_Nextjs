// src/components/Header.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/session/AuthContext";
import { useCart } from "@/session/CartContext";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";

export default function Header() {
  const { user, logout, isUserAdmin } = useAuth();
  const { cart } = useCart();

  const cartItemsCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="w-full border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              KharedLo
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/Homepage" className="text-sm font-medium">
                  Home
                </Link>
                {isUserAdmin && (
                  <Link href="/Dashboard" className="text-sm font-medium">
                    Dashboard
                  </Link>
                )}
                <Link href="/cart" className="relative">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium">
                  Login
                </Link>
                <Link href="/signup" className="text-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
