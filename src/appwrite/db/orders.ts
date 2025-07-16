import { ID, Query } from 'appwrite';
import { databases } from '../client';
import db from './index';
import { Product } from '@/app/Dashboard/ListProduct/types/product';

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const ordersCollectionId = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!;
const productsCollectionId = process.env.NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION_ID!;

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Type for data as stored in Appwrite
export interface OrderDocument {
  $id?: string;
  userId: string;
  orderNumber: string;
  items: string; // Stored as stringified JSON of OrderItem[]
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingFirstName: string;
  shippingLastName: string;
  shippingEmail: string;
  shippingPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingRegion: string;
  shippingCountry: string;
  shippingPostalCode: string;
  createdAt?: string;
  updatedAt?: string;
}

// Type for order in our application
export interface Order extends Omit<OrderDocument, 'items'> {
  items: OrderItem[]; // In our app, we work with the parsed array
}

// Stock management functions
const stockManager = {
  // Check if all items in order have sufficient stock
  async validateOrderStock(items: OrderItem[]): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    let isValid = true;

    for (const item of items) {
      try {
        const product = await db.getDocument(
          databaseId,
          productsCollectionId,
          item.productId
        ) as Product;

        if (product.TrackStock) {
          const availableStock = product.Stock || 0;
          
          if (availableStock <= 0) {
            errors.push(`${item.name} is out of stock`);
            isValid = false;
          } else if (item.quantity > availableStock) {
            errors.push(`${item.name}: Only ${availableStock} items available, but ${item.quantity} requested`);
            isValid = false;
          }
        }
      } catch (error) {
        errors.push(`Product ${item.name} not found`);
        isValid = false;
      }
    }

    return { isValid, errors };
  },

  // Deduct stock for order items
  async deductStock(items: OrderItem[]): Promise<void> {
    const stockUpdates: Promise<void>[] = [];

    for (const item of items) {
      const stockUpdate = async () => {
        try {
          const product = await db.getDocument(
            databaseId,
            productsCollectionId,
            item.productId
          ) as Product;

          if (product.TrackStock) {
            const newStock = Math.max(0, (product.Stock || 0) - item.quantity);
            
            await db.updateDocument(
              databaseId,
              productsCollectionId,
              item.productId,
              { Stock: newStock }
            );
          }
        } catch (error) {
          console.error(`Error deducting stock for product ${item.productId}:`, error);
          throw error;
        }
      };

      stockUpdates.push(stockUpdate());
    }

    // Wait for all stock updates to complete
    await Promise.all(stockUpdates);
  },

  // Restore stock for cancelled orders
  async restoreStock(items: OrderItem[]): Promise<void> {
    const stockUpdates: Promise<void>[] = [];

    for (const item of items) {
      const stockUpdate = async () => {
        try {
          const product = await db.getDocument(
            databaseId,
            productsCollectionId,
            item.productId
          ) as Product;

          if (product.TrackStock) {
            const newStock = (product.Stock || 0) + item.quantity;
            
            await db.updateDocument(
              databaseId,
              productsCollectionId,
              item.productId,
              { Stock: newStock }
            );
          }
        } catch (error) {
          console.error(`Error restoring stock for product ${item.productId}:`, error);
          throw error;
        }
      };

      stockUpdates.push(stockUpdate());
    }

    // Wait for all stock updates to complete
    await Promise.all(stockUpdates);
  }
};

export const ordersService = {
  async createOrder(orderData: Omit<Order, '$id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) {
    try {
      // Step 1: Validate stock availability
      const stockValidation = await stockManager.validateOrderStock(orderData.items);
      
      if (!stockValidation.isValid) {
        throw new Error(`Stock validation failed: ${stockValidation.errors.join(', ')}`);
      }

      // Step 2: Deduct stock for all items
      await stockManager.deductStock(orderData.items);

      // Step 3: Create the order
      const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const transformedData = {
        userId: orderData.userId,
        items: JSON.stringify(orderData.items), // Convert items array to string
        total: orderData.total,
        status: orderData.status,
        paymentStatus: orderData.paymentStatus,
        shippingFirstName: orderData.shippingFirstName,
        shippingLastName: orderData.shippingLastName,
        shippingEmail: orderData.shippingEmail,
        shippingPhone: orderData.shippingPhone,
        shippingStreet: orderData.shippingStreet,
        shippingCity: orderData.shippingCity,
        shippingRegion: orderData.shippingRegion,
        shippingCountry: orderData.shippingCountry,
        shippingPostalCode: orderData.shippingPostalCode,
        orderNumber,
      };

      const response = await databases.createDocument(
        databaseId,
        ordersCollectionId,
        ID.unique(),
        transformedData
      ) as unknown as OrderDocument;

      // Parse items back to array when returning
      return {
        ...response,
        items: JSON.parse(response.items) as OrderItem[]
      };
    } catch (error) {
      console.error('Appwrite service :: createOrder :: error', error);
      throw error;
    }
  },

  async getOrders() {
    try {
      const response = await databases.listDocuments(
        databaseId,
        ordersCollectionId,
        [Query.orderDesc('$createdAt')]
      );

      // Parse items for each order
      return {
        ...response,
        documents: response.documents.map(doc => ({
          ...(doc as unknown as OrderDocument),
          items: JSON.parse(doc.items) as OrderItem[]
        })) as Order[]
      };
    } catch (error) {
      console.error('Appwrite service :: getOrders :: error', error);
      throw error;
    }
  },

  async getOrder(orderId: string) {
    try {
      const response = await databases.getDocument(
        databaseId,
        ordersCollectionId,
        orderId
      ) as unknown as OrderDocument;

      // Parse items when returning
      return {
        ...response,
        items: JSON.parse(response.items) as OrderItem[]
      };
    } catch (error) {
      console.error('Appwrite service :: getOrder :: error', error);
      throw error;
    }
  },

  async getUserOrders(userId: string) {
    try {
      const response = await databases.listDocuments(
        databaseId,
        ordersCollectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt')
        ]
      );

      // Parse items for each order
      return {
        ...response,
        documents: response.documents.map(doc => ({
          ...(doc as unknown as OrderDocument),
          items: JSON.parse(doc.items) as OrderItem[]
        })) as Order[]
      };
    } catch (error) {
      console.error('Appwrite service :: getUserOrders :: error', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      // Get current order to check if we need to restore stock
      const currentOrder = await this.getOrder(orderId);
      const previousStatus = currentOrder.status;

      // If order is being cancelled, restore stock
      if (status === 'cancelled' && previousStatus !== 'cancelled') {
        await stockManager.restoreStock(currentOrder.items);
      }

      const response = await databases.updateDocument(
        databaseId,
        ordersCollectionId,
        orderId,
        {
          status,
          updatedAt: new Date().toISOString()
        }
      ) as unknown as OrderDocument;

      return {
        ...response,
        items: JSON.parse(response.items) as OrderItem[]
      };
    } catch (error) {
      console.error('Appwrite service :: updateOrderStatus :: error', error);
      throw error;
    }
  },

  async updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']) {
    try {
      const response = await databases.updateDocument(
        databaseId,
        ordersCollectionId,
        orderId,
        {
          paymentStatus,
          updatedAt: new Date().toISOString()
        }
      ) as unknown as OrderDocument;

      return {
        ...response,
        items: JSON.parse(response.items) as OrderItem[]
      };
    } catch (error) {
      console.error('Appwrite service :: updatePaymentStatus :: error', error);
      throw error;
    }
  },

  async deleteOrder(orderId: string) {
    try {
      // Get order details before deletion to restore stock
      const order = await this.getOrder(orderId);
      
      // Restore stock for deleted order
      await stockManager.restoreStock(order.items);

      await databases.deleteDocument(
        databaseId,
        ordersCollectionId,
        orderId
      );
      return true;
    } catch (error) {
      console.error('Appwrite service :: deleteOrder :: error', error);
      throw error;
    }
  },

  // New method to check stock before checkout
  async validateCheckoutStock(items: OrderItem[]): Promise<{ isValid: boolean; errors: string[] }> {
    return stockManager.validateOrderStock(items);
  }
};