"use client";

import { useCart } from '@/session/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCreditCard, 
  FiTruck, 
  FiMapPin, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiArrowRight,
  FiCheck,
  FiDollarSign
} from 'react-icons/fi';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '@/session/AuthContext';
import { useOrders } from '@/app/hooks/useOrders';
import { useLocation } from '@/app/hooks/useLocation';
import { toast } from 'sonner';
import { LocationAutocomplete } from '@/components/ui/location-autocomplete';
import { countries, citiesByCountry, regionsByCountry } from '@/lib/location-data';
import Invoice from '@/components/ui/invoice';
import { useRouter } from 'next/navigation';
import { ordersService } from '@/appwrite/db/orders';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const deliveryFee = 10.00;
  const [showInvoice, setShowInvoice] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'cod'>('cod');
  const { locationData, loading: locationLoading } = useLocation();
  const [address, setAddress] = useState({
    country: '',
    countryCode: '',
    city: '',
    region: '',
    street: '',
    postalCode: '',
  });

  // Update address when location data is available
  useEffect(() => {
    if (locationData) {
      setAddress({
        country: locationData.country_name || '',
        countryCode: locationData.country_code || '',
        city: locationData.city || '',
        region: locationData.region || '',
        street: '',
        postalCode: locationData.postal || '',
      });
    }
  }, [locationData]);

  const { createOrder } = useOrders();

  // Add form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  // Add form errors state
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    street: ''
  });

  // Add validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      street: ''
    };

    // First Name validation
    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    } else if (firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
      isValid = false;
    }

    // Last Name validation
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    } else if (lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
      isValid = false;
    }

    // Phone validation
    const phoneRegex = /^\d{11}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Phone number must be exactly 11 digits';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Street address validation
    if (!streetAddress.trim()) {
      newErrors.street = 'Street address is required';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order');
      return;
    }

    try {
      // Create order data
      const orderData = {
        userId: user.$id,
        items: cart.items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: cart.total + deliveryFee,
        status: 'pending' as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
        paymentStatus: (paymentMethod === 'stripe' ? 'pending' : 'paid') as 'pending' | 'paid' | 'failed',
        shippingFirstName: firstName,
        shippingLastName: lastName,
        shippingEmail: email,
        shippingPhone: phone,
        shippingStreet: streetAddress,
        shippingCity: address.city,
        shippingRegion: address.region,
        shippingCountry: address.country,
        shippingPostalCode: address.postalCode,
      };

      // Create the order using ordersService
      const order = await ordersService.createOrder(orderData);

      // Prepare invoice data
      const invoiceData = {
        orderDetails: {
          orderId: order.$id,
          date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          items: order.items, // This will already be parsed back to an array by the service
          subtotal: cart.total,
          deliveryFee,
          total: orderData.total,
          paymentMethod: paymentMethod === 'stripe' ? 'Credit/Debit Card' : 'Cash on Delivery',
        },
        customerDetails: {
          firstName,
          lastName,
          email,
          phone,
          address: {
            street: streetAddress,
            city: address.city,
            region: address.region,
            country: address.country,
            postalCode: address.postalCode,
          },
        },
      };

      // Show invoice
      setOrderDetails(invoiceData);
      setShowInvoice(true);

      // Clear cart
      clearCart();

      toast.success('Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (locationLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(56,189,248,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-400 text-lg">Loading location data...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(56,189,248,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        >
          Checkout
        </motion.h1>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Billing Details Form */}
          <div className="xl:col-span-2 space-y-8">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8
                            hover:border-cyan-400/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                <div className="flex items-center gap-3 mb-8">
                  <FiUser className="text-2xl text-cyan-400" />
                  <h2 className="text-2xl font-bold text-white">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300 flex items-center gap-2 mb-2">
                      <FiUser className="text-cyan-400" />
                      First name *
                    </Label>
                    <Input 
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className={`bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 
                               transition-colors ${formErrors.firstName ? 'border-red-500' : ''}`}
                      placeholder="Enter your first name"
                    />
                    {formErrors.firstName && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {formErrors.firstName}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-gray-300 flex items-center gap-2 mb-2">
                      <FiUser className="text-cyan-400" />
                      Last name *
                    </Label>
                    <Input 
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className={`bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 
                               transition-colors ${formErrors.lastName ? 'border-red-500' : ''}`}
                      placeholder="Enter your last name"
                    />
                    {formErrors.lastName && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {formErrors.lastName}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2 mb-2">
                      <FiPhone className="text-cyan-400" />
                      Phone *
                    </Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 11) {
                          setPhone(value);
                        }
                      }}
                      placeholder="Enter 11 digit phone number"
                      required
                      className={`bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 
                               transition-colors ${formErrors.phone ? 'border-red-500' : ''}`}
                    />
                    {formErrors.phone && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {formErrors.phone}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-gray-300 flex items-center gap-2 mb-2">
                      <FiMail className="text-cyan-400" />
                      Your Email *
                    </Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={`bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 
                               transition-colors ${formErrors.email ? 'border-red-500' : ''}`}
                      placeholder="Enter your email address"
                    />
                    {formErrors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {formErrors.email}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
              <div className="relative bg-black/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8
                            hover:border-purple-400/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                <div className="flex items-center gap-3 mb-8">
                  <FiMapPin className="text-2xl text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Shipping Address</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Location Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-300 flex items-center gap-2 mb-2">
                        <FiHome className="text-purple-400" />
                        Country *
                      </Label>
                      <LocationAutocomplete
                        value={address.country}
                        onChange={(value) => setAddress(prev => ({ 
                          ...prev, 
                          country: value,
                          // Reset dependent fields when country changes
                          city: '',
                          region: ''
                        }))}
                        placeholder="Enter your country"
                        suggestions={countries}
                        required
                        className="bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 
                                 transition-colors hover:border-purple-400/50"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300 flex items-center gap-2 mb-2">
                        <FiMapPin className="text-purple-400" />
                        City *
                      </Label>
                      <LocationAutocomplete
                        value={address.city}
                        onChange={(value) => setAddress(prev => ({ ...prev, city: value }))}
                        placeholder={address.country ? "Enter your city" : "Please select a country first"}
                        suggestions={address.country ? (citiesByCountry[address.country] || []) : []}
                        required
                        className="bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 
                                 transition-colors hover:border-purple-400/50"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300 flex items-center gap-2 mb-2">
                        <FiMapPin className="text-purple-400" />
                        Region/State *
                      </Label>
                      <LocationAutocomplete
                        value={address.region}
                        onChange={(value) => setAddress(prev => ({ ...prev, region: value }))}
                        placeholder={address.country ? "Enter your region/state" : "Please select a country first"}
                        suggestions={address.country ? (regionsByCountry[address.country] || []) : []}
                        required
                        className="bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 
                                 transition-colors hover:border-purple-400/50"
                      />
                    </div>

                    <div>
                      <Label className="text-gray-300 flex items-center gap-2 mb-2">
                        <FiMapPin className="text-purple-400" />
                        Postal Code *
                      </Label>
                      <Input
                        value={address.postalCode}
                        onChange={(e) => setAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="Enter your postal code"
                        required
                        className="bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 
                                 transition-colors hover:border-purple-400/50"
                      />
                    </div>
                  </div>

                  {/* Street Address Input */}
                  <div>
                    <Label htmlFor="street" className="text-gray-300 flex items-center gap-2 mb-2">
                      <FiHome className="text-purple-400" />
                      Street Address *
                    </Label>
                    <Input
                      id="street"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="Enter your street address"
                      required
                      className={`bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 
                               transition-colors ${formErrors.street ? 'border-red-500' : ''}`}
                    />
                    {formErrors.street && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {formErrors.street}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="notes" className="text-gray-300 mb-2 block">Order notes (optional)</Label>
                    <textarea 
                      id="notes"
                      className="w-full bg-black/60 border border-gray-600 rounded-lg p-4 text-white placeholder-gray-400 
                               focus:border-purple-400 transition-colors h-32 resize-none"
                      placeholder="Notes about your order, e.g. special notes for delivery"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative group"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-cyan-500/20 rounded-2xl blur opacity-50" />
            <div className="relative bg-black/60 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-8 h-fit
                          hover:shadow-[0_0_40px_rgba(236,72,153,0.3)] transition-all duration-500 sticky top-8">
              <div className="flex items-center gap-3 mb-8">
                <FiShoppingCart className="text-2xl text-pink-400" />
                <h2 className="text-2xl font-bold text-white">Your Order</h2>
              </div>
              
              <div className="space-y-6">
                {/* Order Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {cart.items.map((item) => (
                    <motion.div 
                      key={item.productId} 
                      className="flex justify-between items-center p-4 bg-gray-800/30 rounded-xl border border-gray-700/50"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${item.image}/view?project=679b0257003b758db270`}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-600"
                        />
                        <div>
                          <p className="text-white font-medium text-sm">{item.name}</p>
                          <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-cyan-400 font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Summary Totals */}
                <div className="border-t border-gray-700/50 pt-6 space-y-4">
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-300">Subtotal</span>
                    <span className="text-white font-semibold">${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-gray-300">Delivery Fee</span>
                    <span className="text-cyan-400 font-semibold">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-700/50 pt-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span className="text-white">Total</span>
                      <span className="bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                        ${(cart.total + deliveryFee).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-xl font-semibold text-white">Payment Method</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-xl border ${
                        paymentMethod === 'cod'
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-700 hover:border-cyan-500/50'
                      } transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          paymentMethod === 'cod' ? 'border-cyan-500' : 'border-gray-500'
                        } flex items-center justify-center`}>
                          {paymentMethod === 'cod' && (
                            <div className="w-3 h-3 rounded-full bg-cyan-500" />
                          )}
                        </div>
                        <span className="text-white">Cash on Delivery</span>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-4 rounded-xl border ${
                        paymentMethod === 'stripe'
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-gray-700 hover:border-cyan-500/50'
                      } transition-all duration-300`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 ${
                          paymentMethod === 'stripe' ? 'border-cyan-500' : 'border-gray-500'
                        } flex items-center justify-center`}>
                          {paymentMethod === 'stripe' && (
                            <div className="w-3 h-3 rounded-full bg-cyan-500" />
                          )}
                        </div>
                        <span className="text-white">Credit/Debit Card</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Place Order Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="pt-6"
                >
                  <Button 
                    onClick={(e) => {
                      e.preventDefault();
                      handlePlaceOrder();
                    }}
                    className="w-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-600 
                             hover:from-cyan-400 hover:via-purple-500 hover:to-pink-500 
                             text-white py-4 rounded-xl font-bold text-lg shadow-[0_0_30px_rgba(34,211,238,0.3)] 
                             hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] transform hover:scale-105 transition-all duration-300
                             border border-cyan-400/20 backdrop-blur-sm"
                  >
                    <FiCheck className="mr-2" />
                    Place Order
                    <FiArrowRight className="ml-2" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Invoice Modal */}
      <AnimatePresence>
        {showInvoice && orderDetails && (
          <Invoice
            {...orderDetails}
            onClose={() => {
              setShowInvoice(false);
              router.push('/'); // Redirect to home after closing invoice
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 