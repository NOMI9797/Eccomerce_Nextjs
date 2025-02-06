"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductImagesProps {
  images: string[];
}

export default function ProductImages({ images }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      <motion.div 
        className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <img
          src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${images[selectedImage]}/view?project=679b0257003b758db270`}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="grid grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
              selectedImage === index ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${image}/view?project=679b0257003b758db270`}
              alt={`Product thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
} 