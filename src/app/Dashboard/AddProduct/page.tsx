"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import db from "../../../appwrite/db";
import { useAddProduct } from '@/app/hooks/useProducts';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

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
          '679b031a001983d2ec66',
          '67a2ff0e0029b3db4449'
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
      
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      setLoadingText("Processing your request...");
      await addProductMutation.mutateAsync(formDataToSend);

      setLoadingText("Success! Redirecting...");
      router.push("/Dashboard?feature=List Products");
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  };

  return (
    <div className="w-full p-0">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-semibold mb-2">Add New Product</h1>
        <p className="text-muted-foreground text-sm mb-6">Fill out the form to add a new product to your store.</p>
        
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
                placeholder="Enter product description"
                className={cn(
                  "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                )}
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
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
              <Label htmlFor="image">Product Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                  multiple
                  disabled={loading}
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => document.getElementById('image')?.click()}
                >
                  Choose File
                </Button>
              </div>
              {images.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                      />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
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

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : "Save Product"}
          </Button>
        </form>

        {loading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg max-w-sm w-full">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                <p className="text-foreground text-center">{loadingText}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;
