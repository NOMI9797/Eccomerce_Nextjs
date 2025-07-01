"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddProduct from "./AddProduct/page";
import ListProducts from "./ListProduct/page";
import Categories from "./Categories/page";
import { FiMenu, FiPackage, FiList, FiGrid, FiX, FiHome, FiBarChart, FiUsers, FiTrendingUp } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>("Dashboard Overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    {
      name: "Dashboard Overview",
      icon: <FiHome className="w-5 h-5" />,
    },
    {
      name: "Add Product",
      icon: <FiPackage className="w-5 h-5" />,
    },
    {
      name: "List Products",
      icon: <FiList className="w-5 h-5" />,
    },
    {
      name: "Categories",
      icon: <FiGrid className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(56,189,248,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05),transparent_50%)]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-40"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{
          width: isSidebarOpen ? "350px" : "80px",
        }}
        className="fixed left-0 top-0 h-full z-30 relative group"
      >
        {/* Sidebar glow effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-b from-cyan-500/20 to-purple-500/20 rounded-r-2xl blur opacity-50" />
        
        <div className="relative bg-black/60 backdrop-blur-xl border-r border-cyan-500/20 h-full
                      hover:border-cyan-400/40 transition-all duration-500 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-700/50 flex-shrink-0">
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                >
                  Dashboard
                </motion.h2>
              )}
            </AnimatePresence>
            <motion.button 
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 
                       text-cyan-400 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </motion.button>
          </div>
          
          {/* Menu Items */}
          <div className="flex-1 p-6 space-y-3 overflow-y-auto">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.button
                  whileHover={{ x: 5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center space-x-5 px-6 py-5 rounded-xl transition-all duration-300 group/item
                    ${selectedFeature === item.name 
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/40 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]" 
                      : "hover:bg-gray-800/50 text-gray-300 hover:text-white border border-transparent hover:border-gray-600"
                    }`}
                  onClick={() => setSelectedFeature(item.name)}
                >
                  <div className={`${selectedFeature === item.name ? 'text-cyan-400' : 'text-gray-400 group-hover/item:text-cyan-400'} transition-colors text-xl`}>
                    {item.icon}
                  </div>
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="font-semibold text-base flex-1 text-left"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            ))}
          </div>

          {/* Sidebar Footer */}
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 border-t border-gray-700/50 flex-shrink-0"
            >
              <div className="p-5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl border border-cyan-500/20">
                <p className="text-cyan-400 text-base font-semibold mb-1">Admin Panel</p>
                <p className="text-gray-400 text-sm">Manage your store</p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.aside>

      {/* Main Section */}
      <motion.main 
        initial={false}
        animate={{
          marginLeft: isSidebarOpen ? "350px" : "80px",
        }}
        className="flex-1 min-h-screen p-6 relative z-10"
      >
        <div className="max-w-[1600px] mx-auto">
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
              {selectedFeature === "Dashboard Overview" && (
                <div className="space-y-8">
                  {/* Header */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                      Dashboard Overview
                    </h1>
                    <p className="text-gray-400 text-lg">Monitor your store performance and manage operations</p>
                  </motion.div>

                  {/* Stats Grid */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Total Products */}
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
                      <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 text-center
                                    hover:border-cyan-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                        <FiPackage className="text-4xl text-cyan-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-gray-300">Total Products</h3>
                        <p className="text-4xl font-bold text-white mb-2">123</p>
                        <div className="flex items-center justify-center gap-1 text-green-400 text-sm">
                          <FiTrendingUp className="w-4 h-4" />
                          <span>+12% from last month</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Total Sales */}
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
                      <div className="relative bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 text-center
                                    hover:border-purple-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                        <FiBarChart className="text-4xl text-purple-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-gray-300">Total Sales</h3>
                        <p className="text-4xl font-bold text-white mb-2">$45.2K</p>
                        <div className="flex items-center justify-center gap-1 text-green-400 text-sm">
                          <FiTrendingUp className="w-4 h-4" />
                          <span>+8% from last month</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Total Customers */}
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
                      <div className="relative bg-black/60 backdrop-blur-xl border border-pink-500/30 rounded-2xl p-8 text-center
                                    hover:border-pink-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                        <FiUsers className="text-4xl text-pink-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-gray-300">Total Customers</h3>
                        <p className="text-4xl font-bold text-white mb-2">1,234</p>
                        <div className="flex items-center justify-center gap-1 text-green-400 text-sm">
                          <FiTrendingUp className="w-4 h-4" />
                          <span>+15% from last month</span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Pending Orders */}
                    <motion.div 
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="relative group"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500" />
                      <div className="relative bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-2xl p-8 text-center
                                    hover:border-yellow-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                        <FiList className="text-4xl text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-gray-300">Pending Orders</h3>
                        <p className="text-4xl font-bold text-white mb-2">23</p>
                        <div className="flex items-center justify-center gap-1 text-yellow-400 text-sm">
                          <span>Requires attention</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl blur opacity-50" />
                    <div className="relative bg-black/60 backdrop-blur-xl border border-cyan-500/20 rounded-2xl p-8">
                      <h2 className="text-2xl font-bold text-white mb-6 text-center">Quick Actions</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {menuItems.slice(1).map((item, index) => (
                          <motion.button
                            key={item.name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedFeature(item.name)}
                            className="p-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-xl border border-gray-600
                                     hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]
                                     text-left group/action"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            <div className="text-2xl text-cyan-400 group-hover/action:text-cyan-300 transition-colors mb-3">
                              {item.icon}
                            </div>
                            <h3 className="text-white font-semibold mb-2">{item.name}</h3>
                            <p className="text-gray-400 text-sm">
                              {item.name === "Add Product" && "Add new products to your inventory"}
                              {item.name === "List Products" && "View and manage existing products"}
                              {item.name === "Categories" && "Organize products into categories"}
                            </p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default Dashboard;
