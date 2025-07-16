// Review system types
export interface Review {
  $id: string;
  reviewId: string;
  productId: string;
  userId: string;
  userName: string; // Required field now
  rating: number; // 1-5 stars
  title: string;
  comment: string;
  isVerified: boolean; // True if user purchased the product
  isHelpful: string[]; // Array of user IDs who found it helpful
  createdAt: string;
  updatedAt: string;
  // Optional populated fields
  userEmail?: string;
  productName?: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedReviews: number;
  helpfulReviews: number;
  recentReviews: number;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
}

export interface ReviewFilters {
  rating?: number;
  verified?: boolean;
  sortBy?: 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';
  limit?: number;
  offset?: number;
}

export interface ReviewInput {
  productId: string;
  userId: string;
  rating: number;
  title: string;
  comment: string;
  isVerified?: boolean;
}

export interface ReviewUpdateData {
  rating?: number;
  title?: string;
  comment?: string;
  isHelpful?: string[];
}

export interface ReviewResponse {
  success: boolean;
  message: string;
  data?: Review | Review[];
}

export interface UserReviewSummary {
  totalReviews: number;
  averageRating: number;
  reviews: Review[];
}

// Review validation rules
export const REVIEW_VALIDATION = {
  rating: {
    min: 1,
    max: 5,
    required: true
  },
  title: {
    minLength: 5,
    maxLength: 100,
    required: true
  },
  comment: {
    minLength: 10,
    maxLength: 1000,
    required: true
  }
};

// Review system constants
export const REVIEW_CONSTANTS = {
  HELPFUL_THRESHOLD: 3, // Minimum helpful votes to highlight
  VERIFIED_BADGE_TEXT: 'Verified Purchase',
  RATING_LABELS: {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent'
  }
}; 