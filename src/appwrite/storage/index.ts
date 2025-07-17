import client from "../client";
import { Storage, ID } from "appwrite";

const storageInstance = new Storage(client);

export const createFile = (bucketId: string, file: File) => {
  return storageInstance.createFile(bucketId, ID.unique(), file);
};

export const deleteFile = (bucketId: string, fileId: string) => {
  return storageInstance.deleteFile(bucketId, fileId);
};

const storage = { createFile, deleteFile };

export default storage; 