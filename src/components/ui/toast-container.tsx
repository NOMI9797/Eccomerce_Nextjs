"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Toast, { ToastProps } from './toast';

interface ToastContainerProps {
  toasts: ToastProps[];
  onRemoveToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Toast
              {...toast}
              onClose={onRemoveToast}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer; 