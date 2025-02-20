import { Client, Databases, Account, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('679b0257003b758db270');

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };

export default client;