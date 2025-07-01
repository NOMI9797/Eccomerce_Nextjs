"use client";

import { useCart } from '@/session/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AddressAutocomplete } from '@/components/ui/address-autocomplete';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
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
import { toast } from 'sonner';

// Add this interface
interface CountriesWithCities {
  [key: string]: string[];
}

export default function CheckoutPage() {
  const { cart } = useCart();
  const deliveryFee = 10.00;
  const [address, setAddress] = useState({
    country: '',
    countryCode: '',
    city: '',
    street: '',
    postalCode: '',
    isManualPostalCode: false
  });
  const [countries, setCountries] = useState<string[]>([]);
  const [streetAutocomplete, setStreetAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBtGLZIMW1fOUVDZREa3Aq3gXfVB_S1PJQ",
    libraries: ["places"]
  });

  const { user } = useAuth();
  const { createOrder } = useOrders();

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    const addressComponents = place.address_components || [];
    let newAddress = {
      ...address,
      country: '',
      countryCode: '',
      city: '',
      street: place.formatted_address || '',
      postalCode: '',
      isManualPostalCode: true
    };

    addressComponents.forEach(component => {
      const types = component.types;
      if (types.includes('country')) {
        newAddress.country = component.long_name;
        newAddress.countryCode = component.short_name;
      }
      if (types.includes('locality') || types.includes('administrative_area_level_2')) {
        newAddress.city = component.long_name;
      }
      if (types.includes('route')) {
        newAddress.street = place.formatted_address || component.long_name;
      }
      if (types.includes('postal_code')) {
        newAddress.postalCode = component.long_name;
        newAddress.isManualPostalCode = false;
      }
    });

    setAddress(newAddress);
  };

  // Initialize Google Places Autocomplete for countries
  const countryAutocomplete = (input: HTMLInputElement) => {
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['country']
    });
    
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.address_components) {
        const countryComponent = place.address_components[0];
        setAddress(prev => ({ 
          ...prev, 
          country: countryComponent.long_name,
          countryCode: countryComponent.short_name
        }));
      }
    });
  };

  // Initialize Google Places Autocomplete for cities
  const cityAutocomplete = (input: HTMLInputElement) => {
    const autocomplete = new google.maps.places.Autocomplete(input, {
      types: ['(cities)'],
      componentRestrictions: { country: address.countryCode?.toLowerCase() || null }
    });
    
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.address_components) {
        const city = place.address_components[0].long_name;
        setAddress(prev => ({ ...prev, city }));
      }
    });
  };

  // Add these state variables
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    postalCode: ''
  });

  // Add validation function
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      postalCode: ''
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

    // Postal Code validation
    if (address.isManualPostalCode && !address.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  // Add form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error('Please fix form errors before proceeding');
      return;
    }

    const orderData = {
      userId: user.$id,
      items: cart.items.map(item => item.productId),
      quantities: cart.items.map(item => item.quantity),
      totalAmount: cart.total + deliveryFee,
      shippingAddress: `${address.street}, ${address.city}, ${address.country}`,
      status: 'pending' as const,
      paymentStatus: 'pending' as const
    };
    
    try {
      await createOrder.mutateAsync(orderData);
      toast.success('Order placed successfully');
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  if (!isLoaded) {
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
            <p className="text-gray-400 text-lg">Loading checkout...</p>
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
          className="flex justify-between items-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              Shop Checkout
            </h1>
            <p className="text-gray-400">Complete your purchase securely</p>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-cyan-400">Checkout</span>
          </div>
        </motion.div>

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
                  <div>
                    <Label htmlFor="country" className="text-gray-300 flex items-center gap-2 mb-2">
                      <FiHome className="text-purple-400" />
                      Country / Region *
                    </Label>
                    <Input
                      id="country"
                      type="text"
                      placeholder="Start typing a country..."
                      ref={(input) => {
                        if (input && isLoaded) countryAutocomplete(input);
                      }}
                      required
                      className="bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 transition-colors"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-gray-300 flex items-center gap-2 mb-2">
                      <FiMapPin className="text-purple-400" />
                      City *
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder={address.country ? "Start typing a city..." : "Please select a country first"}
                      ref={(input) => {
                        if (input && isLoaded && address.country) cityAutocomplete(input);
                      }}
                      disabled={!address.country}
                      required
                      className="bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 transition-colors disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="street" className="text-gray-300 flex items-center gap-2 mb-2">
                      <FiHome className="text-purple-400" />
                      Street Address *
                    </Label>
                    <Autocomplete
                      onLoad={(autocomplete) => {
                        autocomplete.setFields(['address_components', 'formatted_address']);
                        if (address.country) {
                          autocomplete.setComponentRestrictions({
                            country: address.countryCode?.toLowerCase() || null
                          });
                        }
                        setStreetAutocomplete(autocomplete);
                      }}
                      onPlaceChanged={() => {
                        if (streetAutocomplete) {
                          const place = streetAutocomplete.getPlace();
                          handlePlaceSelect(place);
                        }
                      }}
                    >
                      <Input
                        id="street"
                        type="text"
                        placeholder="Start typing your street address..."
                        required
                        className="bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 transition-colors"
                      />
                    </Autocomplete>
                  </div>

                  {/* Display selected address details */}
                  {address.country && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-6 border-t border-gray-700/50 pt-6"
                    >
                      <div>
                        <Label className="text-gray-300 mb-2 block">Selected Country</Label>
                        <Input value={address.country} disabled className="bg-gray-800/60 border-gray-700 text-gray-300" />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2 block">Selected City</Label>
                        <Input value={address.city} disabled className="bg-gray-800/60 border-gray-700 text-gray-300" />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2 block">Street Address</Label>
                        <Input value={address.street} disabled className="bg-gray-800/60 border-gray-700 text-gray-300" />
                      </div>
                      <div>
                        <Label className="text-gray-300 mb-2 block">Postal Code</Label>
                        <Input 
                          value={address.postalCode}
                          onChange={(e) => setAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                          placeholder={address.isManualPostalCode ? "Enter postal code manually" : ""}
                          disabled={!address.isManualPostalCode}
                          required
                          className="bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400 transition-colors disabled:bg-gray-800/60 disabled:border-gray-700 disabled:text-gray-300"
                        />
                        {address.isManualPostalCode && (
                          <p className="text-sm text-yellow-400 mt-2">
                            No postal code found for this address. Please enter it manually.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

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

                {/* Payment Options */}
                <div className="border-t border-gray-700/50 pt-6">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <FiCreditCard className="text-purple-400" />
                    Payment Method
                  </h3>
                  <RadioGroup defaultValue="stripe" className="space-y-3">
                    <motion.div 
                      className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-purple-400/40 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <RadioGroupItem value="stripe" id="stripe" className="border-purple-400 text-purple-400" />
                      <Label htmlFor="stripe" className="text-white flex items-center gap-2">
                        <FiCreditCard className="text-purple-400" />
                        Stripe (Credit/Debit Card)
                      </Label>
                    </motion.div>
                    <motion.div 
                      className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50 hover:border-green-400/40 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <RadioGroupItem value="cod" id="cod" className="border-green-400 text-green-400" />
                      <Label htmlFor="cod" className="text-white flex items-center gap-2">
                        <FiDollarSign className="text-green-400" />
                        Cash on Delivery
                      </Label>
                    </motion.div>
                  </RadioGroup>
                </div>

                {/* Promo Code */}
                <div className="border-t border-gray-700/50 pt-6">
                  <h3 className="text-white font-semibold mb-4">Promo Code</h3>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter your magic code here..."
                      className="bg-black/60 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-400 transition-colors"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 
                               text-black font-semibold rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                    >
                      Apply
                    </motion.button>
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
    </div>
  );
} 