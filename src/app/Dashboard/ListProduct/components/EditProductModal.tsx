"use client";

import React, { useState, useEffect, useCallback } from 'react';
import db from "../../../../appwrite/db";
import storage from "../../../../appwrite/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { FiPackage, FiAlertTriangle, FiStar, FiShield, FiThumbsUp, FiRefreshCw } from 'react-icons/fi';
import { Product, getStockStatus } from '../types/product';
import { reviewsService } from '@/appwrite/db/reviews';
import { ReviewStats, Review } from '@/types/review';
import { getStorageFileUrl } from '@/lib/appwrite-utils';
import Image from 'next/image';

interface EditProductModalProps {
  product: Product;
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
    // Stock Management Fields
    stock: product.Stock || 0,
    minStock: product.MinStock || 5,
    maxStock: product.MaxStock || null,
    trackStock: product.TrackStock !== undefined ? product.TrackStock : true,
  });
  const [existingImages, setExistingImages] = useState<string[]>(product.Images);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadReviews = useCallback(async () => {
    try {
      const reviews = await reviewsService.getProductReviews(product.$id, {
        limit: 10,
        sortBy: 'newest'
      });
      setReviews(reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  }, [product.$id]);

  useEffect(() => {
    setFormData({
      name: product.Name,
      price: product.Price,
      categoryId: product.CategoryId,
      description: product.Description,
      stock: product.Stock || 0,
      minStock: product.MinStock || 5,
      maxStock: product.MaxStock || null,
      trackStock: product.TrackStock !== undefined ? product.TrackStock : true,
    });
    setExistingImages(product.Images);
    
    // Fetch review statistics
    const fetchReviewStats = async () => {
      try {
        const stats = await reviewsService.getProductReviewStats(product.$id);
        setReviewStats(stats);
      } catch (error) {
        console.error('Error fetching review stats:', error);
      } finally {
        setReviewsLoading(false);
      }
    };
    
    fetchReviewStats();
    loadReviews();
  }, [product, loadReviews]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
        [name]: type === 'number' ? parseFloat(value) || 0 : value,
      }));
    }
  };

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
      // Validate stock fields if stock tracking is enabled
      if (formData.trackStock) {
        const stock = Number(formData.stock);
        const minStock = Number(formData.minStock);
        const maxStock = formData.maxStock ? Number(formData.maxStock) : null;

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

      // Delete removed images
      const removedImages = product.Images.filter(id => !existingImages.includes(id));
      await Promise.all(
        removedImages.map(imageId => 
                        storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!, imageId)
        )
      );

      // Upload new images
      const newImageIds = await Promise.all(
        newImages.map(async (image) => {
                      const uploadedFile = await storage.createFile(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!, image);
          return uploadedFile.$id;
        })
      );

      // Combine existing and new image IDs
      const allImageIds = [...existingImages, ...newImageIds];

      // Prepare update data
      const updateData: {
        Name: string;
        Price: number;
        CategoryId: string;
        Description: string;
        Images: string[];
        MainImage: string;
        Stock: number;
        MinStock: number;
        TrackStock: boolean;
        MaxStock?: number;
      } = {
        Name: formData.name,
        Price: formData.price,
        CategoryId: formData.categoryId,
        Description: formData.description,
        Images: allImageIds,
        MainImage: allImageIds[0], // First image becomes main image
        Stock: Number(formData.stock),
        MinStock: Number(formData.minStock),
        TrackStock: formData.trackStock,
      };

      // Add MaxStock only if it's provided
      if (formData.maxStock !== null && formData.maxStock !== undefined) {
        updateData.MaxStock = Number(formData.maxStock);
      }

      // Update product
      await db.updateDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
        product.$id,
        updateData
      );

      onUpdate();
      onClose();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update product";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderReviewStats = () => {
    if (reviewsLoading) {
      return (
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!reviewStats) {
      return (
        <div className="text-center p-6 text-muted-foreground">
          No reviews available
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{reviewStats.averageRating.toFixed(1)}</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        star <= reviewStats.averageRating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Based on {reviewStats.totalReviews} reviews
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold text-green-600">
                {reviewStats.verifiedReviews}
              </div>
              <p className="text-sm text-muted-foreground">Verified Reviews</p>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewStats.ratingBreakdown[rating as keyof typeof reviewStats.ratingBreakdown] || 0;
              const percentage = (count / reviewStats.totalReviews) * 100 || 0;
              
              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm">{rating}</span>
                    <FiStar className="w-3 h-3 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm text-right">{count}</div>
                </div>
              );
            })}
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <div className="text-2xl font-semibold text-blue-600">
                {reviewStats.helpfulReviews}
              </div>
              <p className="text-sm text-muted-foreground">Helpful Reviews</p>
            </div>
            <div>
              <div className="text-2xl font-semibold text-purple-600">
                {reviewStats.recentReviews}
              </div>
              <p className="text-sm text-muted-foreground">Recent Reviews</p>
            </div>
          </div>
        </div>

        {/* Recent Reviews List */}
        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Recent Reviews</h4>
            <Button variant="outline" size="sm" onClick={loadReviews} disabled={reviewsLoading}>
              <FiRefreshCw className={cn("w-4 h-4 mr-2", reviewsLoading && "animate-spin")} />
              Refresh
            </Button>
          </div>
          
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {reviews.map((review) => (
              <div key={review.$id} className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {review.userName?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{review.userName}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="font-medium">{review.title}</div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {review.isVerified && (
                    <span className="flex items-center gap-1 text-green-600">
                      <FiShield className="w-3 h-3" />
                      Verified Purchase
                    </span>
                  )}
                  {review.isHelpful?.length > 0 && (
                    <span className="flex items-center gap-1">
                      <FiThumbsUp className="w-3 h-3" />
                      {review.isHelpful.length} found helpful
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  // Calculate current stock status
  const currentStockStatus = getStockStatus(Number(formData.stock), Number(formData.minStock));

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
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
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
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
            </div>

            {/* Right Column - Stock Management */}
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-4">
                  <FiPackage className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Stock Management</h3>
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
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="font-medium">Enable stock tracking</span>
                  </label>
                  <p className="text-sm text-muted-foreground mt-1">
                    When enabled, stock levels will be tracked and managed automatically
                  </p>
                </div>

                {formData.trackStock && (
                  <div className="space-y-4">
                    {/* Current Stock */}
                    <div className="space-y-2">
                      <Label htmlFor="stock">Current Stock</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        value={formData.stock}
                        onChange={handleInputChange}
                        placeholder="0"
                        disabled={loading}
                      />
                    </div>

                    {/* Minimum Stock */}
                    <div className="space-y-2">
                      <Label htmlFor="minStock">Minimum Stock</Label>
                      <Input
                        id="minStock"
                        name="minStock"
                        type="number"
                        min="0"
                        value={formData.minStock}
                        onChange={handleInputChange}
                        placeholder="5"
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Alert when stock falls below this level
                      </p>
                    </div>

                    {/* Maximum Stock */}
                    <div className="space-y-2">
                      <Label htmlFor="maxStock">Maximum Stock</Label>
                      <Input
                        id="maxStock"
                        name="maxStock"
                        type="number"
                        min="0"
                        value={formData.maxStock || ''}
                        onChange={handleInputChange}
                        placeholder="Optional"
                        disabled={loading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum stock level (optional)
                      </p>
                    </div>

                    {/* Stock Status */}
                    <div className="p-3 bg-background rounded-md border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Stock Status:</span>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium",
                          currentStockStatus === 'in_stock' ? 'bg-green-100 text-green-800' :
                          currentStockStatus === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        )}>
                          {currentStockStatus === 'in_stock' ? 'In Stock' :
                           currentStockStatus === 'low_stock' ? 'Low Stock' :
                           'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Stock Warning */}
                    {currentStockStatus === 'low_stock' && (
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <FiAlertTriangle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-yellow-800 font-medium">
                            Low Stock Warning
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700 mt-1">
                          Current stock ({formData.stock}) is at or below minimum level ({formData.minStock})
                        </p>
                      </div>
                    )}

                    {currentStockStatus === 'out_of_stock' && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-center gap-2">
                          <FiAlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-red-800 font-medium">
                            Out of Stock
                          </span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          This product is currently out of stock
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-muted/50 p-6 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <FiStar className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-semibold">Review Statistics</h3>
            </div>
            {renderReviewStats()}
          </div>

          {/* Images Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Current Images</Label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {existingImages.map((imageId) => (
                  <div key={imageId} className="relative group">
                    <div className="w-full aspect-square rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg overflow-hidden relative">
                      <Image
                        src={getStorageFileUrl(imageId)}
                        alt="Product"
                        fill
                        className="object-cover"
                      />
                    </div>
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
                      <div className="w-full aspect-square rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg overflow-hidden relative">
                        <Image
                          src={URL.createObjectURL(image)}
                          alt={`New ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
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