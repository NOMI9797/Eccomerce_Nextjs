"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from 'next/navigation';
import AddProduct from "./AddProduct/page";
import ListProducts from "./ListProduct/page";
import Categories from "./Categories/page";
import Orders from "./Orders/page";
import StockManagement from "./StockManagement/page";
import AdminRoute from "@/components/AdminRoute";
import { FiMenu, FiPackage, FiList, FiGrid, FiX, FiHome, FiBarChart, FiUsers, FiTrendingUp, FiTruck, FiExternalLink, FiShoppingCart, FiDollarSign, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';

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

  const handleHomeNavigation = () => {
    router.push('/');
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
    },
    {
      name: "Stock Management",
      icon: <FiShoppingCart className="w-5 h-5" />,
      color: "purple",
    },
  ];

  const stats = [
    { title: 'Total Products', value: '248', change: '+12%', icon: FiPackage, color: 'blue' },
    { title: 'Total Orders', value: '1,429', change: '+18%', icon: FiShoppingCart, color: 'green' },
    { title: 'Total Revenue', value: '$87,450', change: '+25%', icon: FiDollarSign, color: 'purple' },
    { title: 'Active Users', value: '2,847', change: '+8%', icon: FiUsers, color: 'orange' },
  ];

  const recentActivity = [
    { id: 1, type: 'order', message: 'New order #ORD-2024-001 received', time: '2 minutes ago' },
    { id: 2, type: 'product', message: 'Product "Wireless Headphones" updated', time: '15 minutes ago' },
    { id: 3, type: 'stock', message: 'Low stock alert: iPhone 15 Pro (5 left)', time: '30 minutes ago' },
    { id: 4, type: 'order', message: 'Order #ORD-2024-002 shipped', time: '1 hour ago' },
  ];

  const renderActiveFeature = () => {
    switch (selectedFeature) {
      case "Add Product":
        return <AddProduct />;
      case "List Products":
        return <ListProducts />;
      case "Categories":
        return <Categories />;
      case "Orders":
        return <Orders />;
      case "Stock Management":
        return <StockManagement />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.value}
                      </p>
                      <p className={`text-sm mt-2 ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50' :
                      stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/50' :
                      stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/50' :
                      'bg-orange-100 dark:bg-orange-900/50'
                    }`}>
                      <stat.icon className={`w-6 h-6 ${
                        stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                        stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                        stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                        'text-orange-600 dark:text-orange-400'
                      }`} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'order' ? 'bg-blue-500' :
                      activity.type === 'product' ? 'bg-green-500' :
                      'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );
    }
  };

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
          
          {/* Home Button */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-gray-600"
              onClick={handleHomeNavigation}
            >
              <div className="flex-shrink-0 text-gray-500 dark:text-gray-400">
                <FiExternalLink className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="font-medium"
                  >
                    Go to Homepage
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
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
              {renderActiveFeature()}
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
