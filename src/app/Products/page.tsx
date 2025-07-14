"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ProductGrid from './components/ProductGrid';
import CategoryFilter from './components/CategoryFilter';
import SearchBar from './components/SearchBar';
import ProductSort from './components/ProductSort';
import Pagination from './components/Pagination';
import { useProducts } from '@/app/hooks/useProducts';
import { useCategories } from '@/app/hooks/useCategories';
import { usePagination } from '@/app/hooks/usePagination';
import { useAuth } from '@/session/AuthContext';
import { useCart } from '@/session/CartContext';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/appwrite/db/cart';
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

  // Pagination logic
  const {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    paginatedItems: paginatedProducts,
    goToPage
  } = usePagination({
    items: sortedProducts,
    itemsPerPage: 12,
    initialPage: 1
  });

  // Handle page change with scroll to top
  const handlePageChange = (page: number) => {
    goToPage(page);
    // Scroll to top of product grid smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    const cartItem: CartItem = {
      productId: product.$id,
      name: product.Name,
      price: product.Price,
      quantity: 1,
      image: product.MainImage
    };
    addToCart(cartItem);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="relative z-20">
        <Header />
        </div>

      {/* Hero Section */}
      <motion.section 
        className="relative z-10 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 pt-24 overflow-hidden"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/40 dark:bg-gray-900/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/10 dark:bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-20 right-20 w-24 h-24 bg-purple-500/10 dark:bg-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 left-1/4 w-20 h-20 bg-indigo-500/10 dark:bg-indigo-400/20 rounded-full blur-xl"></div>
        
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-400/30 rounded-full px-6 py-3 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 shadow-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <motion.div
                className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Curated Collection
            </motion.div>

            <motion.h1 
              className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl lg:text-7xl mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <span className="block">Discover Our</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Collection
              </span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Premium quality products curated for the modern lifestyle
            </motion.p>
            
            {/* Enhanced Stats Section */}
            <motion.div 
              className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div 
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{productArray.length}+</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Products</div>
              </motion.div>
              
              <motion.div 
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{categories.length}+</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Categories</div>
              </motion.div>
              
              <motion.div 
                className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/50 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">4.9</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Rating</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Main Content Container */}
      <motion.main 
        className="relative z-10 max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Sort Controls */}
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
                className="flex items-center justify-between py-4 px-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700"
            whileHover={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="flex items-center space-x-4">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                {totalItems} {totalItems === 1 ? 'Product' : 'Products'} Found
              </span>
              {selectedCategory !== "all" && (
                <motion.span 
                      className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {categories.find(cat => cat.$id === selectedCategory)?.CategoryName || 'Category'}
                </motion.span>
              )}
              {searchQuery && (
                <motion.span 
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
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
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                    Clear Filters
              </motion.button>
            )}
          </motion.div>
        </motion.section>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product, index) => (
                <motion.div
                  key={product.$id}
            variants={itemVariants}
                  className="group"
          >
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md border border-gray-200 dark:border-gray-700"
                  >
                    <Link href={`/Products/${product.$id}`}>
                      <div className="relative overflow-hidden aspect-square">
                        <motion.img
                          src={product.MainImage ? 
                            `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${product.MainImage}/view?project=679b0257003b758db270` :
                            "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                          alt={product.Name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
                          }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        />
                        {/* Sale badge if price is discounted */}
                        <div className="absolute top-2 right-2">
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Sale
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">{product.Name}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.Description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-gray-900 dark:text-white">${product.Price.toFixed(2)}</span>
                            {product.OriginalPrice && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">${product.OriginalPrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                    <div className="px-4 pb-4">
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition-all duration-200"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </motion.main>
    </div>
  );
} 