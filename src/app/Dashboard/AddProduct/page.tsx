"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AddProduct: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLoadingText("Initializing...");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("description", formData.description);
      
      images.forEach((image, index) => {
        formDataToSend.append(`images`, image);
      });

      setLoadingText("Processing your request...");
      const response = await fetch("/api/products", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to create product");
      }

      setLoadingText("Success! Redirecting...");
      
      // Clear form after successful submission
      setFormData({
        name: "",
        price: "",
        category: "",
        description: "",
      });
      setImages([]);
      
      // Navigate to dashboard
      router.push("/Dashboard");
      router.refresh();
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mb-4"></div>
              <p className="text-gray-700 text-center">{loadingText}</p>
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Product Images</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            multiple
            disabled={loading}
          />
          
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
            rows={4}
            required
            disabled={loading}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors
            ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Processing..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
