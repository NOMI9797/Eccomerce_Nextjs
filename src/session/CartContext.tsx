"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService, Cart, CartItem } from '@/appwrite/db/cart';
import { toast } from 'sonner';
import { useAuth } from '@/session/AuthContext';
import db from '@/appwrite/db';
import { Product } from '@/app/Dashboard/ListProduct/types/product';

interface CartContextType {
  cart: Cart;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  validateCartStock: () => Promise<boolean>;
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

  // Function to check product stock
  const checkProductStock = async (productId: string): Promise<Product | null> => {
    try {
      const product = await db.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
        productId
      );
      return product as Product;
    } catch (error) {
      console.error('Error checking product stock:', error);
      return null;
    }
  };

  // Function to validate cart stock
  const validateCartStock = async (): Promise<boolean> => {
    if (!user?.$id) return false;
    
    let isValid = true;
    const invalidItems: string[] = [];
    
    for (const item of cart.items) {
      const product = await checkProductStock(item.productId);
      
      if (!product) {
        invalidItems.push(item.name);
        isValid = false;
        continue;
      }
      
      // Check if product has stock tracking enabled
      if (product.TrackStock) {
        const availableStock = product.Stock || 0;
        
        if (availableStock <= 0) {
          invalidItems.push(`${item.name} (Out of stock)`);
          isValid = false;
        } else if (item.quantity > availableStock) {
          invalidItems.push(`${item.name} (Only ${availableStock} available)`);
          isValid = false;
        }
      }
    }
    
    if (!isValid) {
      toast.error(`Stock issues found: ${invalidItems.join(', ')}`);
    }
    
    return isValid;
  };

  const addToCart = async (item: CartItem) => {
    if (!user?.$id) return;
    
    // Check product stock before adding
    const product = await checkProductStock(item.productId);
    
    if (!product) {
      toast.error('Product not found');
      return;
    }
    
    // Check if product has stock tracking enabled
    if (product.TrackStock) {
      const availableStock = product.Stock || 0;
      
      if (availableStock <= 0) {
        toast.error('This product is currently out of stock');
        return;
      }
      
      // Check if adding this item would exceed available stock
      const currentCartItem = cart.items.find(cartItem => cartItem.productId === item.productId);
      const currentQuantityInCart = currentCartItem ? currentCartItem.quantity : 0;
      const newTotalQuantity = currentQuantityInCart + item.quantity;
      
      if (newTotalQuantity > availableStock) {
        const remainingStock = availableStock - currentQuantityInCart;
        if (remainingStock > 0) {
          toast.error(`Only ${remainingStock} more items can be added to cart`);
        } else {
          toast.error('Cannot add more items. Maximum stock limit reached in cart');
        }
        return;
      }
    }
    
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

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user?.$id) return;
    
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    // Check stock before updating quantity
    const product = await checkProductStock(productId);
    
    if (!product) {
      toast.error('Product not found');
      return;
    }
    
    // Check if product has stock tracking enabled
    if (product.TrackStock) {
      const availableStock = product.Stock || 0;
      
      if (availableStock <= 0) {
        toast.error('This product is currently out of stock');
        removeFromCart(productId);
        return;
      }
      
      if (quantity > availableStock) {
        toast.error(`Only ${availableStock} items available in stock`);
        return;
      }
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
        clearCart,
        validateCartStock 
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