"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService, Cart, CartItem } from '@/appwrite/db/cart';
import { toast } from 'sonner';
import { useAuth } from '@/session/AuthContext';

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], total: 0 });
  const { user } = useAuth();

  useEffect(() => {
    if (user?.$id) {
      // Load cart from localStorage on mount or when user changes
      const savedCart = cartService.getCart(user.$id);
      setCart(savedCart);
    } else {
      setCart({ items: [], total: 0 });
    }
  }, [user]);

  const addToCart = (item: CartItem) => {
    if (!user?.$id) return;
    const updatedCart = cartService.addItem(user.$id, item);
    setCart(updatedCart);
    toast.success('Added to cart');
  };

  const removeFromCart = (productId: string) => {
    if (!user?.$id) return;
    const updatedCart = cartService.removeItem(user.$id, productId);
    setCart(updatedCart);
    toast.success('Removed from cart');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (!user?.$id) return;
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cartService.updateQuantity(user.$id, productId, quantity);
    setCart(updatedCart);
  };

  const clearCart = () => {
    if (!user?.$id) return;
    const emptyCart = cartService.clearCart(user.$id);
    setCart(emptyCart);
    toast.success('Cart cleared');
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}