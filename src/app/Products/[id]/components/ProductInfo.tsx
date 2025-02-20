import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '@/session/CartContext';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/appwrite/db/cart';

interface ProductInfoProps {
  product: any;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      productId: product.$id,
      name: product.Name,
      price: product.Price,
      quantity: quantity,
      image: product.MainImage
    };
    addToCart(cartItem);
  };

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <motion.h1 
          className="text-4xl font-bold text-gray-900"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {product.Name}
        </motion.h1>
        <motion.p 
          className="mt-4 text-3xl font-bold text-blue-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          ${product.Price.toFixed(2)}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
        <p className="text-gray-600 leading-relaxed">{product.Description}</p>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center space-x-4">
          <label className="text-gray-700 font-medium">Quantity:</label>
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              -
            </Button>
            <span className="px-4 py-1 border-x">{quantity}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span>Add to Cart</span>
        </Button>
      </motion.div>
    </motion.div>
  );
} 