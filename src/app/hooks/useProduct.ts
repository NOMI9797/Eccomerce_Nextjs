import { useQuery } from '@tanstack/react-query';
import { Client, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679b0257003b758db270');

const databases = new Databases(client);

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await databases.getDocument(
        '679b031a001983d2ec66',
        '67a2fec400214f3c891b',
        productId
      );
      return response;
    }
  });
}; 