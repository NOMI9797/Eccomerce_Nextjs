"use client";

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useProduct } from '@/app/hooks/useProduct';
import ProductImages from './components/ProductImages';
import ProductInfo from './components/ProductInfo';
import RelatedProducts from './components/RelatedProducts';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Header from '@/components/Header';
import Link from 'next/link';
import { FiArrowLeft, FiHome, FiRefreshCw } from 'react-icons/fi';
import ReviewStats from '@/components/ui/ReviewStats';
import ReviewCard from '@/components/ui/ReviewCard';
import ReviewForm from '@/components/ui/ReviewForm';
import { useAuth } from '@/session/AuthContext';
import { useState, useEffect as useReactEffect } from 'react';
import { Review, ReviewStats as ReviewStatsType } from '@/types/review';
import { reviewsService } from '@/appwrite/db/reviews';
import { Button } from '@/components/ui/button';
import { FiStar, FiMessageCircle, FiFilter } from 'react-icons/fi';
import { Product } from '@/app/Dashboard/ListProduct/types/product';

export default function ProductDetails() {
  const params = useParams();
  const productId = params?.id as string;
  const { data: product, isLoading, error } = useProduct(productId);
  const { user } = useAuth();
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStatsType | null>(null);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);

  // Load reviews data
  useReactEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const loadReviews = async () => {
    try {
      setReviewsLoading(true);
      const [reviewsData, statsData, userReviewData] = await Promise.all([
        reviewsService.getProductReviews(productId, {
          rating: selectedRatingFilter || undefined,
          limit: 20
        }),
        reviewsService.getProductReviewStats(productId),
        user ? reviewsService.getUserReviewForProduct(user.$id, productId) : null
      ]);

      setReviews(reviewsData);
      setReviewStats(statsData);
      setUserReview(userReviewData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmit = async () => {
    setShowReviewForm(false);
    await loadReviews();
  };

  const handleFilterChange = (rating: number | null) => {
    setSelectedRatingFilter(rating);
  };

  useReactEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [selectedRatingFilter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading product details...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Product ID: {productId}</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error ? 
              'Unable to load the product due to a network error. Please try again.' : 
              'The product you\'re looking for doesn\'t exist or has been removed.'
            }
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Product ID: {productId}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
            >
              <FiRefreshCw className="mr-2" />
              Try Again
            </button>
            <Link 
              href="/Products"
              className="inline-flex items-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
            >
              <FiArrowLeft className="mr-2" />
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <div className="relative z-20">
        <Header />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link 
                href="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200 flex items-center"
              >
                <FiHome className="w-4 h-4 mr-1" />
                Home
              </Link>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
            <li>
              <Link 
                href="/Products"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors duration-200"
              >
                Products
              </Link>
            </li>
            <li className="text-gray-400 dark:text-gray-500">/</li>
            <li className="text-gray-800 dark:text-white font-medium">{product.Name}</li>
          </ol>
        </nav>

        {/* Product Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-4"
            >
              <ProductImages images={[product.MainImage]} />
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-gray-800 dark:text-gray-100"
            >
              <ProductInfo product={product as Product} />
            </motion.div>
          </div>
        </div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <FiStar className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Customer Reviews
                </h2>
              </div>
              {user && !userReview && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  className="flex items-center gap-2"
                >
                  <FiMessageCircle className="w-4 h-4" />
                  Write Review
                </Button>
              )}
            </div>

            {/* Review Stats */}
            {reviewStats && (
              <div className="mb-8">
                <ReviewStats stats={reviewStats} />
              </div>
            )}

            {/* Rating Filter */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <FiFilter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Filter by rating:
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedRatingFilter === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(null)}
                >
                  All
                </Button>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <Button
                    key={rating}
                    variant={selectedRatingFilter === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleFilterChange(rating)}
                    className="flex items-center gap-1"
                  >
                    {rating} <FiStar className="w-3 h-3" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                                 {reviews.map((review) => (
                   <ReviewCard
                     key={review.$id}
                     review={review}
                     onHelpfulToggle={async (reviewId) => {
                       if (user) {
                         await reviewsService.toggleHelpful(reviewId, user.$id);
                         loadReviews();
                       }
                     }}
                     onEdit={userReview && userReview.$id === review.$id ? () => {
                       // Handle edit - reopen form with existing review
                       setShowReviewForm(true);
                     } : undefined}
                     onDelete={userReview && userReview.$id === review.$id ? async (reviewId) => {
                       await reviewsService.deleteReview(reviewId);
                       loadReviews();
                     } : undefined}
                   />
                 ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FiMessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Reviews Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {selectedRatingFilter 
                    ? `No reviews with ${selectedRatingFilter} star rating found.`
                    : 'Be the first to review this product!'
                  }
                </p>
                {user && !userReview && !selectedRatingFilter && (
                  <Button
                    onClick={() => setShowReviewForm(true)}
                    className="flex items-center gap-2"
                  >
                    <FiMessageCircle className="w-4 h-4" />
                    Write First Review
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Related Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12"
        >
          <RelatedProducts 
            categoryId={product.CategoryId} 
            currentProductId={productId} 
          />
        </motion.div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && user && (
        <ReviewForm
          isOpen={showReviewForm}
          onCancel={() => setShowReviewForm(false)}
          productName={product.Name}
          existingReview={userReview}
          onSubmit={async (data) => {
            try {
              if (userReview) {
                await reviewsService.updateReview(userReview.$id, data);
              } else {
                await reviewsService.createReview({
                  ...data,
                  userId: user.$id,
                  productId: productId
                });
              }
              await handleReviewSubmit();
            } catch (error) {
              console.error('Error submitting review:', error);
            }
          }}
        />
      )}
    </div>
  );
} 