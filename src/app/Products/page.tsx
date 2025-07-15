"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
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
import { FiShoppingCart, FiStar, FiGrid, FiList, FiFilter, FiSearch } from 'react-icons/fi';

export default function ProductsPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { isUserAdmin } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    itemsPerPage: 20,
    initialPage: 1
  });

  const handlePageChange = (page: number) => {
    goToPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Compact Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 pt-16 pb-6">
        <div className="max-w-full mx-auto px-3 sm:px-4">
          <div className="text-center">
            <motion.h1 
              className="text-2xl md:text-3xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Our Products
            </motion.h1>
            <motion.p 
              className="text-blue-100 dark:text-purple-100 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Discover our curated collection of premium products
            </motion.p>
          </div>
        </div>
      </section>

      <div className="max-w-full mx-auto px-3 sm:px-4 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="sticky top-20">
              <CategoryFilter 
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Controls Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 mb-4">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <SearchBar 
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                  <div className="flex items-center gap-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                    >
                      <FiGrid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                    >
                      <FiList className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ProductSort 
                    value={sortBy}
                    onChange={setSortBy}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {totalItems} products
                  </span>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className={`grid gap-3 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6' 
                : 'grid-cols-1'
            }`}>
              {paginatedProducts.map((product, index) => (
                <motion.div
                  key={product.$id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group"
                >
                  <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}>
                    <Link href={`/Products/${product.$id}`} className={viewMode === 'list' ? 'flex flex-1' : ''}>
                      <div className={`relative overflow-hidden ${
                        viewMode === 'grid' ? 'aspect-[4/3]' : 'w-24 h-24 flex-shrink-0'
                      }`}>
                        <img
                          src={product.MainImage ? 
                            `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${product.MainImage}/view?project=679b0257003b758db270` :
                            "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                          alt={product.Name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                          Sale
                        </div>
                      </div>
                      
                      <div className={`p-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">
                          {product.Name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                          {product.Description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-base text-gray-900 dark:text-white">
                              ${product.Price.toFixed(2)}
                            </span>
                            {product.OriginalPrice && (
                              <span className="text-xs text-gray-500 line-through">
                                ${product.OriginalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-0.5">
                            <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">4.5</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className={`${viewMode === 'list' ? 'p-3 flex items-center' : 'px-3 pb-3'}`}>
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200 group"
                        size="sm"
                      >
                        <FiShoppingCart className="w-3 h-3 mr-1" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {paginatedProducts.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiSearch className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 