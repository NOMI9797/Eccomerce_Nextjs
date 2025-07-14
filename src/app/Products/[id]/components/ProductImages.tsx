"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductImagesProps {
  images: string[];
}

export default function ProductImages({ images }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <motion.div 
        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.img
          src={selectedImage ? 
            `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${selectedImage}/view?project=679b0257003b758db270` :
            "/images/pexels-shattha-pilabut-38930-135620.jpg"}
          alt="Product"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
          }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Sale Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">
            Sale
            </span>
          </div>
      </motion.div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.button
              key={index}
              className={`relative aspect-square rounded-lg overflow-hidden ${
                selectedImage === image 
                  ? 'ring-2 ring-blue-500' 
                  : 'hover:ring-2 hover:ring-gray-300'
              }`}
              onClick={() => setSelectedImage(image)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image ? 
                  `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${image}/view?project=679b0257003b758db270` :
                  "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
                }}
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
} 