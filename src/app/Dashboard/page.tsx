"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from 'next/navigation';
import AddProduct from "./AddProduct/page";
import ListProducts from "./ListProduct/page";
import Categories from "./Categories/page";
import Orders from "./Orders/page";
import AdminRoute from "@/components/AdminRoute";
import { FiMenu, FiPackage, FiList, FiGrid, FiX, FiHome, FiBarChart, FiUsers, FiTrendingUp, FiTruck } from 'react-icons/fi';

const DashboardContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedFeature, setSelectedFeature] = useState<string>("Dashboard Overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Update selected feature based on URL parameter
  useEffect(() => {
    const feature = searchParams.get('feature');
    if (feature) {
      setSelectedFeature(feature);
    }
  }, [searchParams]);

  const handleFeatureSelect = (featureName: string) => {
    router.push(`/Dashboard?feature=${encodeURIComponent(featureName)}`);
  };

  const menuItems = [
    {
      name: "Dashboard Overview",
      icon: <FiHome className="w-5 h-5" />,
      color: "blue",
    },
    {
      name: "Add Product",
      icon: <FiPackage className="w-5 h-5" />,
      color: "green",
    },
    {
      name: "List Products",
      icon: <FiList className="w-5 h-5" />,
      color: "purple",
    },
    {
      name: "Categories",
      icon: <FiGrid className="w-5 h-5" />,
      color: "orange",
    },
    {
      name: "Orders",
      icon: <FiTruck className="w-5 h-5" />,
      color: "red",
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{
          width: isSidebarOpen ? "280px" : "80px",
        }}
        className="fixed left-0 top-0 h-full z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                    <FiHome className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h2>
                </motion.div>
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isSidebarOpen ? <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" /> : <FiMenu className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
            </button>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 p-4 space-y-2">
            {menuItems.map((item, index) => (
              <motion.button
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left
                  ${selectedFeature === item.name 
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-600" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                }`}
                onClick={() => handleFeatureSelect(item.name)}
              >
                <div className={`flex-shrink-0 ${
                  selectedFeature === item.name ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {item.icon}
                </div>
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          {/* Footer */}
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin Dashboard</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Manage your store efficiently</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        initial={false}
        animate={{
          marginLeft: isSidebarOpen ? "280px" : "80px",
        }}
        className="flex-1 min-h-screen"
      >
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedFeature === "Add Product" && <AddProduct />}
              {selectedFeature === "List Products" && <ListProducts />}
              {selectedFeature === "Categories" && <Categories />}
              {selectedFeature === "Orders" && <Orders />}
              {selectedFeature === "Dashboard Overview" && (
                <div className="space-y-8">
                  {/* Header */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Dashboard Overview
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Monitor your store performance and manage operations</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Products */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">123</p>
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm mt-2">
                            <FiTrendingUp className="w-4 h-4" />
                            <span>+12% from last month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                          <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>

                    {/* Total Sales */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">$45.2K</p>
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm mt-2">
                            <FiTrendingUp className="w-4 h-4" />
                            <span>+8% from last month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                          <FiBarChart className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                      </div>
                    </div>

                    {/* Total Customers */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Customers</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,234</p>
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm mt-2">
                            <FiTrendingUp className="w-4 h-4" />
                            <span>+15% from last month</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                          <FiUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                      </div>
                    </div>

                    {/* Pending Orders */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Orders</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">23</p>
                          <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-sm mt-2">
                            <span>Requires attention</span>
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                          <FiTruck className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {menuItems.slice(1).map((item, index) => (
                        <button
                          key={item.name}
                          onClick={() => handleFeatureSelect(item.name)}
                          className="p-6 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 text-left group"
                        >
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                            item.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' :
                            item.color === 'green' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
                            item.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400' :
                            item.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400' :
                            'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
                          }`}>
                            {item.icon}
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.name === "Add Product" && "Add new products to your inventory"}
                            {item.name === "List Products" && "View and manage existing products"}
                            {item.name === "Categories" && "Organize products into categories"}
                            {item.name === "Orders" && "View and manage customer orders"}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <AdminRoute>
      <DashboardContent />
    </AdminRoute>
  );
};

export default Dashboard;
