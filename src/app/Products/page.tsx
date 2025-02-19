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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900">Outfitters</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
              <Link 
                href="/Products" 
                className="bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Products
              </Link>
              {isUserAdmin && (
                <Link 
                  href="/Dashboard" 
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Our Products
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Discover our collection of high-quality products
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <CategoryFilter 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Products Section */}
          <div className="flex-1">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <SearchBar 
                value={searchQuery}
                onChange={setSearchQuery}
              />
              <ProductSort 
                value={sortBy}
                onChange={setSortBy}
              />
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <ProductGrid products={sortedProducts} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 