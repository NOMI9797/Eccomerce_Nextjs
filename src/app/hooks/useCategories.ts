import { useQuery } from '@tanstack/react-query';
import { Client, Databases, Models } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679b0257003b758db270');

const databases = new Databases(client);

interface Category extends Models.Document {
  CategoryName: string;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await databases.listDocuments(
        '679b031a001983d2ec66',
        '67a2ff0e0029b3db4449'
      );
      return response.documents as Category[];
    }
  });
}; 