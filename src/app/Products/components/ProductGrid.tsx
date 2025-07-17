import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/session/CartContext';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/appwrite/db/cart';
import StarRating from '@/components/ui/StarRating';
import { useEffect, useState } from 'react';
import { reviewsService } from '@/appwrite/db/reviews';
import { ReviewStats } from '@/types/review';
import { FiStar } from 'react-icons/fi';
import { Product } from '@/app/Dashboard/ListProduct/types/product';

interface ProductGridProps {
  products: Product[];
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

interface ProductWithRating {
  $id: string;
  Name: string;
  Description: string;
  Price: number;
  MainImage: string;
  CategoryId: string;
  reviewStats?: ReviewStats | null;
}

export default function ProductGrid({ 
  products, 
  hasMore = false, 
  isLoading = false, 
  onLoadMore = () => {} 
}: ProductGridProps) {
  const { addToCart } = useCart();
  const [productsWithRatings, setProductsWithRatings] = useState<ProductWithRating[]>([]);

  useEffect(() => {
    const loadProductRatings = async () => {
      const productsWithStats = await Promise.all(
        products.map(async (product) => {
          try {
            const stats = await reviewsService.getProductReviewStats(product.$id);
            return { 
              $id: product.$id,
              Name: product.Name,
              Description: product.Description,
              Price: product.Price,
              MainImage: product.MainImage,
              CategoryId: product.CategoryId,
              reviewStats: stats 
            } as ProductWithRating;
          } catch (error) {
            console.error(`Error loading ratings for product ${product.$id}:`, error);
            return { 
              $id: product.$id,
              Name: product.Name,
              Description: product.Description,
              Price: product.Price,
              MainImage: product.MainImage,
              CategoryId: product.CategoryId,
              reviewStats: null 
            } as ProductWithRating;
          }
        })
      );
      setProductsWithRatings(productsWithStats);
    };

    loadProductRatings();
  }, [products]);

  const handleAddToCart = (product: ProductWithRating) => {
    const cartItem: CartItem = {
      productId: product.$id,
      name: product.Name,
      price: product.Price,
      quantity: 1,
      image: product.MainImage
    };
    addToCart(cartItem);
  };

  const cardVariants = {
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

  const hoverVariants = {
    rest: {
      scale: 1,
      rotateY: 0,
      boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)"
    },
    hover: {
      scale: 1.05,
      rotateY: 5,
      boxShadow: "0 0 40px rgba(0, 255, 255, 0.4), 0 0 80px rgba(147, 51, 234, 0.2)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsWithRatings.map((product, index) => (
          <motion.div
            key={product.$id}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <motion.div
              variants={hoverVariants}
              initial="rest"
              whileHover="hover"
              className="bg-black/60 backdrop-blur-sm border border-cyan-400/30 rounded-xl overflow-hidden hover:border-cyan-400 transition-all duration-300 group-hover:border-purple-400/50"
              style={{
                background: 'linear-gradient(145deg, rgba(0,0,0,0.8), rgba(30,30,30,0.8))'
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
                </div>
                
                <div className="p-4">
                  <motion.h3 
                    className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300"
                    style={{
                      textShadow: 'none'
                    }}
                    whileHover={{
                      textShadow: '0 0 10px rgba(0, 255, 255, 0.8)'
                    }}
                  >
                    {product.Name}
                  </motion.h3>
                  <p className="text-gray-400 line-clamp-2 mb-4 text-sm group-hover:text-gray-300 transition-colors duration-300">
                    {product.Description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <motion.span 
                      className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
                      whileHover={{
                        textShadow: '0 0 10px rgba(0, 255, 255, 0.6)'
                      }}
                    >
                      ${product.Price.toFixed(2)}
                    </motion.span>
                  </div>
                  {/* Rating Display */}
                  <div className="flex items-center gap-2 mb-3">
                    {product.reviewStats ? (
                      <>
                        <StarRating
                          rating={product.reviewStats.averageRating}
                          size="sm"
                          interactive={false}
                          showCount={false}
                        />
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <span className="font-medium text-yellow-500">
                            {product.reviewStats.averageRating.toFixed(1)}
                          </span>
                          <FiStar className="w-3 h-3 text-yellow-500" />
                          <span className="text-gray-500">
                            ({product.reviewStats.totalReviews})
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">No reviews yet</span>
                    )}
                  </div>
                </div>
              </Link>
              
              <div className="px-4 pb-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-0 py-2 font-semibold rounded-lg transition-all duration-300 relative overflow-hidden group"
                    style={{
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                    }}
                  >
                    <span className="relative z-10">Add to Cart</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{
                        boxShadow: '0 0 30px rgba(147, 51, 234, 0.4)'
                      }}
                    />
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating glow effect around card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </motion.div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-lg transition-all duration-300 flex items-center space-x-3 font-semibold"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 0 30px rgba(147, 51, 234, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            style={{
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.3)'
            }}
          >
            {isLoading ? (
              <>
                <motion.div 
                  className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <span>Load More Products</span>
                <motion.svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  whileHover={{ y: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </>
            )}
          </motion.button>
        </div>
      )}
    </div>
  );
} 