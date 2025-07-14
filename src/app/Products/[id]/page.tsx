"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProduct } from '@/app/hooks/useProduct';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import RelatedProducts from './components/RelatedProducts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Header from '@/components/Header';
import Link from 'next/link';
import { FiArrowLeft, FiHome } from 'react-icons/fi';

export default function ProductDetails() {
  const params = useParams();
  const productId = params?.id as string;
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link 
            href="/Products"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
            <FiArrowLeft className="mr-2" />
            Back to Products
              </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                href="/"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200 flex items-center"
              >
                <FiHome className="w-4 h-4 mr-1" />
                Home
              </Link>
            </li>
            <li className="text-gray-400 dark:text-gray-600">/</li>
            <li>
              <Link 
                href="/Products"
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
              >
                Products
              </Link>
            </li>
            <li className="text-gray-400 dark:text-gray-600">/</li>
            <li className="text-gray-900 dark:text-white font-medium">{product.Name}</li>
          </ol>
        </nav>

        {/* Product Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ProductImages images={[product.MainImage]} />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ProductInfo product={product} />
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <RelatedProducts 
            categoryId={product.CategoryId} 
            currentProductId={productId} 
          />
        </motion.div>
      </div>
    </div>
  );
} 