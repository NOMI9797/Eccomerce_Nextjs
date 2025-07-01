"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProduct } from '@/app/hooks/useProduct';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import RelatedProducts from './components/RelatedProducts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Header from '@/components/Header';
import Link from 'next/link';
import { FiArrowLeft, FiHome, FiShoppingBag } from 'react-icons/fi';

export default function ProductDetails() {
  const params = useParams();
  const productId = params?.id as string;
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-5">
          <motion.div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%']
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        
        <div className="relative z-10 text-center space-y-6">
          <motion.div 
            className="w-20 h-20 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)'
            }}
          />
          <motion.p 
            className="text-cyan-300 text-xl font-medium"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading product details...
          </motion.p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-black">
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-5">
          <motion.div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <Header />
        
        <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
          <motion.div 
            className="text-center space-y-6 max-w-md mx-auto px-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-8xl mb-6">🔍</div>
            <motion.h2 
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400"
              style={{
                textShadow: '0 0 20px rgba(0, 255, 255, 0.3)'
              }}
            >
              Product Not Found
            </motion.h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              The product you're looking for doesn't exist or may have been removed.
            </p>
            <div className="space-y-4 pt-6">
              <Link href="/Products">
                <motion.button
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    boxShadow: '0 0 25px rgba(6, 182, 212, 0.4)'
                  }}
                >
                  <FiShoppingBag className="w-5 h-5" />
                  Browse All Products
                </motion.button>
              </Link>
              <Link href="/">
                <motion.button
                  className="w-full bg-transparent border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiHome className="w-5 h-5" />
                  Go Home
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/20 to-pink-900/20" />
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%']
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            animate={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              boxShadow: '0 0 8px #00ffff'
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      {/* Breadcrumb Navigation */}
      <motion.nav 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-2 text-sm">
          <Link href="/" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
            Home
          </Link>
          <span className="text-gray-500">/</span>
          <Link href="/Products" className="text-cyan-400 hover:text-cyan-300 transition-colors duration-300">
            Products
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-400 truncate max-w-xs">{product.Name}</span>
        </div>
      </motion.nav>

      {/* Back Button */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Link href="/Products">
          <motion.button
            className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 group"
            whileHover={{ x: -5 }}
            transition={{ duration: 0.2 }}
          >
            <FiArrowLeft className="w-5 h-5 group-hover:transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Products</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Main Product Content */}
      <motion.main 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="bg-black/60 backdrop-blur-sm border border-cyan-400/20 rounded-2xl overflow-hidden"
             style={{
               background: 'linear-gradient(145deg, rgba(0,0,0,0.8), rgba(30,30,30,0.6))',
               boxShadow: '0 0 40px rgba(0, 255, 255, 0.1)'
             }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 lg:p-12">
            <ProductImages images={[product.MainImage, ...product.Images]} />
            <ProductInfo product={product} />
          </div>
        </div>

        <RelatedProducts categoryId={product.CategoryId} currentProductId={product.$id} />
      </motion.main>

      {/* Bottom Glow Effect */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none" />
    </div>
  );
} 