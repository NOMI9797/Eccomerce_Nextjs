import { Query } from 'appwrite';
import db from "../../../../appwrite/db";
import storage from "../../../../appwrite/storage";

export const deleteCategory = async (categoryId: string) => {
  try {
    // First, get all products with this category
    const productsResponse = await db.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
      [Query.equal('CategoryId', categoryId)]
    );

    // Delete all associated products and their images
    for (const product of productsResponse.documents) {
      // Delete product images from storage
      if (product.Images && Array.isArray(product.Images)) {
        await Promise.all(
          product.Images.map(async (imageId: string) => {
            try {
              await storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID!, imageId);
            } catch (error) {
              console.error('Error deleting image:', error);
            }
          })
        );
      }

      // Delete the product
      await db.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!,
        product.$id
      );
    }

    // Finally, delete the category
    await db.deleteDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID!,
      categoryId
    );

    return true;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}; 