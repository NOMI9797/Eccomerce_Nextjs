import { Client, Databases, Account, ID } from 'appwrite';

// Validate environment variables
const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID) {
  console.error('Missing Appwrite configuration:', {
    endpoint: APPWRITE_ENDPOINT ? 'Set' : 'Missing',
    projectId: APPWRITE_PROJECT_ID ? 'Set' : 'Missing'
  });
  throw new Error(
    'Appwrite configuration is missing. Please set NEXT_PUBLIC_APPWRITE_ENDPOINT and NEXT_PUBLIC_APPWRITE_PROJECT_ID environment variables.'
  );
}

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);

// Real-time utilities
export const createRealtime = () => {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
  return client;
};

export { ID };
export default client;