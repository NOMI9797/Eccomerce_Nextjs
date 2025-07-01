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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleVoiceSearch}
        className={`p-3 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg' 
            : 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg'
        } text-white backdrop-blur-sm border border-white/20`}
        style={{
          boxShadow: isListening 
            ? '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)' 
            : '0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.3)'
        }}
        title="Search by voice"
        animate={{
          boxShadow: isListening
            ? [
                '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)',
                '0 0 40px rgba(239, 68, 68, 0.8), 0 0 80px rgba(239, 68, 68, 0.4)',
                '0 0 30px rgba(239, 68, 68, 0.6), 0 0 60px rgba(239, 68, 68, 0.3)'
              ]
            : '0 0 30px rgba(6, 182, 212, 0.6), 0 0 60px rgba(6, 182, 212, 0.3)'
        }}
        transition={{
          duration: isListening ? 0.8 : 0.3,
          repeat: isListening ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        <motion.svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{
            scale: isListening ? [1, 1.2, 1] : 1
          }}
          transition={{
            duration: 0.5,
            repeat: isListening ? Infinity : 0,
            ease: "easeInOut"
          }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 10 }}
            className="absolute top-16 right-0 bg-black/80 backdrop-blur-sm border border-cyan-400/30 p-4 rounded-lg shadow-lg w-48"
            style={{
              background: 'linear-gradient(145deg, rgba(0,0,0,0.9), rgba(30,30,30,0.8))',
              boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)'
            }}
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-3 h-3 bg-red-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)'
                }}
              />
              <motion.span 
                className="text-sm text-cyan-300 font-medium"
                animate={{
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Listening...
              </motion.span>
            </div>
            
            {/* Audio wave visualization */}
            <div className="flex items-center justify-center space-x-1 mt-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full"
                  animate={{
                    height: [4, 16, 4]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 