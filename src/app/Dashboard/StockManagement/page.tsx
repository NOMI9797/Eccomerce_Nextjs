"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  FiAlertTriangle, 
  FiPackage, 
  FiTrendingUp, 
  FiTrendingDown, 
  FiRefreshCw, 
  FiEdit,
  FiEye,
  FiBarChart
} from 'react-icons/fi';
import { Product, getStockStatus, getStockBadgeColor } from '@/app/Dashboard/ListProduct/types/product';
import { notificationService } from '@/appwrite/db/notifications';
import { useProducts } from '@/app/hooks/useProducts';
import { useCategories } from '@/app/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';


const StockManagement = () => {
  const router = useRouter();
  const { data: products = [], refetch: refetchProducts } = useProducts();
  const { data: categories = [] } = useCategories();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState('all');
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

  // Ensure products is an array
  const productArray = Array.isArray(products) ? products as Product[] : [];

  // Calculate stock statistics
  const stockStats = productArray.reduce((stats, product) => {
    if (product.TrackStock) {
      const stockStatus = getStockStatus(product.Stock || 0, product.MinStock || 5);
      stats.totalTracked += 1;
      stats.totalStock += product.Stock || 0;
      
      if (stockStatus === 'out_of_stock') {
        stats.outOfStock += 1;
      } else if (stockStatus === 'low_stock') {
        stats.lowStock += 1;
      } else {
        stats.inStock += 1;
      }
    } else {
      stats.notTracked += 1;
    }
    return stats;
  }, {
    totalTracked: 0,
    totalStock: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    notTracked: 0
  });

  // Filter products based on search and filters
  const filteredProducts = productArray.filter(product => {
    const matchesSearch = product.Name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.CategoryId === selectedCategory;
    
    let matchesStockFilter = true;
    if (selectedStockFilter !== 'all') {
      if (selectedStockFilter === 'not_tracked') {
        matchesStockFilter = !product.TrackStock;
      } else if (product.TrackStock) {
        const stockStatus = getStockStatus(product.Stock || 0, product.MinStock || 5);
        matchesStockFilter = stockStatus === selectedStockFilter;
      } else {
        matchesStockFilter = false;
      }
    }
    
    return matchesSearch && matchesCategory && matchesStockFilter;
  });

  // Get category name
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.$id === categoryId);
    return category ? category.CategoryName : 'Unknown';
  };

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    try {
      await refetchProducts();
      const lowStockItems = await notificationService.getLowStockProducts();
      setLowStockProducts(lowStockItems);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit product
  const handleEditProduct = (productId: string) => {
    router.push(`/Dashboard?feature=List Products&edit=${productId}`);
  };

  // Handle view product
  const handleViewProduct = (productId: string) => {
    router.push(`/Products/${productId}`);
  };

  // Check low stock on mount
  useEffect(() => {
    const checkLowStock = async () => {
      try {
        const lowStockItems = await notificationService.getLowStockProducts();
        setLowStockProducts(lowStockItems);
      } catch (error) {
        console.error('Error checking low stock:', error);
      }
    };

    checkLowStock();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stock Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage your inventory levels</p>
        </div>
        <Button onClick={handleRefresh} disabled={loading} className="gap-2">
          <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stock Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Tracked */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tracked</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stockStats.totalTracked}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* In Stock */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Stock</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{stockStats.inStock}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mt-1">{stockStats.lowStock}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg flex items-center justify-center">
              <FiAlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{stockStats.outOfStock}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
              <FiTrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        {/* Total Stock Units */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Units</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stockStats.totalStock}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
              <FiBarChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <FiAlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              Low Stock Alerts ({lowStockProducts.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockProducts.slice(0, 6).map((product) => (
              <div key={product.$id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{product.Name}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {product.Stock || 0} units left (min: {product.MinStock || 5})
                    </p>
                  </div>
                  <Button
                    onClick={() => handleEditProduct(product.$id)}
                    size="sm"
                    variant="outline"
                    className="ml-2"
                  >
                    <FiEdit className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {lowStockProducts.length > 6 && (
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-4">
              And {lowStockProducts.length - 6} more products need attention...
            </p>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <Label htmlFor="search">Search Products</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Category Filter */}
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category.$id} value={category.$id}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <Label htmlFor="stock-filter">Stock Status</Label>
            <select
              id="stock-filter"
              value={selectedStockFilter}
              onChange={(e) => setSelectedStockFilter(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Products</option>
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="not_tracked">Not Tracked</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Min Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => {
                const stockStatus = product.TrackStock ? getStockStatus(product.Stock || 0, product.MinStock || 5) : 'not_tracked';
                
                return (
                  <motion.tr
                    key={product.$id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${product.MainImage}/view?project=679b0257003b758db270`}
                            alt={product.Name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{product.Name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                        {getCategoryName(product.CategoryId)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {product.TrackStock ? (
                        <span className="font-medium">{product.Stock || 0}</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Not tracked</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {product.TrackStock ? (product.MinStock || 5) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockBadgeColor(stockStatus)}`}>
                        {stockStatus === 'in_stock' ? 'In Stock' :
                         stockStatus === 'low_stock' ? 'Low Stock' :
                         stockStatus === 'out_of_stock' ? 'Out of Stock' :
                         'Not Tracked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                              Rs {product.Price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Button
                          onClick={() => handleViewProduct(product.$id)}
                          size="sm"
                          variant="outline"
                          className="p-2"
                        >
                          <FiEye className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleEditProduct(product.$id)}
                          size="sm"
                          variant="outline"
                          className="p-2"
                        >
                          <FiEdit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* No results message */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <FiPackage className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">No Products Found</h3>
            <p className="text-gray-400 dark:text-gray-500">No products match your current search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockManagement; 