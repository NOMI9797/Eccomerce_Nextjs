"use client";

import React, { useState } from 'react';
import { FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  showCount?: boolean;
  showLabel?: boolean;
  className?: string;
  onRatingChange?: (rating: number) => void;
  onRatingHover?: (rating: number) => void;
  onRatingLeave?: () => void;
  disabled?: boolean;
  color?: 'yellow' | 'blue' | 'green' | 'red' | 'purple';
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  showCount = false,
  showLabel = false,
  className = '',
  onRatingChange,
  onRatingHover,
  onRatingLeave,
  disabled = false,
  color = 'yellow'
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const displayRating = isHovering ? hoverRating : rating;

  const handleStarClick = (starRating: number) => {
    if (!interactive || disabled) return;
    onRatingChange?.(starRating);
  };

  const handleStarHover = (starRating: number) => {
    if (!interactive || disabled) return;
    setHoverRating(starRating);
    setIsHovering(true);
    onRatingHover?.(starRating);
  };

  const handleStarLeave = () => {
    if (!interactive || disabled) return;
    setIsHovering(false);
    onRatingLeave?.();
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'md':
        return 'w-5 h-5';
      case 'lg':
        return 'w-6 h-6';
      case 'xl':
        return 'w-8 h-8';
      default:
        return 'w-5 h-5';
    }
  };

  const getColorClasses = (color: string, filled: boolean) => {
    const baseClasses = 'transition-colors duration-200';
    
    if (filled) {
      switch (color) {
        case 'yellow':
          return `${baseClasses} text-yellow-400 fill-yellow-400`;
        case 'blue':
          return `${baseClasses} text-blue-400 fill-blue-400`;
        case 'green':
          return `${baseClasses} text-green-400 fill-green-400`;
        case 'red':
          return `${baseClasses} text-red-400 fill-red-400`;
        case 'purple':
          return `${baseClasses} text-purple-400 fill-purple-400`;
        default:
          return `${baseClasses} text-yellow-400 fill-yellow-400`;
      }
    } else {
      return `${baseClasses} text-gray-300 dark:text-gray-600`;
    }
  };

  const getRatingLabel = (rating: number) => {
    if (rating === 0) return 'No rating';
    if (rating <= 1) return 'Poor';
    if (rating <= 2) return 'Fair';
    if (rating <= 3) return 'Good';
    if (rating <= 4) return 'Very Good';
    return 'Excellent';
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Stars */}
      <div className="flex items-center gap-1">
        {Array.from({ length: maxRating }, (_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= Math.floor(displayRating);
          const isPartial = starRating === Math.ceil(displayRating) && displayRating % 1 !== 0;
          
          return (
            <div
              key={index}
              className={cn(
                'relative',
                interactive && !disabled && 'cursor-pointer',
                disabled && 'opacity-50'
              )}
              onClick={() => handleStarClick(starRating)}
              onMouseEnter={() => handleStarHover(starRating)}
              onMouseLeave={handleStarLeave}
            >
              <motion.div
                whileHover={interactive && !disabled ? { scale: 1.1 } : {}}
                whileTap={interactive && !disabled ? { scale: 0.95 } : {}}
                className="relative"
              >
                {/* Background star */}
                <FiStar
                  className={cn(
                    getSizeClasses(size),
                    getColorClasses(color, false)
                  )}
                />
                
                {/* Filled star */}
                {(isFilled || isPartial) && (
                  <FiStar
                    className={cn(
                      getSizeClasses(size),
                      getColorClasses(color, true),
                      'absolute top-0 left-0'
                    )}
                    style={{
                      clipPath: isPartial 
                        ? `inset(0 ${100 - ((displayRating % 1) * 100)}% 0 0)`
                        : undefined
                    }}
                  />
                )}
                
                {/* Hover effect */}
                {interactive && !disabled && (
                  <div className="absolute inset-0 rounded-full bg-yellow-400/20 scale-0 group-hover:scale-100 transition-transform duration-200" />
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Rating text */}
      {showCount && (
        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          {rating.toFixed(1)}
        </span>
      )}

      {/* Rating label */}
      {showLabel && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {getRatingLabel(displayRating)}
        </span>
      )}
    </div>
  );
};

// Compact version for small spaces
export const CompactStarRating: React.FC<{
  rating: number;
  count?: number;
  className?: string;
}> = ({ rating, count, className }) => {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= Math.floor(rating);
          const isPartial = starRating === Math.ceil(rating) && rating % 1 !== 0;
          
          return (
            <div key={index} className="relative">
              <FiStar className="w-3 h-3 text-gray-300 dark:text-gray-600" />
              {(isFilled || isPartial) && (
                <FiStar
                  className="w-3 h-3 text-yellow-400 fill-yellow-400 absolute top-0 left-0"
                  style={{
                    clipPath: isPartial 
                      ? `inset(0 ${100 - ((rating % 1) * 100)}% 0 0)`
                      : undefined
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {rating.toFixed(1)}
        {count && ` (${count})`}
      </span>
    </div>
  );
};

export default StarRating; 