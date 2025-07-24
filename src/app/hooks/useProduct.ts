import { useQuery } from '@tanstack/react-query';
import db from "../../appwrite/db";

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
      const collectionId = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID;
      
      if (!databaseId || !collectionId) {
        throw new Error('Missing Appwrite configuration. Please check your environment variables.');
      }
      
      if (!productId) {
        throw new Error('Product ID is required');
      }
      
      console.log('Fetching product:', productId);
      
      try {
        const response = await db.getDocument(
          databaseId,
          collectionId,
          productId
        );
        
        if (!response) {
          throw new Error('Product not found');
        }
        
        console.log('Product fetched successfully:', response.Name);
        return response;
      } catch (error) {
        console.error('Error fetching product:', productId, error);
        throw error;
      }
    },
    retry: 2,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}; 