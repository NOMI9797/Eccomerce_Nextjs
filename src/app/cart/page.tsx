"use client";

import { useCart } from '@/session/CartContext';
import { useOrders } from '@/app/hooks/useOrders';
import { useAuth } from '@/session/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
      <div className="container mx-auto py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Add some items to your cart to get started.</p>
        <Button onClick={() => router.push('/Products')}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-4 bg-white p-4 rounded-lg shadow mb-4">
              <img
                src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${item.image}/view?project=679b0257003b758db270`}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFromCart(item.productId)}
              >
                Remove
              </Button>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-lg shadow h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="border-t pt-4">
              <div className="font-semibold flex justify-between">
                <span>Total</span>
                <span>${cart.total.toFixed(2)}</span>
              </div>
            </div>
            <Button
              onClick={handleCheckout}
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}