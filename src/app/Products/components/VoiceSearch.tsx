"use client";

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceRecognition } from '@/app/hooks/useVoiceRecognition';

interface VoiceSearchProps {
  onSearchResult: (text: string) => void;
}

export default function VoiceSearch({ onSearchResult }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);

  const handleResult = useCallback((text: string) => {
    onSearchResult(text);
    setIsListening(false);
  }, [onSearchResult]);

  const handleError = useCallback(() => {
    setIsListening(false);
  }, []);

  const { startListening, stopListening, hasSupport } = useVoiceRecognition({
    onResult: handleResult,
    onError: handleError,
  });

  if (!hasSupport) return null;

  const handleVoiceSearch = async () => {
    if (isListening) {
      stopListening();
      setIsListening(false);
    } else {
      startListening();
      setIsListening(true);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleVoiceSearch}
        className={`p-2 rounded-full ${
          isListening ? 'bg-red-500' : 'bg-blue-500'
        } text-white shadow-sm`}
        title="Search by voice"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </svg>
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute top-12 right-0 bg-white p-4 rounded-lg shadow-lg w-48"
          >
            <div className="flex items-center space-x-2">
              <div className="animate-pulse w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm text-gray-600">Listening...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 