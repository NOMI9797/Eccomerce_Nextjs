import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/session/CartContext';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/appwrite/db/cart';
import { Product } from '@/app/Dashboard/ListProduct/types/product';

interface ProductInfoProps {
  product: Product;
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
    <div className="space-y-6">
      {/* Product Title */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {product.Name}
        </h1>
        <p className="text-lg text-gray-600">
          {product.Description}
        </p>
      </div>

      {/* Price */}
      <div className="flex items-baseline space-x-4">
        <span className="text-3xl font-bold text-gray-900">
          Rs {product.Price.toFixed(2)}
        </span>
        {product.OriginalPrice && (
          <span className="text-xl text-gray-500 line-through">
            Rs {product.OriginalPrice.toFixed(2)}
          </span>
        )}
        {product.OriginalPrice && (
          <span className="text-green-600 font-medium">
            Save Rs {(product.OriginalPrice - product.Price).toFixed(2)}
          </span>
        )}
        </div>

      {/* Quantity Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Quantity
        </label>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-2 rounded-md border border-gray-300 hover:border-gray-400 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
          >
            -
          </button>
          <span className="w-12 text-center font-medium text-gray-900">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="p-2 rounded-md border border-gray-300 hover:border-gray-400 text-gray-600 hover:bg-gray-50 transition-colors duration-200"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Button
          onClick={handleAddToCart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
        >
          Add to Cart
        </Button>
      </motion.div>

      {/* Product Details */}
      <div className="pt-6 border-t border-gray-200 space-y-4">
        <h3 className="text-lg font-medium text-gray-900">
          Product Details
        </h3>
        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500">Category</span>
            <span className="text-gray-900 font-medium">{product.CategoryName}</span>
            </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500">Availability</span>
            <span className="text-green-600 font-medium">In Stock</span>
            </div>
          <div className="flex justify-between py-3 border-b border-gray-100">
            <span className="text-gray-500">SKU</span>
            <span className="text-gray-900 font-medium">{product.$id}</span>
          </div>
        </div>
            </div>
          </div>
  );
} 