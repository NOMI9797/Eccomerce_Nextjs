import { useQuery } from '@tanstack/react-query';
import db from "../../appwrite/db";

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await db.getDocument(
        '679b031a001983d2ec66',
        '67a2fec400214f3c891b',
        productId
      );
      return response;
    }
  });
}; 