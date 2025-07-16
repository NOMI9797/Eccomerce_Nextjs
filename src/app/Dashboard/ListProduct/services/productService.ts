import db from "../../../../appwrite/db";
import storage from "../../../../appwrite/storage";

export const deleteProduct = async (productId: string, imageIds: string[]) => {
  try {
    // Delete the product document
    await db.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
      productId
    );

    // Delete all associated images
    await Promise.all(
      imageIds.map(imageId => 
        storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!, imageId)
      )
    );

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}; 