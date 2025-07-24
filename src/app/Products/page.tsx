"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useProducts } from '@/app/hooks/useProducts';
import { useCategories } from '@/app/hooks/useCategories';
import { useCart } from '@/session/CartContext';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/appwrite/db/cart';
import Header from '@/components/Header';
import { FiShoppingCart, FiStar, FiArrowRight, FiChevronLeft, FiChevronRight, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import { Product, getStockStatus } from '@/app/Dashboard/ListProduct/types/product';
import { getStorageFileUrl } from '@/lib/appwrite-utils';
import Image from 'next/image';

export default function ProductsPage() {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAllProducts, setShowAllProducts] = useState<boolean>(false);
  const { addToCart } = useCart();

  // Ensure products is an array before filtering
  const productArray = Array.isArray(products) ? products as Product[] : [];

  const handleAddToCart = (product: Product) => {
    if (product.TrackStock && (product.Stock || 0) <= 0) {
      alert("This product is currently out of stock");
      return;
    }

    const cartItem: CartItem = {
      productId: product.$id,
      name: product.Name,
      price: product.Price,
      quantity: 1,
      image: product.MainImage
    };
    addToCart(cartItem);
  };

  const scrollToCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowAllProducts(false);
    
    // Scroll to the category section
    const element = document.getElementById(`category-${categoryId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Group products by category
  const productsByCategory = categories.reduce((acc, category) => {
    const categoryProducts = productArray.filter(product => product.CategoryId === category.$id);
    if (categoryProducts.length > 0) {
      acc[category.$id] = {
        category,
        products: categoryProducts.slice(0, 6) // Show max 6 products per category
      };
    }
    return acc;
  }, {} as Record<string, { category: { $id: string; CategoryName: string }; products: Product[] }>);

  // Filter products based on selected category
  const filteredProducts = selectedCategory === "all" 
    ? productArray 
    : productArray.filter(product => product.CategoryId === selectedCategory);

  // Get selected category name
  const selectedCategoryName = selectedCategory === "all" 
    ? "All Products" 
    : categories.find(cat => cat.$id === selectedCategory)?.CategoryName || "Products";

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Header />
      
      {/* Top Categories Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-8 overflow-x-auto">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setShowAllProducts(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                selectedCategory === "all" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.$id}
                onClick={() => scrollToCategory(category.$id)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors whitespace-nowrap ${
                  selectedCategory === category.$id 
                    ? "bg-blue-600 text-white" 
                    : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {category.CategoryName}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Simple Page Title */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {showAllProducts ? selectedCategoryName : "Our Products"}
          </motion.h1>
        </div>

        {/* Category Sections or All Products */}
        <div className="max-w-7xl mx-auto px-4 py-6 pb-16">
        {showAllProducts ? (
          // Show all products for selected category
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, productIndex) => {
              const stockStatus = product.TrackStock ? getStockStatus(product.Stock || 0, product.MinStock || 5) : 'not_tracked';
              const isOutOfStock = product.TrackStock && (product.Stock || 0) <= 0;
              
              return (
                <motion.div
                  key={product.$id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: productIndex * 0.05 }}
                  className="group"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600">
                    <Link href={`/Products/${product.$id}`}>
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={product.MainImage ? 
                            getStorageFileUrl(product.MainImage) :
                            "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                          alt={product.Name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={() => {
                            // Fallback is handled by the src prop
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Stock Status Badge */}
                        {product.TrackStock && (
                          <div className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full font-medium ${
                            stockStatus === 'out_of_stock' ? 'bg-red-500' :
                            stockStatus === 'low_stock' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}>
                            {stockStatus === 'out_of_stock' ? 'Out of Stock' :
                             stockStatus === 'low_stock' ? 'Low Stock' :
                             'In Stock'}
                          </div>
                        )}
                        
                        {/* Sale Badge */}
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Sale
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {product.Name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {product.Description}
                        </p>
                        
                        {/* Stock Information */}
                        {product.TrackStock && (
                          <div className="mb-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {product.Stock || 0} {(product.Stock || 0) === 1 ? 'item' : 'items'} left
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-gray-900 dark:text-white">
                              Rs {product.Price.toFixed(2)}
                            </span>
                            {product.OriginalPrice && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                Rs {product.OriginalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">4.5</span>
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
                        disabled={isOutOfStock}
                        className={`w-full transition-colors duration-200 ${
                          isOutOfStock 
                            ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                        size="sm"
                      >
                        <FiShoppingCart className="w-4 h-4 mr-2" />
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
                    // Show category sections
          Object.entries(productsByCategory).map(([categoryId, { category, products }], index) => (
            <motion.section
              key={categoryId}
              id={`category-${categoryId}`}
              className="mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
            {/* Category Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-3">{category.CategoryName}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Explore our {category.CategoryName.toLowerCase()} collection</p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FiChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button className="p-2 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <FiChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product, productIndex) => {
                const stockStatus = product.TrackStock ? getStockStatus(product.Stock || 0, product.MinStock || 5) : 'not_tracked';
                const isOutOfStock = product.TrackStock && (product.Stock || 0) <= 0;
                
                return (
                  <motion.div
                    key={product.$id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: productIndex * 0.05 }}
                    className="group"
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600">
                      <Link href={`/Products/${product.$id}`}>
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <Image
                            src={product.MainImage ? 
                              getStorageFileUrl(product.MainImage) :
                              "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                            alt={product.Name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={() => {
                              // Fallback is handled by the src prop
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* Stock Status Badge */}
                          {product.TrackStock && (
                            <div className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full font-medium ${
                              stockStatus === 'out_of_stock' ? 'bg-red-500' :
                              stockStatus === 'low_stock' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}>
                              {stockStatus === 'out_of_stock' ? 'Out of Stock' :
                               stockStatus === 'low_stock' ? 'Low Stock' :
                               'In Stock'}
                            </div>
                          )}
                          
                          {/* Sale Badge */}
                          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            Sale
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {product.Name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {product.Description}
                          </p>
                          
                          {/* Stock Information */}
                          {product.TrackStock && (
                            <div className="mb-3">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {product.Stock || 0} {(product.Stock || 0) === 1 ? 'item' : 'items'} left
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                                          <span className="font-bold text-lg text-gray-900 dark:text-white">
                              Rs {product.Price.toFixed(2)}
                            </span>
                            {product.OriginalPrice && (
                              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                                Rs {product.OriginalPrice.toFixed(2)}
                              </span>
                            )}
                            </div>
                            <div className="flex items-center gap-1">
                              <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">4.5</span>
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
                          disabled={isOutOfStock}
                          className={`w-full transition-colors duration-200 ${
                            isOutOfStock 
                              ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                              : 'bg-blue-600 hover:bg-blue-700'
                          } text-white`}
                          size="sm"
                        >
                          <FiShoppingCart className="w-4 h-4 mr-2" />
                          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

                                      {/* View All Button */}
             <div className="text-center mt-8">
               <Button 
                 variant="outline" 
                 className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
                 onClick={() => {
                   setSelectedCategory(category.$id);
                   setShowAllProducts(true);
                 }}
               >
                 View All {category.CategoryName}
                 <FiArrowRight className="w-4 h-4 ml-2" />
               </Button>
             </div>
           </motion.section>
         ))
        )}
      </div>
      
      {/* Back to Categories Button */}
      {showAllProducts && (
        <div className="max-w-7xl mx-auto px-4 pb-8">
          <div className="text-center">
            <Button 
              variant="outline" 
              className="border-gray-600 text-gray-600 hover:bg-gray-50 dark:border-gray-400 dark:text-gray-400 dark:hover:bg-gray-900/20"
              onClick={() => {
                setShowAllProducts(false);
                setSelectedCategory("all");
              }}
            >
              ← Back to Categories
            </Button>
          </div>
        </div>
      )}
      </div>

      {/* Professional Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4 text-amber-400">Styleora</h3>
              <p className="text-gray-300 mb-6 max-w-md">
                Where Style Meets Aura - Your premier destination for fashion that speaks to your soul. 
                Discover curated collections that blend contemporary trends with timeless elegance.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <FiFacebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <FiTwitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <FiInstagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                  <FiYoutube className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-400">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/Products" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link href="/Products" className="text-gray-300 hover:text-amber-400 transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/Products" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Best Sellers
                  </Link>
                </li>
                <li>
                  <Link href="/Products" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Sale Items
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Shopping Cart
                  </Link>
                </li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-amber-400">Customer Service</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-300 hover:text-amber-400 transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center space-x-3">
                <FiMail className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-gray-300">support@styleora.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiPhone className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-gray-300">+1 (555) 123-4567</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <FiMapPin className="w-5 h-5 text-amber-400" />
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-gray-300">123 Fashion Street, Style City, SC 12345</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 Styleora. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="text-gray-400 hover:text-amber-400 text-sm transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 