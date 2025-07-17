"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import db from "../../../appwrite/db";
import { useAddProduct } from '@/app/hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FiUpload, FiX, FiImage, FiPackage, FiAlertTriangle } from 'react-icons/fi';

interface Category {
  $id: string;
  CategoryName: string;
}

const AddProduct = () => {
  const addProductMutation = useAddProduct();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    // Stock Management Fields
    stock: "0",
    minStock: "5",
    maxStock: "",
    trackStock: true,
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await db.listDocuments(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!
        );
        setCategories(response.documents as unknown as Category[]);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price || !formData.category || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    if (images.length === 0) {
      setError("Please select at least one image");
      return;
    }

    // Validate stock fields
    if (formData.trackStock) {
      const stock = parseInt(formData.stock);
      const minStock = parseInt(formData.minStock);
      const maxStock = formData.maxStock ? parseInt(formData.maxStock) : null;

      if (stock < 0) {
        setError("Stock quantity cannot be negative");
        return;
      }

      if (minStock < 0) {
        setError("Minimum stock level cannot be negative");
        return;
      }

      if (maxStock !== null && maxStock < minStock) {
        setError("Maximum stock level cannot be less than minimum stock level");
        return;
      }

      if (maxStock !== null && stock > maxStock) {
        setError("Current stock cannot exceed maximum stock level");
        return;
      }
    }

    setLoading(true);
    setLoadingText("Creating product...");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("description", formData.description);
      
      // Add stock management fields
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("minStock", formData.minStock);
      formDataToSend.append("maxStock", formData.maxStock);
      formDataToSend.append("trackStock", formData.trackStock.toString());
      
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      await addProductMutation.mutateAsync(formDataToSend);

      // Reset form
      setFormData({ 
        name: "", 
        price: "", 
        category: "", 
        description: "",
        stock: "0",
        minStock: "5",
        maxStock: "",
        trackStock: true,
      });
      setImages([]);
      
      // Navigate back to products list
      router.push('/Dashboard?feature=List Products');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create product";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Add New Product</h1>
        <p className="text-gray-600 dark:text-gray-400">Fill out the form to add a new product to your store.</p>
      </div>
        
      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
              Product Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name"
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
              Description *
            </Label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter product description"
              rows={4}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          {/* Price */}
          <div>
            <Label htmlFor="price" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
              Price *
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter product price"
              disabled={loading}
              className="w-full"
            />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
              Category *
            </Label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.$id} value={category.$id}>
                  {category.CategoryName}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Management Section */}
          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 mb-4">
              <FiPackage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Stock Management</h3>
            </div>
            
            {/* Track Stock Toggle */}
            <div className="mb-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="trackStock"
                  checked={formData.trackStock}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-4 h-4 text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2"
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">Enable stock tracking</span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                When enabled, stock levels will be tracked and managed automatically
              </p>
            </div>

            {formData.trackStock && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Stock */}
                <div>
                  <Label htmlFor="stock" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                    Current Stock *
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    disabled={loading}
                    className="w-full"
                  />
                </div>

                {/* Minimum Stock */}
                <div>
                  <Label htmlFor="minStock" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                    Minimum Stock *
                  </Label>
                  <Input
                    id="minStock"
                    name="minStock"
                    type="number"
                    min="0"
                    value={formData.minStock}
                    onChange={handleInputChange}
                    placeholder="5"
                    disabled={loading}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Alert when stock falls below this level
                  </p>
                </div>

                {/* Maximum Stock */}
                <div>
                  <Label htmlFor="maxStock" className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
                    Maximum Stock
                  </Label>
                  <Input
                    id="maxStock"
                    name="maxStock"
                    type="number"
                    min="0"
                    value={formData.maxStock}
                    onChange={handleInputChange}
                    placeholder="Optional"
                    disabled={loading}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Maximum stock level (optional)
                  </p>
                </div>
              </div>
            )}

            {/* Stock Warning */}
            {formData.trackStock && parseInt(formData.stock) <= parseInt(formData.minStock) && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                    Low Stock Warning
                  </span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Current stock ({formData.stock}) is at or below minimum level ({formData.minStock})
                </p>
              </div>
            )}
          </div>

          {/* Product Images */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">
              Product Images *
            </Label>
            
            {/* File Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors bg-gray-50 dark:bg-gray-700">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                disabled={loading}
                className="hidden"
              />
              <FiImage className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">Choose images or drag and drop</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">PNG, JPG, GIF up to 10MB</p>
              <Button 
                type="button" 
                variant="primary"
                onClick={() => document.getElementById('image')?.click()}
                disabled={loading}
                className="gap-2"
              >
                <FiUpload className="w-4 h-4" />
                Choose Files
              </Button>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Selected Images ({images.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 dark:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 dark:hover:bg-red-700"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Saving Product..." : "Save Product"}
            </Button>
          </div>
        </form>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-700 dark:text-gray-300 text-center">{loadingText}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
