import { ID, Query } from 'appwrite';
import { databases } from '../client';
import db from './index';
import { 
  Review, 
  ReviewStats, 
  ReviewInput, 
  ReviewUpdateData, 
  ReviewFilters, 
  UserReviewSummary 
} from '@/types/review';
import { account } from '../client';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const REVIEWS_COLLECTION_ID = '6876ac68001a9444a2ea';
const PRODUCTS_COLLECTION_ID = '67a2fec400214f3c891b';
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!;

// Reviews service class
export class ReviewsService {
  // Create a new review
  async createReview(reviewData: ReviewInput): Promise<Review> {
    try {
      const reviewId = ID.unique();
      const now = new Date().toISOString();

      // Check if user has already reviewed this product
      const existingReview = await this.getUserReviewForProduct(reviewData.userId, reviewData.productId);
      if (existingReview) {
        throw new Error('You have already reviewed this product');
      }

      // Check if user has purchased this product (for verified reviews)
      const isVerified = await this.checkVerifiedPurchase(reviewData.userId, reviewData.productId);

      // Get user data
      const user = await account.get();
      // Get user's name from account
      const userName = user.name;

      const review = await databases.createDocument(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        ID.unique(),
        {
          reviewId,
          productId: reviewData.productId,
          userId: reviewData.userId,
          userName: userName || 'User', // Use name from account or fallback to 'User'
          rating: reviewData.rating,
          title: reviewData.title,
          comment: reviewData.comment,
          isVerified,
          isHelpful: [],
          createdAt: now,
          updatedAt: now
        }
      );

      return review as unknown as Review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  // Get all reviews for a product
  async getProductReviews(productId: string, filters: ReviewFilters = {}): Promise<Review[]> {
    try {
      const queries = [
        Query.equal('productId', productId),
        Query.limit(filters.limit || 50),
        Query.offset(filters.offset || 0)
      ];

      // Apply rating filter
      if (filters.rating) {
        queries.push(Query.equal('rating', filters.rating));
      }

      // Apply verified filter
      if (filters.verified !== undefined) {
        queries.push(Query.equal('isVerified', filters.verified));
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          queries.push(Query.orderDesc('createdAt'));
          break;
        case 'oldest':
          queries.push(Query.orderAsc('createdAt'));
          break;
        case 'highest':
          queries.push(Query.orderDesc('rating'));
          break;
        case 'lowest':
          queries.push(Query.orderAsc('rating'));
          break;
        case 'helpful':
          // Note: This would require custom sorting logic
          queries.push(Query.orderDesc('createdAt'));
          break;
        default:
          queries.push(Query.orderDesc('createdAt'));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        queries
      );

      // Return reviews with userName already included
      return response.documents as unknown as Review[];
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  }

  // Get review statistics for a product
  async getProductReviewStats(productId: string): Promise<ReviewStats> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        [
          Query.equal('productId', productId),
          Query.limit(1000) // Increase if needed
        ]
      );

      const reviews = response.documents as unknown as Review[];
      const totalReviews = reviews.length;

      if (totalReviews === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          ratingBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
          verifiedReviews: 0,
          helpfulReviews: 0,
          recentReviews: 0
        };
      }

      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / totalReviews;

      // Calculate rating breakdown
      const ratingBreakdown = reviews.reduce((breakdown, review) => {
        breakdown[review.rating as keyof typeof breakdown]++;
        return breakdown;
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

      // Calculate additional stats
      const verifiedReviews = reviews.filter(review => review.isVerified).length;
      const helpfulReviews = reviews.filter(review => review.isHelpful.length > 0).length;
      
      // Count reviews from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentReviews = reviews.filter(review => 
        new Date(review.createdAt) > thirtyDaysAgo
      ).length;

      return {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        ratingBreakdown,
        verifiedReviews,
        helpfulReviews,
        recentReviews
      };
    } catch (error) {
      console.error('Error fetching review stats:', error);
      throw error;
    }
  }

  // Get user's review for a specific product
  async getUserReviewForProduct(userId: string, productId: string): Promise<Review | null> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.equal('productId', productId),
          Query.limit(1)
        ]
      );

      if (response.documents.length === 0) {
        return null;
      }

      return response.documents[0] as unknown as Review;
    } catch (error) {
      console.error('Error fetching user review:', error);
      return null;
    }
  }

  // Get all reviews by a user
  async getUserReviews(userId: string, limit = 20, offset = 0): Promise<UserReviewSummary> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        [
          Query.equal('userId', userId),
          Query.orderDesc('createdAt'),
          Query.limit(limit),
          Query.offset(offset)
        ]
      );

      const reviews = response.documents as unknown as Review[];

      // Populate product information
      const reviewsWithProduct = await Promise.all(
        reviews.map(async (review) => {
          try {
            const product = await db.getDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, review.productId);
            review.productName = product.Name;
          } catch (error) {
            console.warn('Could not fetch product data for review:', review.reviewId);
          }
          return review;
        })
      );

      // Calculate user's average rating
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

      return {
        totalReviews: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        reviews: reviewsWithProduct
      };
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  }

  // Update a review
  async updateReview(reviewId: string, updateData: ReviewUpdateData): Promise<Review> {
    try {
      const updatedReview = await databases.updateDocument(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        reviewId,
        {
          ...updateData,
          updatedAt: new Date().toISOString()
        }
      );

      return updatedReview as unknown as Review;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  // Delete a review
  async deleteReview(reviewId: string): Promise<void> {
    try {
      await databases.deleteDocument(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        reviewId
      );
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  // Mark review as helpful
  async toggleHelpful(reviewId: string, userId: string): Promise<Review> {
    try {
      // Get current review
      const currentReview = await databases.getDocument(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        reviewId
      ) as unknown as Review;

      const currentHelpful = currentReview.isHelpful || [];
      let newHelpful: string[];

      if (currentHelpful.includes(userId)) {
        // Remove user from helpful list
        newHelpful = currentHelpful.filter(id => id !== userId);
      } else {
        // Add user to helpful list
        newHelpful = [...currentHelpful, userId];
      }

      const updatedReview = await databases.updateDocument(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        reviewId,
        {
          isHelpful: newHelpful,
          updatedAt: new Date().toISOString()
        }
      );

      return updatedReview as unknown as Review;
    } catch (error) {
      console.error('Error toggling helpful:', error);
      throw error;
    }
  }

  // Check if user has purchased the product (for verified reviews)
  private async checkVerifiedPurchase(userId: string, productId: string): Promise<boolean> {
    try {
      // This would check the orders collection to see if user has purchased this product
      // For now, we'll return false - you can implement this based on your orders system
      const ordersResponse = await databases.listDocuments(
        DATABASE_ID,
        '686506050032acd2d80e', // Orders collection ID
        [
          Query.equal('userId', userId),
          Query.limit(100)
        ]
      );

      // Check if any order contains this product
      for (const order of ordersResponse.documents) {
        const items = JSON.parse(order.items || '[]');
        const hasProduct = items.some((item: any) => item.productId === productId);
        if (hasProduct) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.warn('Error checking verified purchase:', error);
      return false;
    }
  }

  // Get recent reviews (for admin dashboard)
  async getRecentReviews(limit = 10): Promise<Review[]> {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        REVIEWS_COLLECTION_ID,
        [
          Query.orderDesc('createdAt'),
          Query.limit(limit)
        ]
      );

      const reviews = response.documents as unknown as Review[];

      // Populate product information only, userName is already stored
      return await Promise.all(
        reviews.map(async (review) => {
          try {
            const product = await db.getDocument(DATABASE_ID, PRODUCTS_COLLECTION_ID, review.productId);
            review.productName = product.Name;
          } catch (error) {
            console.warn('Could not fetch product data for review:', review.reviewId);
          }
          return review;
        })
      );
    } catch (error) {
      console.error('Error fetching recent reviews:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const reviewsService = new ReviewsService();
export default reviewsService; 