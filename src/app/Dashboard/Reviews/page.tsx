"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/session/AuthContext';
import { reviewsService } from '@/appwrite/db/reviews';
import { UserReviewSummary } from '@/types/review';
import ReviewCard from '@/components/ui/ReviewCard';
import { FiStar, FiEdit3, FiTrash2, FiAlertCircle } from 'react-icons/fi';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function UserReviews() {
  const { user } = useAuth();
  const [reviewSummary, setReviewSummary] = useState<UserReviewSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserReviews();
  }, []);

  const loadUserReviews = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const summary = await reviewsService.getUserReviews(user.$id);
      setReviewSummary(summary);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews');
      console.error('Error loading user reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await reviewsService.deleteReview(reviewId);
      await loadUserReviews();
    } catch (err: any) {
      console.error('Error deleting review:', err);
      setError('Failed to delete review');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <FiAlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!reviewSummary || reviewSummary.reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiStar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Reviews Yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          You haven't written any reviews yet. Start sharing your experiences with products you've purchased!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Your Reviews
          </h2>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <FiStar className="w-5 h-5 text-yellow-400" />
            <span className="font-medium">
              {reviewSummary.averageRating.toFixed(1)} Average Rating
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {reviewSummary.totalReviews}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              Total Reviews
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-100 dark:border-green-800">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {reviewSummary.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              Average Rating
            </div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-100 dark:border-purple-800">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {reviewSummary.reviews.filter(r => r.isVerified).length}
            </div>
            <div className="text-sm text-purple-600 dark:text-purple-400">
              Verified Reviews
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviewSummary.reviews.map((review) => (
            <ReviewCard
              key={review.$id}
              review={review}
              showProductName={true}
              onDelete={handleDeleteReview}
              onEdit={(review) => {
                // Handle edit - navigate to product page or open modal
                window.location.href = `/Products/${review.productId}`;
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
} 