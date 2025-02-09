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
      const response = await db.listDocuments(
        '679b031a001983d2ec66',
        '67a2ff0e0029b3db4449'
      );
      return response.documents as unknown as Category[];
    }
  });
}; 