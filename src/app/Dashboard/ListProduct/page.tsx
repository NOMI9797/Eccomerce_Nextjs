"use client";

import React, { useEffect, useState } from "react";
import { Client, Databases, Query, Models } from "appwrite";
import EditProductModal from './components/EditProductModal';
import { deleteProduct } from './services/productService';
import { useRouter } from "next/navigation";

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

const ListProducts: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const handleDelete = async (productId: string, imageId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId, imageId);
        setProducts(products.filter(product => product.$id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateSuccess = async () => {
    try {
      setLoading(true);
      // Fetch all products again to get updated data
      const productsResponse = await databases.listDocuments(
        '679b031a001983d2ec66',
        '67a2fec400214f3c891b',
        [Query.limit(100)]
      );
      setProducts(productsResponse.documents as Product[]);
    } catch (err) {
      console.error('Error refreshing products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.$id === categoryId);
    return category ? category.CategoryName : 'Unknown Category';
  };

  const handleAddProduct = () => {
    router.push('/Dashboard/AddProduct');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
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

  // Filter products based on selected category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.CategoryId === selectedCategory;
    const matchesSearch = product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.Description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
        <button 
          onClick={handleAddProduct}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search inventory..."
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

      {/* Inventory Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.$id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={`https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${product.Image}/view?project=679b0257003b758db270`}
                        alt={product.Name}
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/40x40?text=Product";
                        }}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.Name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {getCategoryName(product.CategoryId)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.Price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 line-clamp-2">{product.Description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(product.$id, product.Image)}
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

      {/* No results message */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products found matching your criteria.
        </div>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          categories={categories}
          isOpen={!!editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default ListProducts;
