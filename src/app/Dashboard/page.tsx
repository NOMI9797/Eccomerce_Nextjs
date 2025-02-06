"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddProduct from "./AddProduct/page";
import ListProducts from "./ListProduct/page";
import Categories from "./Categories/page";
import { FiMenu, FiPackage, FiList, FiGrid, FiX, FiHome } from 'react-icons/fi';

const Dashboard: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>("List Products");
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{
          width: isSidebarOpen ? "256px" : "80px",
        }}
        className="fixed left-0 top-0 h-full bg-white shadow-sm z-30"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-semibold"
              >
                Dashboard
              </motion.h2>
            )}
          </AnimatePresence>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </motion.button>
        </div>
        
        <ul className="space-y-1 p-2">
          {menuItems.map((item) => (
            <motion.li key={item.name} whileHover={{ x: 5 }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  selectedFeature === item.name 
                    ? "bg-red-500 text-white" 
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => setSelectedFeature(item.name)}
              >
                {item.icon}
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
            </motion.li>
          ))}
        </ul>
      </motion.aside>

      {/* Main Section */}
      <motion.main 
        initial={false}
        animate={{
          marginLeft: isSidebarOpen ? "256px" : "80px",
        }}
        className="flex-1 min-h-screen p-3"
      >
        <div className="max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {selectedFeature === "Add Product" && <AddProduct />}
              {selectedFeature === "List Products" && <ListProducts />}
              {selectedFeature === "Categories" && <Categories />}
              {selectedFeature === "Dashboard Overview" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Dashboard Cards */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-6 rounded-lg shadow-sm"
                  >
                    <h3 className="text-lg font-semibold mb-2">Total Products</h3>
                    <p className="text-3xl font-bold text-red-500">123</p>
                  </motion.div>
                  {/* Add more dashboard cards */}
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
