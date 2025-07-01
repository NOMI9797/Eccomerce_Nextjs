"use client";

import React, { useState } from 'react';

interface ViewProductModalProps {
  product: {
    $id: string;
    Name: string;
    Price: number;
    CategoryId: string;
    Description: string;
    Images: string[];
    MainImage: string;
  };
  categoryName: string;
  isOpen: boolean;
  onClose: () => void;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({
  product,
  categoryName,
  isOpen,
  onClose
}) => {
  const [selectedImage, setSelectedImage] = useState(product.MainImage);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Product Details</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Product Title and Category */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.Name}</h1>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                {categoryName}
              </span>
              <span className="text-2xl font-bold text-green-600">
                ${product.Price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Main Image */}
            <div className="col-span-1 lg:col-span-2">
              <img
                src={selectedImage ? 
                  `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${selectedImage}/view?project=679b0257003b758db270` :
                  "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                alt="Product Image"
                className="w-full h-96 object-cover rounded-lg"
                onError={(e) => {
                  e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
                }}
              />
            </div>

            {/* Thumbnail Gallery */}
            <div className="col-span-1 lg:col-span-2">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                {product.Images.map((imageId, index) => (
                  <button
                    key={imageId}
                    onClick={() => setSelectedImage(imageId)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 
                      ${selectedImage === imageId ? 'border-blue-500' : 'border-transparent'}`}
                  >
                    <img
                      src={imageId ? 
                        `https://cloud.appwrite.io/v1/storage/buckets/67a32bbf003270b1e15c/files/${imageId}/view?project=679b0257003b758db270` :
                        "/images/pexels-shattha-pilabut-38930-135620.jpg"}
                      alt={`Product ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer border-2 border-transparent hover:border-blue-500 transition-colors"
                      onError={(e) => {
                        e.currentTarget.src = "/images/pexels-shattha-pilabut-38930-135620.jpg";
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 whitespace-pre-wrap text-lg leading-relaxed">
                  {product.Description}
                </p>
              </div>
            </div>

            {/* Side Details */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Product ID</h4>
                  <p className="text-sm font-mono text-gray-900">{product.$id}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Category</h4>
                  <p className="text-sm text-gray-900">{categoryName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Price</h4>
                  <p className="text-lg font-bold text-green-600">${product.Price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal; 