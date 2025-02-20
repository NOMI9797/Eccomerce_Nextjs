"use client";

import { useCart } from '@/session/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AddressAutocomplete } from '@/components/ui/address-autocomplete';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

import Link from 'next/link';
import { useState, useEffect } from 'react';

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
  });
  const [countries, setCountries] = useState<string[]>([]);
  const [streetAutocomplete, setStreetAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBtGLZIMW1fOUVDZREa3Aq3gXfVB_S1PJQ",
    libraries: ["places"]
  });

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    const addressComponents = place.address_components || [];
    let newAddress = {
      ...address,
      country: '',
      countryCode: '',
      city: '',
      street: place.formatted_address || '',
      postalCode: '',
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

  if (!isLoaded) return <div>Loading...</div>;

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
                <Input
                  id="country"
                  type="text"
                  placeholder="Start typing a country..."
                  ref={(input) => {
                    if (input && isLoaded) countryAutocomplete(input);
                  }}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder={address.country ? "Start typing a city..." : "Please select a country first"}
                  ref={(input) => {
                    if (input && isLoaded && address.country) cityAutocomplete(input);
                  }}
                  disabled={!address.country}
                  required
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="street">Street Address *</Label>
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
                  />
                </Autocomplete>
              </div>

              {/* Display selected address details */}
              {address.country && (
                <div className="col-span-2 space-y-4">
                  <div>
                    <Label>Country</Label>
                    <Input value={address.country} disabled />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input value={address.city} disabled />
                  </div>
                  <div>
                    <Label>Street</Label>
                    <Input value={address.street} disabled />
                  </div>
                  <div>
                    <Label>Postal Code</Label>
                    <Input value={address.postalCode} disabled />
                  </div>
                </div>
              )}

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