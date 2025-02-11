import { Client, Account } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('679b0257003b758db270');

const account = new Account(client);

export default client;
export { account };