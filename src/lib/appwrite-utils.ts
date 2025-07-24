/**
 * Utility functions for Appwrite services
 */

/**
 * Generate a public URL for an Appwrite storage file
 * @param fileId The ID of the file in Appwrite storage
 * @returns The complete URL to view the file
 */
export function getStorageFileUrl(fileId: string): string {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const storageId = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

  if (!endpoint || !storageId || !projectId) {
    console.error('Missing Appwrite configuration for storage URLs');
    return '';
  }

  return `${endpoint}/storage/buckets/${storageId}/files/${fileId}/view?project=${projectId}`;
}

/**
 * Check if a URL is already a complete URL (http/https)
 * @param url The URL to check
 * @returns true if it's already a complete URL
 */
export function isCompleteUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

// Add environment check function
export const checkAppwriteConfig = () => {
  const config = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
    productsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID,
    categoriesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CATEGORIES_COLLECTION_ID,
    ordersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID,
    reviewsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID,
    notificationsCollectionId: process.env.NEXT_PUBLIC_APPWRITE_NOTIFICATIONS_COLLECTION_ID,
    storageBucketId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID,
  };

  const missing = Object.entries(config)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn('Missing Appwrite environment variables:', missing);
  } else {
    console.log('Appwrite configuration appears to be complete');
  }

  return config;
};

// Call this function on app startup
if (typeof window !== 'undefined') {
  checkAppwriteConfig();
} 