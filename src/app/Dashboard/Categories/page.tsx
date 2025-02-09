"use client";

import React, { useEffect, useState } from "react";
import type { Models } from "appwrite";
import db from "../../../appwrite/db";
import AddCategoryModal from './components/AddCategoryModal';
import EditCategoryModal from "./components/EditCategoryModal";
import { deleteCategory } from './services/categoryService';
import { FiPlus } from "react-icons/fi";

interface Category extends Models.Document {
  CategoryName: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await db.listDocuments(
        '679b031a001983d2ec66',
        '67a2ff0e0029b3db4449'
      );
      setCategories(response.documents as Category[]);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(categoryId);
        setCategories(categories.filter(cat => cat.$id !== categoryId));
      } catch (err) {
        console.error('Error deleting category:', err);
      }
    }
  };

  const filteredCategories = categories.filter(category =>
    category.CategoryName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
          >
            <FiPlus className="w-5 h-5" />
            Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-3">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-xl px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="mt-3 bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.map((category) => (
              <tr key={category.$id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {category.CategoryName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(category.$id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={fetchCategories}
      />

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onUpdate={fetchCategories}
        />
      )}
    </div>
  );
};

export default Categories; 