"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductGrid from './components/ProductGrid';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import ProductSort from './components/ProductSort';
import { useProducts } from '@/app/hooks/useProducts';
import { useCategories } from '@/app/hooks/useCategories';
import { useAuth } from '@/session/AuthContext';
import Header from '@/components/Header';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { isUserAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("featured");

  // Ensure products is an array before filtering
  const productArray = Array.isArray(products) ? products : [];

  const filteredProducts = productArray.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.CategoryId === selectedCategory;
    const matchesSearch = product.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.Description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.Price - b.Price;
      case "price-high":
        return b.Price - a.Price;
      case "name":
        return a.Name.localeCompare(b.Name);
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

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
        {[...Array(10)].map((_, i) => (
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
              duration: Math.random() * 15 + 15,
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

      {/* Hero Section */}
      <motion.section 
        className="relative z-10 bg-black/80 backdrop-blur-sm border-b border-cyan-400/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 sm:text-5xl lg:text-6xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                textShadow: '0 0 20px #00ffff'
              }}
            >
              Explore Our Collection
            </motion.h1>
            <motion.p 
              className="mt-4 max-w-3xl mx-auto text-lg text-cyan-300/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Discover premium quality products curated for the modern lifestyle
            </motion.p>
            
            {/* Stats Section */}
            <motion.div 
              className="mt-8 flex justify-center space-x-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400">{productArray.length}+</div>
                <div className="text-sm text-gray-400">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{categories.length}+</div>
                <div className="text-sm text-gray-400">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">4.9</div>
                <div className="text-sm text-gray-400">Rating</div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content Container */}
      <motion.main 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Filter and Search Controls */}
        <motion.section 
          className="mb-8"
          variants={itemVariants}
        >
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
            {/* Search Section */}
            <div className="flex-1 max-w-lg">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            
            {/* Sort Section */}
            <div className="flex items-center gap-4">
              <ProductSort 
                value={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>
          
          {/* Results Summary */}
          <motion.div 
            className="flex items-center justify-between py-4 px-6 bg-black/40 backdrop-blur-sm border border-cyan-400/20 rounded-lg"
            whileHover={{
              borderColor: 'rgba(0, 255, 255, 0.4)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.1)'
            }}
          >
            <div className="flex items-center space-x-4">
              <span className="text-cyan-300 font-medium">
                {sortedProducts.length} {sortedProducts.length === 1 ? 'Product' : 'Products'} Found
              </span>
              {selectedCategory !== "all" && (
                <motion.span 
                  className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-400/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {categories.find(cat => cat.$id === selectedCategory)?.CategoryName || 'Category'}
                </motion.span>
              )}
              {searchQuery && (
                <motion.span 
                  className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm border border-cyan-400/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  "{searchQuery}"
                </motion.span>
              )}
            </div>
            
            {/* Clear Filters */}
            {(selectedCategory !== "all" || searchQuery) && (
              <motion.button
                onClick={() => {
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear All Filters
              </motion.button>
            )}
          </motion.div>
        </motion.section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside 
            className="lg:col-span-1"
            variants={itemVariants}
          >
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </motion.aside>

          {/* Products Section */}
          <motion.section 
            className="lg:col-span-3"
            variants={itemVariants}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <motion.div 
                  className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{
                    boxShadow: '0 0 30px rgba(0, 255, 255, 0.5)'
                  }}
                />
                <motion.p 
                  className="text-cyan-300 text-lg"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Loading amazing products...
                </motion.p>
              </div>
            ) : sortedProducts.length > 0 ? (
              <ProductGrid products={sortedProducts} />
            ) : (
              <motion.div 
                className="flex flex-col items-center justify-center h-96 text-center space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl">🔍</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search criteria or browse all categories
                  </p>
                  <motion.button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchQuery("");
                    }}
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
                    }}
                  >
                    View All Products
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.section>
        </div>
      </motion.main>

      {/* Bottom Glow Effect */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none" />
    </div>
  );
} 