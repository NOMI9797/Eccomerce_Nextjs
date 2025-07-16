"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/session/AuthContext';
import { Review } from '@/types/review';
import { ReviewsService } from '@/appwrite/db/reviews';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiCheck, FiX, FiCalendar, FiPackage } from 'react-icons/fi';
import { format } from 'date-fns';

const reviewsService = new ReviewsService();

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadReviews();
    }
  }, [user]);

  const loadReviews = async () => {
    try {
      const response = await reviewsService.getUserReviews(user?.$id || '');
      setReviews(response.reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStarRating = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Your Reviews</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and view all your product reviews
          </p>
        </div>

        {/* Reviews List */}
        <div className="grid gap-6">
          <AnimatePresence>
            {reviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center"
              >
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  You haven't written any reviews yet.
                </p>
              </motion.div>
            ) : (
              reviews.map((review, index) => (
                <motion.div
                  key={review.$id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Review Header */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {getStarRating(review.rating)}
                        </div>
                        {review.isVerified && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                            <FiCheck className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </span>
                        )}
                      </div>

                      {/* Review Title */}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {review.title}
                      </h3>

                      {/* Review Content */}
                      <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                        {review.comment}
                      </p>

                      {/* Review Metadata */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <FiCalendar className="w-4 h-4 mr-1" />
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </div>
                        <div className="flex items-center">
                          <FiPackage className="w-4 h-4 mr-1" />
                          {review.productName || 'Product'}
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-700 dark:text-gray-300">
                            By {review.userName || 'User'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage; 