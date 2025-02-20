"use client";

import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Input } from './input';
import { useState } from 'react';

const libraries: ["places"] = ["places"];

interface AddressAutocompleteProps {
  onSelect: (address: string) => void;
  placeholder: string;
  className?: string;
  required?: boolean;
}

export function AddressAutocomplete({ onSelect, placeholder, className, required }: AddressAutocompleteProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyBtGLZIMW1fOUVDZREa3Aq3gXfVB_S1PJQ",
    libraries: libraries,
  });

  const [value, setValue] = useState('');

  if (!isLoaded) {
    return <Input placeholder="Loading..." disabled />;
  }

  return (
    <Autocomplete
      onLoad={(autocomplete) => {
        autocomplete.setFields(['address_components', 'formatted_address', 'geometry']);
      }}
      onPlaceChanged={() => {
        const autocomplete = document.querySelector('input') as HTMLInputElement;
        if (autocomplete) {
          onSelect(autocomplete.value);
        }
      }}
    >
      <Input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className={className}
        required={required}
      />
    </Autocomplete>
  );
} 