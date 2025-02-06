import { useProducts } from '@/app/hooks/useProducts';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface RelatedProductsProps {
  categoryId: string;
  currentProductId: string;
}

export default function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
  const { data: products = [] } = useProducts();
  
  const relatedProducts = products
    .filter(product => product.CategoryId === categoryId && product.$id !== currentProductId)
    .slice(0, 3);

  if (relatedProducts.length === 0) return null;

  return (
    <motion.div 
      className="mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <div className="border-t pt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          Related Products You Might Like
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product.$id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
              whileHover={{ y: -8 }}
              className="group bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <Link href={`/Products/${product.$id}`}>
                <div className="relative aspect-w-1 aspect-h-1">
                  <motion.img
                    src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${product.MainImage}/view?project=679b0257003b758db270`}
                    alt={product.Name}
                    className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x400?text=Product";
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                    {product.Name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      ${product.Price.toFixed(2)}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div 
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link href={`/Products?category=${categoryId}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <span>View More Products</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
} 