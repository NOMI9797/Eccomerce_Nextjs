"use client";

import { useCart } from '@/session/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import Link from 'next/link';

export default function CheckoutPage() {
  const { cart } = useCart();
  const deliveryFee = 10.00;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Shop Checkout</h1>
        <div className="flex gap-2">
          <Link href="/" className="text-gray-600">Home</Link>
          <span>/</span>
          <span>Checkout</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Billing Details Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Billing details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name *</Label>
                <Input id="firstName" required />
              </div>
              <div>
                <Label htmlFor="lastName">Last name *</Label>
                <Input id="lastName" required />
              </div>
              <div className="col-span-2">
                <Label htmlFor="country">Country / Region *</Label>
                <select className="w-full border rounded-md p-2">
                  <option>Select...</option>
                  <option>Pakistan</option>
                  {/* Add more countries */}
                </select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Delivery address *</Label>
                <Input id="address" required />
                <Input className="mt-2" placeholder="Apartment, suite, etc. (optional)" />
              </div>
              <div>
                <Label htmlFor="postcode">Postcode / ZIP *</Label>
                <Input id="postcode" required />
              </div>
              <div>
                <Label htmlFor="city">Town / City *</Label>
                <Input id="city" required />
              </div>
              <div>
                <Label htmlFor="region">Region *</Label>
                <Input id="region" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" type="tel" required />
              </div>
              <div className="col-span-2">
                <Label htmlFor="email">Your Email</Label>
                <Input id="email" type="email" required />
              </div>
              <div className="col-span-2">
                <Label htmlFor="notes">Order notes (optional)</Label>
                <textarea 
                  id="notes"
                  className="w-full border rounded-md p-2 h-32"
                  placeholder="Notes about your order, e.g. special notes for delivery"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Your Order</h2>
            <div className="space-y-4">
              <div className="flex justify-between font-semibold">
                <span>Product</span>
                <span>Subtotal</span>
              </div>
              {cart.items.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Delivery Fee</span>
                  <span>${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2 font-bold">
                  <span>Total</span>
                  <span>${(cart.total + deliveryFee).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroup defaultValue="stripe">
                      <div className="flex items-center space-x-2 mb-2">
                        <RadioGroupItem value="stripe" id="stripe" />
                        <Label htmlFor="stripe">Stripe</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod">Cash on Delivery</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Input 
                  placeholder="Enter your magic code here..."
                  className="mb-2"
                />
                <Button className="w-full bg-yellow-400 hover:bg-yellow-500">
                  Apply
                </Button>
              </div>

              <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 