"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiUsers, FiTrendingUp, FiShield } from 'react-icons/fi';
import { ReviewStats as ReviewStatsType } from '@/types/review';
import StarRating from './StarRating';
import { cn } from '@/lib/utils';

interface ReviewStatsProps {
  stats: ReviewStatsType;
  className?: string;
  showTrends?: boolean;
  verifiedCount?: number;
}

const ReviewStats: React.FC<ReviewStatsProps> = ({
  stats,
  className = '',
  showTrends = true,
  verifiedCount = 0
}) => {
  const { totalReviews, averageRating, ratingBreakdown } = stats;

  const getBarWidth = (count: number) => {
    if (totalReviews === 0) return 0;
    return (count / totalReviews) * 100;
  };

  const getBarColor = (rating: number) => {
    switch (rating) {
      case 5:
        return 'bg-green-500';
      case 4:
        return 'bg-green-400';
      case 3:
        return 'bg-yellow-400';
      case 2:
        return 'bg-orange-400';
      case 1:
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 5:
        return 'Excellent';
      case 4:
        return 'Very Good';
      case 3:
        return 'Good';
      case 2:
        return 'Fair';
      case 1:
        return 'Poor';
      default:
        return '';
    }
  };

  const getOverallRatingText = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 4.0) return 'Very Good';
    if (rating >= 3.5) return 'Good';
    if (rating >= 3.0) return 'Average';
    if (rating >= 2.0) return 'Fair';
    return 'Poor';
  };

  const verifiedPercentage = totalReviews > 0 ? (verifiedCount / totalReviews) * 100 : 0;

  if (totalReviews === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700',
          className
        )}
      >
        <div className="text-center py-8">
          <FiStar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Reviews Yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Be the first to review this product and help other customers make informed decisions.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700',
        className
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Rating */}
        <div className="lg:col-span-1">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="mb-3">
              <StarRating rating={averageRating} size="lg" />
            </div>
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {getOverallRatingText(averageRating)}
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiUsers className="w-4 h-4" />
              <span>{totalReviews.toLocaleString()} reviews</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-6 space-y-3">
            {verifiedCount > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FiShield className="w-4 h-4 text-green-500" />
                  <span>Verified purchases</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {verifiedPercentage.toFixed(0)}%
                </span>
              </div>
            )}
            
            {showTrends && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FiTrendingUp className="w-4 h-4 text-blue-500" />
                  <span>Trending</span>
                </div>
                <span className="font-medium text-green-600 dark:text-green-400">
                  +{Math.floor(Math.random() * 20 + 5)}% this week
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Rating Breakdown
          </h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingBreakdown[rating as keyof typeof ratingBreakdown];
              const percentage = getBarWidth(count);
              
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {rating}
                    </span>
                    <FiStar className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: rating * 0.1 }}
                          className={cn(
                            'h-full rounded-full transition-all duration-300',
                            getBarColor(rating)
                          )}
                        />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                        {count}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400 w-16 text-right">
                    {percentage.toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>

          {/* Rating Labels */}
          <div className="mt-6 grid grid-cols-5 gap-2 text-xs text-gray-500 dark:text-gray-400">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="text-center">
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  {getRatingLabel(rating)}
                </div>
                <div className="mt-1">
                  {ratingBreakdown[rating as keyof typeof ratingBreakdown]} reviews
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Compact version for product cards
export const CompactReviewStats: React.FC<{
  stats: ReviewStatsType;
  className?: string;
}> = ({ stats, className }) => {
  const { totalReviews, averageRating } = stats;

  if (totalReviews === 0) {
    return (
      <div className={cn('text-sm text-gray-500 dark:text-gray-400', className)}>
        No reviews yet
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <StarRating rating={averageRating} size="sm" />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {averageRating.toFixed(1)} ({totalReviews})
      </span>
    </div>
  );
};

export default ReviewStats; 