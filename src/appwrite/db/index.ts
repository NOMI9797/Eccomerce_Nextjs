import { databases } from "../client";
import { Query, Models, ID } from "appwrite";

export const listDocuments = async (dbId: string, collectionId: string, queries: string[] = []) => {
  try {
    if (!dbId || !collectionId) {
      console.warn('Missing database or collection ID');
      return { documents: [] };
    }
    
    // Add timeout to prevent long delays
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const result = await databases.listDocuments(dbId, collectionId, queries);
      clearTimeout(timeoutId);
      return result;
    } catch (timeoutError) {
      clearTimeout(timeoutId);
      throw timeoutError;
    }
  } catch (error) {
    console.warn('Database operation failed:', error);
    // Return empty result instead of throwing to prevent app crashes
    return { documents: [] };
  }
};

export const createDocument = async (dbId: string, collectionId: string, data: Record<string, unknown>) => {
  try {
    if (!dbId || !collectionId) {
      console.warn('Missing database or collection ID');
      return null;
    }
    return await databases.createDocument(dbId, collectionId, ID.unique(), data);
  } catch (error) {
    console.warn('Database operation failed:', error);
    return null;
  }
};

export const updateDocument = async (dbId: string, collectionId: string, documentId: string, data: Record<string, unknown>) => {
  try {
    if (!dbId || !collectionId || !documentId) {
      console.warn('Missing database, collection, or document ID');
      return null;
    }
    return await databases.updateDocument(dbId, collectionId, documentId, data);
  } catch (error) {
    console.warn('Database operation failed:', error);
    return null;
  }
};

export const deleteDocument = async (dbId: string, collectionId: string, documentId: string) => {
  try {
    if (!dbId || !collectionId || !documentId) {
      console.warn('Missing database, collection, or document ID');
      return null;
    }
    return await databases.deleteDocument(dbId, collectionId, documentId);
  } catch (error) {
    console.warn('Database operation failed:', error);
    return null;
  }
};

export const getDocument = async (dbId: string, collectionId: string, documentId: string) => {
  try {
    if (!dbId || !collectionId || !documentId) {
      console.warn('Missing database, collection, or document ID');
      return null;
    }
    
    // Add timeout to prevent long delays
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const result = await databases.getDocument(dbId, collectionId, documentId);
      clearTimeout(timeoutId);
      return result;
    } catch (timeoutError) {
      clearTimeout(timeoutId);
      throw timeoutError;
    }
  } catch (error) {
    console.warn('Database operation failed:', error);
    
    // Check if it's a network error
    if (error && typeof error === 'object' && 'message' in error) {
      const errorMessage = (error as { message: string }).message;
      if (errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('ERR_NETWORK')) {
        console.warn('Network error detected, returning null for document:', documentId);
        return null;
      }
    }
    
    return null;
  }
};

export type { Query, Models };

const db = {
  listDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument
};

export default db; 
