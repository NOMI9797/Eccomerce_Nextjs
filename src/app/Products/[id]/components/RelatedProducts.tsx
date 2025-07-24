import { useProducts } from '@/app/hooks/useProducts';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

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

  return (
    <div className="space-y-8">
        {/* Section Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
            You Might Also Like
        </h2>
        <p className="text-gray-600">
            Discover more amazing products from the same category
          </p>
      </div>
        
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product, index) => (
            <motion.div
              key={product.$id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={`/Products/${product.$id}`}>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Product Image */}
                <div className="relative aspect-square">
                    <motion.img
                      src={product.MainImage ? 
                        `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${product.MainImage}/view?project=679b0257003b758db270` :
                        "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                      alt={product.Name}
                    className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
                      }}
                    />
                  {/* Sale Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Sale
                    </span>
                    </div>
                  </div>
                  
                {/* Product Info */}
                  <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {product.Name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">
                        Rs {product.Price.toFixed(2)}
                    </span>
                    {product.OriginalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        Rs {product.OriginalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                    </div>
                  </div>
                </Link>
            </motion.div>
          ))}
        </div>

      {/* Explore More Button */}
      <div className="text-center">
        <Link href="/Products">
            <motion.button
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            >
            Explore More Products
            <FiArrowRight className="ml-2" />
            </motion.button>
          </Link>
      </div>
    </div>
  );
} 