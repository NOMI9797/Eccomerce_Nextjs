"use client";

import React, { useEffect, useState } from "react";
import { Client, Databases, Query, Models } from "appwrite";

// Initialize Appwrite
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679b0257003b758db270');

const databases = new Databases(client);

interface Product extends Models.Document {
  Name: string;
  Price: number;
  CategoryId: string;
  Description: string;
  Image: string;
}

interface Category extends Models.Document {
  CategoryName: string;
}

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (product.Image) {
      const url = `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${product.Image}/view?project=679b0257003b758db270`;
      setImageUrl(url);
    }
  }, [product.Image]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative h-48">
        <img 
          src={imageUrl || "https://via.placeholder.com/300x200?text=Product+Image"} 
          alt={product.Name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://via.placeholder.com/300x200?text=Product+Image";
          }}
        />
        <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 rounded-bl-lg">
          ${product.Price}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.Name}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.Description}</p>
        <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
};

const CategorySection: React.FC<{ category: Category; products: Product[] }> = ({ category, products }) => {
  return (
    <div className="mb-12">
      <div className="flex items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{category.CategoryName}</h2>
        <div className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
          {products.length} products
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.$id} product={product} />
        ))}
      </div>
    </div>
  );
};

const ListProducts: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all categories
        const categoriesResponse = await databases.listDocuments(
          '679b031a001983d2ec66',
          '67a2ff0e0029b3db4449'
        );
        
        // Fetch all products
        const productsResponse = await databases.listDocuments(
          '679b031a001983d2ec66',
          '67a2fec400214f3c891b',
          [
            Query.limit(100)
          ]
        );

        setCategories(categoriesResponse.documents as Category[]);
        setProducts(productsResponse.documents as Product[]);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products based on selected category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.CategoryId === selectedCategory;
    const matchesSearch = product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.Description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Our Products</h1>
        <div className="text-gray-600">
          Total Products: {filteredProducts.length}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div className="flex-shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-48 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.$id} value={category.$id}>
                {category.CategoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Display products in a grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.$id} product={product} />
        ))}
      </div>

      {/* No results message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products found matching your criteria.
        </div>
      )}
    </div>
  );
};

export default ListProducts;
