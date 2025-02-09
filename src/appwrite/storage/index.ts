import client from "../client";
import { Storage, ID } from "appwrite";

const storage = new Storage(client);

export const createFile = (bucketId: string, file: File) => {
  return storage.createFile(bucketId, ID.unique(), file);
};

export const deleteFile = (bucketId: string, fileId: string) => {
  return storage.deleteFile(bucketId, fileId);
};

export default { createFile, deleteFile }; 