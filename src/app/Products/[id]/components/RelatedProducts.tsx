import { useProducts } from '@/app/hooks/useProducts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiShoppingCart } from 'react-icons/fi';

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const { data: products = [] } = useProducts();
  
  const relatedProducts = products
    .filter(product => product.CategoryId === categoryId && product.$id !== currentProductId)
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15
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

  const cardHoverVariants = {
    rest: {
      scale: 1,
      rotateY: 0,
      boxShadow: "0 0 20px rgba(0, 255, 255, 0.1)"
    },
    hover: {
      scale: 1.03,
      rotateY: 2,
      boxShadow: "0 0 40px rgba(0, 255, 255, 0.3), 0 0 80px rgba(147, 51, 234, 0.2)",
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.section 
      className="mt-20"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="border-t border-cyan-400/20 pt-16">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4"
            style={{
              textShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
            }}
          >
            You Might Also Like
          </motion.h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover more amazing products from the same category
          </p>
        </motion.div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product.$id}
              variants={itemVariants}
              className="group relative"
            >
              <motion.div
                variants={cardHoverVariants}
                initial="rest"
                whileHover="hover"
                className="bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-xl overflow-hidden hover:border-cyan-400 transition-all duration-300 group-hover:border-purple-400/50"
                style={{
                  background: 'linear-gradient(145deg, rgba(0,0,0,0.8), rgba(30,30,30,0.6))'
                }}
              >
                <Link href={`/Products/${product.$id}`}>
                  <div className="relative overflow-hidden">
                    <motion.img
                      src={product.MainImage ? 
                        `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${product.MainImage}/view?project=679b0257003b758db270` :
                        "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                      alt={product.Name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
                      }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    
                    {/* Neon overlay on image hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/20 group-hover:via-purple-500/10 group-hover:to-pink-500/20 transition-all duration-500" />
                    
                    {/* Glowing border effect */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-cyan-400/50 transition-all duration-300" />
                    
                    {/* View Details Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <motion.button
                        className="bg-black/80 backdrop-blur-sm border border-cyan-400 text-cyan-300 px-4 py-2 rounded-lg font-semibold"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                          boxShadow: '0 0 20px rgba(0, 255, 255, 0.4)'
                        }}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <motion.h3 
                      className="text-lg font-semibold text-white mb-2 truncate group-hover:text-cyan-300 transition-colors duration-300"
                      style={{
                        textShadow: 'none'
                      }}
                      whileHover={{
                        textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
                      }}
                    >
                      {product.Name}
                    </motion.h3>
                    
                    <div className="flex items-center justify-between">
                      <motion.span 
                        className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                        whileHover={{
                          textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
                        }}
                      >
                        ${product.Price.toFixed(2)}
                      </motion.span>
                      
                      <motion.button
                        className="opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-lg transition-all duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        style={{
                          boxShadow: '0 0 15px rgba(147, 51, 234, 0.4)'
                        }}
                      >
                        <FiShoppingCart className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Floating glow effect around card */}
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <Link href={`/Products?category=${categoryId}`}>
            <motion.button
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 group"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 30px rgba(6, 182, 212, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              style={{
                boxShadow: '0 0 25px rgba(6, 182, 212, 0.3)'
              }}
            >
              <span>Explore More Products</span>
              <motion.div
                className="flex items-center"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FiArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
} 