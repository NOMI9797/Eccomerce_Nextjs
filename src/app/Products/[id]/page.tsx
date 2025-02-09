"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProduct } from '@/app/hooks/useProduct';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import RelatedProducts from './components/RelatedProducts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ProductDetails() {
  const params = useParams();
  const productId = params?.id as string;
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <p className="mt-2 text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <ProductImages images={[product.MainImage, ...product.Images]} />
            <ProductInfo product={product} />
          </div>
        </div>

        <RelatedProducts categoryId={product.CategoryId} currentProductId={product.$id} />
      </div>
    </div>
  );
} 