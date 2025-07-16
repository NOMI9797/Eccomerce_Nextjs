"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiThumbsUp, FiShield, FiMoreHorizontal, FiEdit2, FiTrash2, FiFlag } from 'react-icons/fi';
import { Review } from '@/types/review';
import StarRating from './StarRating';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/session/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface ReviewCardProps {
  review: Review;
  onHelpfulToggle?: (reviewId: string) => Promise<void>;
  onEdit?: (review: Review) => void;
  onDelete?: (reviewId: string) => Promise<void>;
  onReport?: (reviewId: string) => void;
  className?: string;
  showProductName?: boolean;
  compact?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpfulToggle,
  onEdit,
  onDelete,
  onReport,
  className = '',
  showProductName = false,
  compact = false
}) => {
  const { user } = useAuth();
  const [isHelpfulLoading, setIsHelpfulLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isOwnReview = user?.$id === review.userId;
  const hasFoundHelpful = review.isHelpful?.includes(user?.$id || '');
  const helpfulCount = review.isHelpful?.length || 0;

  const handleHelpfulClick = async () => {
    if (!user || !onHelpfulToggle) return;
    
    setIsHelpfulLoading(true);
    try {
      await onHelpfulToggle(review.$id);
      toast.success(hasFoundHelpful ? 'Removed helpful vote' : 'Marked as helpful');
    } catch (error) {
      toast.error('Failed to update helpful status');
    } finally {
      setIsHelpfulLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this review?')) {
      setIsDeleting(true);
      try {
        await onDelete(review.$id);
        toast.success('Review deleted successfully');
      } catch (error) {
        toast.error('Failed to delete review');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getInitials = (name: string | undefined | null) => {
    if (!name || name === 'User') return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700',
          className
        )}
      >
        <div className="flex items-start gap-3">
          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {getInitials(review.userName)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-white">
                {review.userName || 'User'}
              </span>
              {review.isVerified && (
                <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                  <FiShield className="w-3 h-3" />
                  Verified Purchase
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span>{formatDate(review.createdAt)}</span>
              {showProductName && review.productName && (
                <>
                  <span>•</span>
                  <span className="font-medium">{review.productName}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
            {getInitials(review.userName)}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900 dark:text-white">
                {review.userName}
              </span>
              {review.isVerified && (
                <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                  <FiShield className="w-3 h-3" />
                  Verified Purchase
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
              <span>{formatDate(review.createdAt)}</span>
              {showProductName && review.productName && (
                <>
                  <span>•</span>
                  <span className="font-medium">{review.productName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Actions Menu */}
        {(isOwnReview || user) && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowActions(!showActions)}
              className="p-2"
            >
              <FiMoreHorizontal className="w-4 h-4" />
            </Button>

            {showActions && (
              <div className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 z-10 min-w-[120px]">
                {isOwnReview && onEdit && (
                  <button
                    onClick={() => {
                      onEdit(review);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit
                  </button>
                )}

                {isOwnReview && onDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                )}

                {!isOwnReview && onReport && (
                  <button
                    onClick={() => {
                      onReport(review.$id);
                      setShowActions(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiFlag className="w-4 h-4" />
                    Report
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={review.rating} size="lg" showLabel />
      </div>

      {/* Review Title */}
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
        {review.title}
      </h3>

      {/* Review Content */}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {review.comment}
      </p>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          {/* Helpful Button */}
          {user && !isOwnReview && onHelpfulToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleHelpfulClick}
              disabled={isHelpfulLoading}
              className={cn(
                'flex items-center gap-2 text-sm',
                hasFoundHelpful && 'text-blue-600 dark:text-blue-400'
              )}
            >
              <FiThumbsUp className={cn('w-4 h-4', hasFoundHelpful && 'fill-current')} />
              {isHelpfulLoading ? 'Loading...' : 'Helpful'}
              {helpfulCount > 0 && (
                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {helpfulCount}
                </span>
              )}
            </Button>
          )}

          {/* Helpful Count (for non-interactive display) */}
          {(!user || isOwnReview) && helpfulCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FiThumbsUp className="w-4 h-4" />
              <span>{helpfulCount} found this helpful</span>
            </div>
          )}
        </div>

        {/* Updated indicator */}
        {review.updatedAt !== review.createdAt && (
          <span className="text-xs text-gray-400 dark:text-gray-500">
            Updated {formatDate(review.updatedAt)}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ReviewCard; 