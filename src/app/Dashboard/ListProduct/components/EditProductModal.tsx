"use client";

import React, { useState, useEffect } from 'react';
import { Client, Storage, Databases } from 'appwrite';

interface EditProductModalProps {
  product: {
    $id: string;
    Name: string;
    Price: number;
    CategoryId: string;
    Description: string;
    Image: string;
  };
  categories: Array<{ $id: string; CategoryName: string; }>;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679b0257003b758db270');

const storage = new Storage(client);
const databases = new Databases(client);

const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  categories,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    name: product.Name,
    price: product.Price,
    categoryId: product.CategoryId,
    description: product.Description,
  });
  const [newImage, setNewImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      name: product.Name,
      price: product.Price,
      categoryId: product.CategoryId,
      description: product.Description,
    });
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let imageId = product.Image;

      // Upload new image if provided
      if (newImage) {
        // Delete old image
        try {
          await storage.deleteFile('67a32bbf003270b1e15c', product.Image);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }

        // Upload new image
        const uploadedFile = await storage.createFile(
          '67a32bbf003270b1e15c',
          'unique()',
          newImage
        );
        imageId = uploadedFile.$id;
      }

      // Update product
      await databases.updateDocument(
        '679b031a001983d2ec66',  // Database ID
        '67a2fec400214f3c891b',  // Products Collection ID
        product.$id,
        {
          Name: formData.name,
          Price: formData.price,
          CategoryId: formData.categoryId,
          Description: formData.description,
          Image: imageId
        }
      );

      onUpdate();
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Edit Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              >
                {categories.map((category) => (
                  <option key={category.$id} value={category.$id}>
                    {category.CategoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Image (Optional)</label>
              <input
                type="file"
                onChange={(e) => setNewImage(e.target.files?.[0] || null)}
                className="mt-1 block w-full"
                accept="image/*"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal; 