import { Client, Databases, Account, ID } from 'appwrite';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('679b0257003b758db270');

export const account = new Account(client);
export const databases = new Databases(client);

// Real-time utilities
export const createRealtimeSubscription = (channel: string, callback: (response: any) => void) => {
  let isSubscribed = true;
  let retryCount = 0;
  const maxRetries = 3;

  const handleConnectionError = () => {
    if (isSubscribed && retryCount < maxRetries) {
      retryCount++;
      console.log(`Real-time connection lost, retrying... (${retryCount}/${maxRetries})`);
      setTimeout(subscribe, 2000 * retryCount); // Exponential backoff
    } else if (retryCount >= maxRetries) {
      console.error('Max retry attempts reached for real-time subscription');
    }
  };

  const subscribe = () => {
    if (!isSubscribed) return;

    try {
      const unsubscribe = client.subscribe(channel, (response) => {
        if (isSubscribed) {
          callback(response);
          retryCount = 0; // Reset retry count on successful message
        }
      });

      // Return cleanup function
      return () => {
        isSubscribed = false;
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } catch (error) {
      console.error('Error setting up real-time subscription:', error);
      handleConnectionError();
    }
  };

  return subscribe();
};

export { ID };
export default client;