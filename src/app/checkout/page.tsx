"use client";

import { useCart } from '@/session/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Header from '@/components/Header';
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
  FiDollarSign,
  FiChevronLeft
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
import { notificationService } from '@/appwrite/db/notifications';
import { useNotifications } from '@/session/NotificationContext';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const { fetchNotifications } = useNotifications();
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
    if (!firstName || !lastName || !email || !phone || !streetAddress || !address.city || !address.region || !address.country || !address.postalCode) {
      toast.error('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      // Create order data
      const orderData = {
        userId: user?.$id || '',
        items: cart.items.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0) + deliveryFee,
        status: 'pending' as const,
        paymentStatus: 'pending' as const,
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

      // Save order to database
      const result = await ordersService.createOrder(orderData);

      // Create notification for admin
      try {
        if (result.$id) {
          await notificationService.createOrderNotification(
            result.$id,
            result.orderNumber,
            `${firstName} ${lastName}`
          );
          // Refresh notifications to show the new one
          await fetchNotifications();
        }
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError);
        // Don't fail the order if notification fails
      }

      // Prepare invoice data
      const invoiceData = {
        orderDetails: {
          orderId: result.$id,
          date: new Date().toLocaleDateString(),
          items: cart.items,
          subtotal: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0),
          deliveryFee,
          total: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0) + deliveryFee,
          paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit/Debit Card',
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
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
          <div className="flex items-center justify-center min-h-screen">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-200 dark:border-blue-600 border-t-blue-600 dark:border-t-blue-400 rounded-full mx-auto mb-4"
              />
              <p className="text-gray-600 dark:text-gray-400 text-lg">Loading location data...</p>
            </motion.div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <Link 
              href="/cart" 
              className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <FiChevronLeft className="w-4 h-4 mr-1" />
              Back to Cart
            </Link>
          </nav>

          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Checkout
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Complete your order details below</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Billing Details Form */}
            <div className="xl:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <FiUser className="text-blue-600 dark:text-blue-400 w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                      First name *
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full"
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName" className="text-gray-700 font-medium mb-2 block">
                      Last name *
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full"
                      placeholder="Enter your last name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium mb-2 block">
                      Email address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full"
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium mb-2 block">
                      Phone number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <FiMapPin className="text-blue-600 dark:text-blue-400 w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Address</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="streetAddress" className="text-gray-700 font-medium mb-2 block">
                      Street address *
                    </Label>
                    <Input
                      id="streetAddress"
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full"
                      placeholder="Enter your street address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">
                        Country *
                      </Label>
                                             <LocationAutocomplete
                         value={address.country}
                         onChange={(country: string) => {
                           setAddress(prev => ({ ...prev, country, countryCode: '', city: '', region: '' }));
                         }}
                         placeholder="Select your country"
                         suggestions={countries}
                       />
                    </div>
                    
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">
                        City *
                      </Label>
                                             <LocationAutocomplete
                         value={address.city}
                         onChange={(city: string) => {
                           setAddress(prev => ({ ...prev, city, region: '' }));
                         }}
                         placeholder="Select your city"
                         suggestions={address.country ? (citiesByCountry[address.country] || []) : []}
                       />
                    </div>
                    
                    <div>
                      <Label className="text-gray-700 font-medium mb-2 block">
                        State/Region *
                      </Label>
                                             <LocationAutocomplete
                         value={address.region}
                         onChange={(region: string) => {
                           setAddress(prev => ({ ...prev, region }));
                         }}
                         placeholder="Select your region"
                         suggestions={address.country ? (regionsByCountry[address.country] || []) : []}
                       />
                    </div>
                    
                    <div>
                      <Label htmlFor="postalCode" className="text-gray-700 font-medium mb-2 block">
                        Postal code *
                      </Label>
                      <Input
                        id="postalCode"
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => setAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                        className="w-full"
                        placeholder="Enter postal code"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <FiCreditCard className="text-blue-600 dark:text-blue-400 w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Payment Method</h2>
                </div>
                
                <RadioGroup value={paymentMethod} onValueChange={(value: 'stripe' | 'cod') => setPaymentMethod(value)}>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <FiDollarSign className="text-green-600" />
                        <div>
                          <p className="font-medium text-gray-900">Cash on Delivery</p>
                          <p className="text-sm text-gray-500">Pay when you receive your order</p>
                        </div>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 opacity-50">
                      <RadioGroupItem value="stripe" id="stripe" disabled />
                      <Label htmlFor="stripe" className="flex items-center gap-3 cursor-not-allowed flex-1">
                        <FiCreditCard className="text-blue-600" />
                        <div>
                          <p className="font-medium text-gray-900">Credit/Debit Card</p>
                          <p className="text-sm text-gray-500">Coming soon</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Order Summary */}
            <div className="xl:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image ? 
                            `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${item.image}/view?project=679b0257003b758db270` :
                            "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="text-gray-900 dark:text-white">${cart.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                    <span className="text-gray-900 dark:text-white">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-3">
                    <span className="text-gray-900 dark:text-white">Total</span>
                    <span className="text-gray-900 dark:text-white">${(cart.items.reduce((total, item) => total + (item.price * item.quantity), 0) + deliveryFee).toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handlePlaceOrder}
                  variant="primary"
                  size="lg"
                  className="w-full mt-6 gap-2"
                >
                  <FiCheck className="w-4 h-4" />
                  Place Order
                </Button>
              </div>
            </div>
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
    </>
  );
} 