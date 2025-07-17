import { useQuery } from '@tanstack/react-query';
import db from "../../appwrite/db";

interface Category {
  $id: string;
  CategoryName: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
      const collectionId = process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID;
      
      if (!databaseId || !collectionId) {
        throw new Error('Missing Appwrite configuration. Please check your environment variables.');
      }
      
      const response = await db.listDocuments(
        databaseId,
        collectionId
      );
      return response.documents as unknown as Category[];
    }
  });
}; 