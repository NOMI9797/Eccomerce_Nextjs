import { useQuery } from '@tanstack/react-query';
import db from "../../appwrite/db";

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await db.getDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
        productId
      );
      return response;
    }
  });
}; 