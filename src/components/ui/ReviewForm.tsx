"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import StarRating from './StarRating';
import { cn } from '@/lib/utils';
import { Review, ReviewFormData, REVIEW_VALIDATION, REVIEW_CONSTANTS } from '@/types/review';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: string;
  productName: string;
  existingReview?: Review | null;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  isLoading?: boolean;
  className?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  productName,
  existingReview,
  onSubmit,
  onCancel,
  isOpen,
  isLoading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: '',
    comment: ''
  });
  const [errors, setErrors] = useState<{
    rating?: string;
    title?: string;
    comment?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Initialize form with existing review data if editing
  useEffect(() => {
    if (existingReview) {
      setFormData({
        rating: existingReview.rating,
        title: existingReview.title,
        comment: existingReview.comment
      });
    } else {
      setFormData({
        rating: 0,
        title: '',
        comment: ''
      });
    }
    setErrors({});
  }, [existingReview, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: {
      rating?: string;
      title?: string;
      comment?: string;
    } = {};

    // Rating validation
    if (formData.rating < REVIEW_VALIDATION.rating.min || formData.rating > REVIEW_VALIDATION.rating.max) {
      newErrors.rating = formData.rating === 0 ? 'Please select a rating' : 'Invalid rating';
    }

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < REVIEW_VALIDATION.title.minLength) {
      newErrors.title = `Title must be at least ${REVIEW_VALIDATION.title.minLength} characters`;
    } else if (formData.title.length > REVIEW_VALIDATION.title.maxLength) {
      newErrors.title = `Title must be less than ${REVIEW_VALIDATION.title.maxLength} characters`;
    }

    // Comment validation
    if (!formData.comment.trim()) {
      newErrors.comment = 'Review is required';
    } else if (formData.comment.length < REVIEW_VALIDATION.comment.minLength) {
      newErrors.comment = `Review must be at least ${REVIEW_VALIDATION.comment.minLength} characters`;
    } else if (formData.comment.length > REVIEW_VALIDATION.comment.maxLength) {
      newErrors.comment = `Review must be less than ${REVIEW_VALIDATION.comment.maxLength} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success(existingReview ? 'Review updated successfully' : 'Review submitted successfully');
      onCancel(); // Close the form
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: undefined }));
    }
  };

  const handleInputChange = (field: 'title' | 'comment', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const getRatingLabel = (rating: number) => {
    return REVIEW_CONSTANTS.RATING_LABELS[rating as keyof typeof REVIEW_CONSTANTS.RATING_LABELS] || '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          'bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto',
          className
        )}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {existingReview ? 'Edit Review' : 'Write a Review'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {productName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="p-2"
            >
              <FiX className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating Section */}
            <div>
              <Label className="text-base font-semibold text-gray-900 dark:text-white mb-3 block">
                Overall Rating
              </Label>
              <div className="flex items-center gap-4">
                <StarRating
                  rating={hoverRating || formData.rating}
                  size="xl"
                  interactive
                  onRatingChange={handleRatingChange}
                  onRatingHover={setHoverRating}
                  onRatingLeave={() => setHoverRating(0)}
                />
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {getRatingLabel(hoverRating || formData.rating)}
                </span>
              </div>
              {errors.rating && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <FiAlertCircle className="w-4 h-4" />
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Title Section */}
            <div>
              <Label htmlFor="title" className="text-base font-semibold text-gray-900 dark:text-white mb-2 block">
                Review Title
              </Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Summarize your review in a few words"
                className={cn(
                  'text-base',
                  errors.title && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
                maxLength={REVIEW_VALIDATION.title.maxLength}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.title ? (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Help others understand what you liked or didn't like
                  </p>
                )}
                <span className="text-sm text-gray-400">
                  {formData.title.length}/{REVIEW_VALIDATION.title.maxLength}
                </span>
              </div>
            </div>

            {/* Comment Section */}
            <div>
              <Label htmlFor="comment" className="text-base font-semibold text-gray-900 dark:text-white mb-2 block">
                Your Review
              </Label>
              <textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                placeholder="Tell others about your experience with this product..."
                rows={6}
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white resize-none text-base',
                  errors.comment && 'border-red-500 focus:border-red-500 focus:ring-red-500'
                )}
                maxLength={REVIEW_VALIDATION.comment.maxLength}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.comment ? (
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <FiAlertCircle className="w-4 h-4" />
                    {errors.comment}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Share your thoughts about quality, features, value, etc.
                  </p>
                )}
                <span className="text-sm text-gray-400">
                  {formData.comment.length}/{REVIEW_VALIDATION.comment.maxLength}
                </span>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Review Guidelines</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Be honest and helpful to other shoppers</li>
                <li>• Focus on the product's features and your experience</li>
                <li>• Keep it respectful and constructive</li>
                <li>• Avoid personal information or inappropriate content</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="flex items-center gap-2 px-6 py-3"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiCheck className="w-4 h-4" />
                )}
                {isSubmitting 
                  ? 'Submitting...' 
                  : existingReview 
                    ? 'Update Review' 
                    : 'Submit Review'
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-6 py-3"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewForm; 