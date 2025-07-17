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
      
      const response = await db.getDocument(
        databaseId,
        collectionId,
        productId
      );
      return response;
    }
  });
}; 