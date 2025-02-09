"use client";

import React, { useState, useEffect } from 'react';
import db from "../../../../appwrite/db";
import storage from "../../../../appwrite/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Edit Product</h2>
            <p className="text-muted-foreground text-sm">Update your product details below.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {error && (
          <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter product name"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className={cn(
                  "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                )}
                placeholder="Enter product description"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                placeholder="Enter product price"
                disabled={loading}
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.categoryId} 
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.$id} value={category.$id}>
                      {category.CategoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Current Images</Label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {existingImages.map((imageId) => (
                  <div key={imageId} className="relative group">
                    <img
                      src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${imageId}/view?project=679b0257003b758db270`}
                      alt="Product"
                      className="w-full aspect-square object-cover rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(imageId)}
                      className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-destructive"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-images">Add New Images</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="new-images"
                  type="file"
                  onChange={handleImageChange}
                  className="flex-1"
                  accept="image/*"
                  multiple
                  disabled={loading}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => document.getElementById('new-images')?.click()}
                >
                  Choose Files
                </Button>
              </div>

              {newImages.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {newImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-destructive/90 text-destructive-foreground rounded-full p-2.5 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg hover:bg-destructive"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Product'}
            </Button>
          </div>
        </form>

        {loading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-foreground text-center">Updating product...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProductModal; 