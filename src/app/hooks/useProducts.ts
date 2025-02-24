import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Query } from 'appwrite';
import db from "../../appwrite/db";
import { deleteProduct } from '../Dashboard/ListProduct/services/productService';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await db.listDocuments(
        '679b031a001983d2ec66',
        '67a2fec400214f3c891b',
        [Query.limit(100)]
      );
      return response.documents;
    },
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Cache persists for 30 minutes
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false // Use cached data when component remounts
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to add product');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, imageId }: { productId: string, imageId: string }) => {
      await deleteProduct(productId, [imageId]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}; 