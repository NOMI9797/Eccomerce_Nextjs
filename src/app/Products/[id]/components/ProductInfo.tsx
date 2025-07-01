import { motion } from 'framer-motion';
import { useState } from 'react';
import { useCart } from '@/session/CartContext';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/appwrite/db/cart';
import { FiShoppingCart, FiMinus, FiPlus, FiStar, FiHeart, FiShare2 } from 'react-icons/fi';

interface ProductInfoProps {
  product: any;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
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

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Product Title and Rating */}
      <motion.div variants={itemVariants}>
        <motion.h1 
          className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4"
          style={{
            textShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
          }}
        >
          {product.Name}
        </motion.h1>
        
        {/* Rating Section */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                <FiStar 
                  className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                />
              </motion.div>
            ))}
          </div>
          <span className="text-gray-400 text-sm">(4.2 out of 5)</span>
          <span className="text-cyan-400 text-sm">156 reviews</span>
        </div>

        {/* Price Section */}
        <div className="flex items-center space-x-4">
          <motion.p 
            className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400"
            whileHover={{
              textShadow: '0 0 20px rgba(0, 255, 255, 0.6)'
            }}
          >
            ${product.Price.toFixed(2)}
          </motion.p>
          <span className="text-gray-500 line-through text-xl">${(product.Price * 1.2).toFixed(2)}</span>
          <motion.span 
            className="bg-gradient-to-r from-green-400 to-emerald-400 text-black px-3 py-1 rounded-full text-sm font-semibold"
            animate={{
              boxShadow: [
                '0 0 0 rgba(16, 185, 129, 0.4)',
                '0 0 20px rgba(16, 185, 129, 0.4)',
                '0 0 0 rgba(16, 185, 129, 0.4)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Save 20%
          </motion.span>
        </div>
      </motion.div>

      {/* Product Details */}
      <motion.div
        variants={itemVariants}
        className="bg-black/40 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-6"
        style={{
          background: 'linear-gradient(145deg, rgba(0,0,0,0.6), rgba(30,30,30,0.4))'
        }}
      >
        <h2 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center">
          <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
          Product Details
        </h2>
        <p className="text-gray-300 leading-relaxed text-lg">{product.Description}</p>
      </motion.div>

      {/* Action Buttons Row */}
      <motion.div 
        variants={itemVariants}
        className="flex items-center space-x-4"
      >
        <motion.button
          onClick={() => setIsLiked(!isLiked)}
          className={`p-3 rounded-full border transition-all duration-300 ${
            isLiked 
              ? 'border-pink-400 bg-pink-400/20 text-pink-400' 
              : 'border-gray-600 text-gray-400 hover:border-pink-400/50 hover:text-pink-400'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={isLiked ? {
            boxShadow: '0 0 20px rgba(236, 72, 153, 0.4)'
          } : {}}
        >
          <FiHeart className="w-6 h-6" fill={isLiked ? 'currentColor' : 'none'} />
        </motion.button>
        
        <motion.button
          className="p-3 rounded-full border border-gray-600 text-gray-400 hover:border-cyan-400/50 hover:text-cyan-400 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FiShare2 className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Quantity and Add to Cart */}
      <motion.div
        variants={itemVariants}
        className="space-y-6"
      >
        {/* Quantity Selector */}
        <div className="space-y-3">
          <label className="text-cyan-300 font-semibold text-lg">Quantity:</label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-xl overflow-hidden">
              <motion.button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-cyan-400 hover:bg-cyan-400/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiMinus className="w-5 h-5" />
              </motion.button>
              
              <motion.span 
                className="px-6 py-3 text-white font-semibold text-lg min-w-[60px] text-center"
                key={quantity}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                {quantity}
              </motion.span>
              
              <motion.button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-cyan-400 hover:bg-cyan-400/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiPlus className="w-5 h-5" />
              </motion.button>
            </div>
            
            <div className="text-gray-400">
              <span className="text-sm">Available: </span>
              <span className="text-green-400 font-semibold">In Stock</span>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-6 px-8 rounded-xl text-lg font-bold transition-all duration-300 flex items-center justify-center space-x-3 relative overflow-hidden group"
            style={{
              boxShadow: '0 0 30px rgba(6, 182, 212, 0.4)'
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
            <FiShoppingCart className="w-6 h-6 relative z-10" />
            <span className="relative z-10">Add to Cart - ${(product.Price * quantity).toFixed(2)}</span>
            
            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 bg-white/20 rounded-full scale-0 group-active:scale-100 transition-transform duration-300"
            />
          </Button>
        </motion.div>

        {/* Additional Info */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-cyan-400/20"
          variants={itemVariants}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              <span className="text-green-400">Free shipping over $50</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
              <span className="text-blue-400">30-day return policy</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
              <span className="text-purple-400">Secure payment</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
              <span className="text-pink-400">Premium quality</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 