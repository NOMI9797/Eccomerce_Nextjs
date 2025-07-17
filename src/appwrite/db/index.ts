import client from "../client";
import { Databases, Query, Models, ID } from "appwrite";

const databases = new Databases(client);

export const listDocuments = (dbId: string, collectionId: string, queries: string[] = []) => {
  return databases.listDocuments(dbId, collectionId, queries);
};

export const createDocument = (dbId: string, collectionId: string, data: Record<string, unknown>) => {
  return databases.createDocument(dbId, collectionId, ID.unique(), data);
};

export const updateDocument = (dbId: string, collectionId: string, documentId: string, data: Record<string, unknown>) => {
  return databases.updateDocument(dbId, collectionId, documentId, data);
};

export const deleteDocument = (dbId: string, collectionId: string, documentId: string) => {
  return databases.deleteDocument(dbId, collectionId, documentId);
};

export const getDocument = (dbId: string, collectionId: string, documentId: string) => {
  return databases.getDocument(dbId, collectionId, documentId);
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
