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