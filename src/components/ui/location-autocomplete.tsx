"use client";

import { useState, useEffect, useRef } from 'react';
import { Input } from './input';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  suggestions: string[];
  className?: string;
  required?: boolean;
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  suggestions,
  className = "",
  required = false
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Filter suggestions based on input value
    if (value.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [value, suggestions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={`${className} pr-10`}
        required={required}
      />
      <FiMapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

      <AnimatePresence>
        {isOpen && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-black/90 backdrop-blur-xl border border-purple-500/20 rounded-lg shadow-lg overflow-hidden"
          >
            {filteredSuggestions.map((suggestion) => (
              <motion.button
                key={suggestion}
                className="w-full px-4 py-2 text-left text-white hover:bg-purple-500/20 transition-colors duration-200
                         border-b border-gray-700/50 last:border-0"
                whileHover={{ x: 4 }}
                onClick={() => {
                  onChange(suggestion);
                  setIsOpen(false);
                }}
              >
                {suggestion}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 