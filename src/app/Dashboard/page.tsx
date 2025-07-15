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
import { FiMenu, FiPackage, FiList, FiGrid, FiX, FiHome, FiBarChart, FiUsers, FiTrendingUp, FiTruck, FiExternalLink, FiShoppingCart, FiDollarSign, FiAlertTriangle, FiRefreshCw, FiBell, FiActivity, FiPieChart } from 'react-icons/fi';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area
} from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

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

  // Analytics data - in a real app, this would come from your database
  const generateAnalyticsData = () => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(new Date(), i);
      days.push({
        date: format(date, 'MMM dd'),
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 50) + 10,
        customers: Math.floor(Math.random() * 30) + 5,
      });
    }
    return days;
  };

  const revenueData = generateAnalyticsData();

  const orderStatusData = [
    { name: 'Pending', value: 35, color: '#f59e0b' },
    { name: 'Processing', value: 45, color: '#3b82f6' },
    { name: 'Shipped', value: 125, color: '#10b981' },
    { name: 'Delivered', value: 200, color: '#059669' },
    { name: 'Cancelled', value: 15, color: '#ef4444' },
  ];

  const productPerformanceData = [
    { name: 'Electronics', sales: 4000, profit: 2400 },
    { name: 'Clothing', sales: 3000, profit: 1398 },
    { name: 'Books', sales: 2000, profit: 800 },
    { name: 'Home & Garden', sales: 2780, profit: 908 },
    { name: 'Sports', sales: 1890, profit: 480 },
    { name: 'Beauty', sales: 2390, profit: 1200 },
  ];

  const stockLevelsData = [
    { name: 'iPhone 15 Pro', stock: 45, minStock: 10, status: 'good' },
    { name: 'MacBook Air', stock: 8, minStock: 5, status: 'low' },
    { name: 'AirPods Pro', stock: 2, minStock: 15, status: 'critical' },
    { name: 'iPad Pro', stock: 25, minStock: 10, status: 'good' },
    { name: 'Apple Watch', stock: 15, minStock: 8, status: 'good' },
  ];

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

  // Custom chart colors
  const chartColors = {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    danger: '#ef4444',
    purple: '#8b5cf6',
    teal: '#06b6d4',
  };

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

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Revenue Overview
                  </h3>
                  <FiTrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.8}/>
                          <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Revenue']}
                        labelStyle={{ color: '#374151' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke={chartColors.primary}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Order Status Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Order Status
                  </h3>
                  <FiPieChart className="w-5 h-5 text-blue-500" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Performance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Category Performance
                  </h3>
                  <FiBarChart className="w-5 h-5 text-purple-500" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productPerformanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sales" fill={chartColors.secondary} name="Sales" />
                      <Bar dataKey="profit" fill={chartColors.accent} name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Stock Levels */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Stock Levels
                  </h3>
                  <FiPackage className="w-5 h-5 text-orange-500" />
                </div>
                <div className="space-y-4">
                  {stockLevelsData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {item.stock} / {item.minStock} min
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.status === 'critical' ? 'bg-red-500' :
                              item.status === 'low' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min((item.stock / item.minStock) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className={`ml-4 px-2 py-1 text-xs rounded-full ${
                        item.status === 'critical' ? 'bg-red-100 text-red-800' :
                        item.status === 'low' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
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
