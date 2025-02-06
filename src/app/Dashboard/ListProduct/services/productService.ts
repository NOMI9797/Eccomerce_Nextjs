import { Client, Databases, Storage } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('679b0257003b758db270');

const databases = new Databases(client);
const storage = new Storage(client);

export const deleteProduct = async (productId: string, imageIds: string[]) => {
  try {
    // Delete the product document
    await databases.deleteDocument(
      '679b031a001983d2ec66',
      '67a2fec400214f3c891b',
      productId
    );

    // Delete all associated images
    await Promise.all(
      imageIds.map(imageId => 
        storage.deleteFile('67a32bbf003270b1e15c', imageId)
      )
    );

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}; 