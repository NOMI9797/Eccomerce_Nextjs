"use client";

import React, { useState } from "react";
import AddProduct from "./AddProduct/page";
import ListProducts from "./ListProduct/page";

const Dashboard: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>("List Products");

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 bg-white shadow-lg">
        <h2 className="text-2xl font-bold text-center py-6">Dashboard</h2>
        <ul className="space-y-4 p-6">
          <li
            className={`cursor-pointer px-4 py-2 rounded-md ${
              selectedFeature === "Add Product" ? "bg-red-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setSelectedFeature("Add Product")}
          >
            Add Product
          </li>
          <li
            className={`cursor-pointer px-4 py-2 rounded-md ${
              selectedFeature === "List Products" ? "bg-red-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setSelectedFeature("List Products")}
          >
            List Products
          </li>
        </ul>
      </aside>

      {/* Main Section */}
      <main className="flex-1 p-8">
        {selectedFeature === "Add Product" && <AddProduct />}
        {selectedFeature === "List Products" && <ListProducts />}
      </main>
    </div>
  );
};

export default Dashboard;
