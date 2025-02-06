import { Client, Databases, Storage, Query } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679b0257003b758db270');

const databases = new Databases(client);
const storage = new Storage(client);

export const deleteCategory = async (categoryId: string) => {
  try {
    // First, get all products with this category
    const productsResponse = await databases.listDocuments(
      '679b031a001983d2ec66',
      '67a2fec400214f3c891b',
      [Query.equal('CategoryId', categoryId)]
    );

    // Delete all associated products and their images
    for (const product of productsResponse.documents) {
      // Delete product images from storage
      if (product.Images && Array.isArray(product.Images)) {
        await Promise.all(
          product.Images.map(async (imageId: string) => {
            try {
              await storage.deleteFile('67a32bbf003270b1e15c', imageId);
            } catch (error) {
              console.error('Error deleting image:', error);
            }
          })
        );
      }

      // Delete the product
      await databases.deleteDocument(
        '679b031a001983d2ec66',
        '67a2fec400214f3c891b',
        product.$id
      );
    }

    // Finally, delete the category
    await databases.deleteDocument(
      '679b031a001983d2ec66',
      '67a2ff0e0029b3db4449',
      categoryId
    );

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}; 