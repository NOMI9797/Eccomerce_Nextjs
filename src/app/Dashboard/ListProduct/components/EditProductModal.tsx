"use client";

import React, { useState, useEffect } from 'react';
import db from "../../../../appwrite/db";
import storage from "../../../../appwrite/storage";

interface EditProductModalProps {
  product: {
    $id: string;
    Name: string;
    Price: number;
    CategoryId: string;
    Description: string;
    Images: string[];
    MainImage: string;
  };
  categories: Array<{ $id: string; CategoryName: string; }>;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

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
  const [existingImages, setExistingImages] = useState<string[]>(product.Images);
  const [newImages, setNewImages] = useState<File[]>([]);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewImages(prev => [...prev, ...files]);
    }
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages(prev => prev.filter(id => id !== imageId));
  };

  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Delete removed images
      const removedImages = product.Images.filter(id => !existingImages.includes(id));
      await Promise.all(
        removedImages.map(imageId => 
          storage.deleteFile('67a32bbf003270b1e15c', imageId)
        )
      );

      // Upload new images
      const newImageIds = await Promise.all(
        newImages.map(async (image) => {
          const uploadedFile = await storage.createFile('67a32bbf003270b1e15c', image);
          return uploadedFile.$id;
        })
      );

      // Combine existing and new image IDs
      const allImageIds = [...existingImages, ...newImageIds];

      // Update product
      await db.updateDocument(
        '679b031a001983d2ec66',
        '67a2fec400214f3c891b',
        product.$id,
        {
          Name: formData.name,
          Price: formData.price,
          CategoryId: formData.categoryId,
          Description: formData.description,
          Images: allImageIds,
          MainImage: allImageIds[0] // First image becomes main image
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

            {/* Image Management Section */}
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
              <div className="grid grid-cols-4 gap-4 mb-4">
                {existingImages.map((imageId) => (
                  <div key={imageId} className="relative">
                    <img
                      src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${imageId}/view?project=679b0257003b758db270`}
                      alt="Product"
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(imageId)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Add New Images</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-1 block w-full"
                  accept="image/*"
                  multiple
                />
              </div>

              {newImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">New Images to Add</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {newImages.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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