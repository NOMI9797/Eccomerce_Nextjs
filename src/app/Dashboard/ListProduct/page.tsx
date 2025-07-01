"use client";

import React, { useEffect, useState } from "react";
import db from "../../../appwrite/db";
import { Query } from "appwrite";
import type { Models } from "appwrite";
import EditProductModal from './components/EditProductModal';
import { deleteProduct } from './services/productService';
import { useRouter } from "next/navigation";
import ViewProductModal from './components/ViewProductModal';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiPackage,
  FiGrid,
  FiTrendingUp,
  FiDollarSign
} from 'react-icons/fi';

interface Product extends Models.Document {
  Name: string;
  Price: number;
  CategoryId: string;
  Description: string;
  Images: string[];
  MainImage: string;
}

interface Category extends Models.Document {
  CategoryName: string;
}

const ListProducts: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await db.listDocuments(
          '679b031a001983d2ec66',
          '67a2ff0e0029b3db4449'
        );
        
        // Fetch products
        const productsResponse = await db.listDocuments(
          '679b031a001983d2ec66',
          '67a2fec400214f3c891b',
          [Query.limit(100)]
        );

        setCategories(categoriesResponse.documents as unknown as Category[]);
        setProducts(productsResponse.documents as Product[]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (productId: string, imageId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId, [imageId]);
        setProducts(products.filter(product => product.$id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateSuccess = async () => {
    try {
      setLoading(true);
      // Fetch both products and categories
      const [productsResponse, categoriesResponse] = await Promise.all([
        db.listDocuments(
          '679b031a001983d2ec66',
          '67a2fec400214f3c891b',
          [Query.limit(100)]
        ),
        db.listDocuments(
          '679b031a001983d2ec66',
          '67a2ff0e0029b3db4449'
        )
      ]);

      setProducts(productsResponse.documents as Product[]);
      setCategories(categoriesResponse.documents as unknown as Category[]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.$id === categoryId);
    return category ? category.CategoryName : 'Unknown Category';
  };

  const handleAddProduct = () => {
    router.push('/Dashboard/AddProduct');
  };

  const handleView = (product: Product) => {
    setViewingProduct(product);
  };

  // Filter products based on selected category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.CategoryId === selectedCategory;
    const matchesSearch = product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.Description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getProductStats = () => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, product) => sum + product.Price, 0);
    const categoriesCount = new Set(products.map(p => p.CategoryId)).size;
    return { totalProducts, totalValue, categoriesCount };
  };

  const stats = getProductStats();

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(56,189,248,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto mb-4"
            />
            <p className="text-gray-400 text-lg">Loading inventory...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(56,189,248,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="bg-red-500/20 border border-red-500/40 text-red-400 px-6 py-4 rounded-xl backdrop-blur-xl">
              <h3 className="font-semibold mb-2">Error Loading Products</h3>
              <p>{error}</p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Inventory Management
          </h1>
          <p className="text-gray-400">Manage your product catalog and inventory</p>
        </div>
        
        <motion.button 
          onClick={handleAddProduct}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 
                   text-white px-6 py-3 rounded-xl flex items-center gap-3 font-semibold
                   shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] 
                   transition-all duration-300 border border-green-400/20"
        >
          <FiPlus className="w-5 h-5" />
          Add New Product
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Total Products */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
          <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-6 text-center">
            <FiPackage className="text-3xl text-cyan-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
            <div className="text-gray-400 text-sm">Total Products</div>
          </div>
        </motion.div>

        {/* Total Value */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
          <div className="relative bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-xl p-6 text-center">
            <FiDollarSign className="text-3xl text-purple-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">${stats.totalValue.toFixed(0)}</div>
            <div className="text-gray-400 text-sm">Total Value</div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
          <div className="relative bg-black/60 backdrop-blur-xl border border-pink-500/30 rounded-xl p-6 text-center">
            <FiGrid className="text-3xl text-pink-400 mx-auto mb-3" />
            <div className="text-2xl font-bold text-white">{stats.categoriesCount}</div>
            <div className="text-gray-400 text-sm">Categories</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl blur opacity-50" />
        <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-black/60 border border-gray-600 rounded-xl text-white 
                         placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 
                         transition-all duration-300"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <FiFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full lg:w-64 pl-12 pr-10 py-3 bg-black/60 border border-gray-600 rounded-xl text-white 
                         focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.$id} value={category.$id}>
                    {category.CategoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur opacity-50" />
        <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl overflow-hidden
                      hover:shadow-[0_0_40px_rgba(34,211,238,0.2)] transition-all duration-500">
          
          {/* Table Header */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <FiPackage className="text-cyan-400" />
              Product Inventory ({filteredProducts.length} items)
            </h2>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead className="bg-gray-800/30">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/30">
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.$id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-800/30 transition-colors group/row"
                    >
                      {/* Product Info */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 relative group">
                            <img
                              className="h-12 w-12 rounded-xl object-cover border border-cyan-400/20 
                                       group-hover:border-cyan-400/60 transition-colors"
                              src={product.MainImage ? 
                                `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${product.MainImage}/view?project=679b0257003b758db270` : 
                                "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                              alt={product.Name}
                              onError={(e) => {
                                e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 to-transparent rounded-xl 
                                          opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-white group-hover/row:text-cyan-400 transition-colors">
                              {product.Name}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Category */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                       bg-green-500/20 text-green-400 border border-green-500/30">
                          {getCategoryName(product.CategoryId)}
                        </span>
                      </td>
                      
                      {/* Price */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">
                          <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                            ${product.Price.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      
                      {/* Description */}
                      <td className="px-6 py-4 max-w-xs">
                        <div className="text-sm text-gray-300 truncate">
                          {product.Description}
                        </div>
                      </td>
                      
                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <motion.button 
                            onClick={() => handleView(product)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-400 
                                     rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                            title="View Details"
                          >
                            <FiEye className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button 
                            onClick={() => handleEdit(product)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-400 
                                     rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(147,51,234,0.3)]"
                            title="Edit Product"
                          >
                            <FiEdit className="w-4 h-4" />
                          </motion.button>
                          
                          <motion.button 
                            onClick={() => handleDelete(product.$id, product.MainImage)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 
                                     rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                            title="Delete Product"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* No results message */}
          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <FiPackage className="text-6xl text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Products Found</h3>
              <p className="text-gray-500">No products match your current search criteria.</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      {viewingProduct && (
        <ViewProductModal
          product={viewingProduct}
          categoryName={getCategoryName(viewingProduct.CategoryId)}
          isOpen={!!viewingProduct}
          onClose={() => setViewingProduct(null)}
        />
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ListProducts;
