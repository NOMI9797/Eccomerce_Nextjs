"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiZoomIn, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ProductImagesProps {
  images: string[];
}

export default function ProductImages({ images }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-6">
      {/* Main Image Display */}
      <motion.div 
        className="relative aspect-square w-full overflow-hidden rounded-xl group"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-xl" />
        
        <motion.img
          key={selectedImage}
          src={images && images.length > 0 ? 
            `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${images[selectedImage]}/view?project=679b0257003b758db270` :
            "/images/pexels-shattha-pilabut-38930-135620.jpg"}
          alt="Product"
          className="w-full h-full object-cover rounded-xl"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          onError={(e) => {
            e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
          }}
        />

        {/* Image Navigation Arrows */}
        {images.length > 1 && (
          <>
            <motion.button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm border border-cyan-400/30 text-cyan-400 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-cyan-400 hover:bg-black/80"
              onClick={prevImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
              }}
            >
              <FiChevronLeft className="w-6 h-6" />
            </motion.button>
            
            <motion.button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/60 backdrop-blur-sm border border-cyan-400/30 text-cyan-400 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-cyan-400 hover:bg-black/80"
              onClick={nextImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
              }}
            >
              <FiChevronRight className="w-6 h-6" />
            </motion.button>
          </>
        )}

        {/* Zoom Button */}
        <motion.button
          className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-cyan-400/30 text-cyan-400 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-cyan-400 hover:bg-black/80"
          onClick={() => setIsZoomed(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
          }}
        >
          <FiZoomIn className="w-5 h-5" />
        </motion.button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm border border-cyan-400/30 px-3 py-1.5 rounded-full">
            <span className="text-cyan-300 text-sm font-medium">
              {selectedImage + 1} / {images.length}
            </span>
          </div>
        )}

        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-cyan-400/50 transition-all duration-300" />
      </motion.div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <motion.div 
          className="grid grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {images.map((image, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 ${
                selectedImage === index 
                  ? 'ring-2 ring-cyan-400 shadow-lg' 
                  : 'ring-1 ring-gray-600/50 hover:ring-cyan-400/50'
              }`}
              onClick={() => setSelectedImage(index)}
              style={selectedImage === index ? {
                boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)'
              } : {}}
            >
              <img
                src={image ? 
                  `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${image}/view?project=679b0257003b758db270` :
                  "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
                }}
              />
              
              {/* Overlay for selected state */}
              {selectedImage === index && (
                <div className="absolute inset-0 bg-cyan-400/20" />
              )}
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300" />
            </motion.button>
          ))}
        </motion.div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              className="relative max-w-4xl max-h-full"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${images[selectedImage]}/view?project=679b0257003b758db270`}
                alt="Product Zoomed"
                className="w-full h-full object-contain rounded-lg"
                style={{
                  maxHeight: '90vh',
                  boxShadow: '0 0 50px rgba(0, 255, 255, 0.3)'
                }}
              />
              
              <motion.button
                className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm border border-cyan-400/30 text-cyan-400 p-2 rounded-full hover:border-cyan-400 hover:bg-black/80 transition-all duration-300"
                onClick={() => setIsZoomed(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ✕
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 