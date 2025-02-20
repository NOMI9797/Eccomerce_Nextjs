import { databases, ID } from "../client";
import { Query } from "appwrite";

const DATABASE_ID = '679b0257003b758db270'; // Your database ID
const COLLECTION_ID = 'orders'; // Your orders collection ID

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  $id?: string;
  userId: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: string[]; // Array of product IDs
  quantities: number[]; // Array of quantities
  totalAmount: number;
  shippingAddress: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt?: string;
  updatedAt?: string;
}

export const ordersService = {
  // Create a new order
  async createOrder(orderData: Omit<Order, '$id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) {
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      {
        ...orderData,
        orderNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    );
  },

  // Get all orders for a user
  async getUserOrders(userId: string) {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
      ]
    );
  },

  // Get all orders (admin only)
  async getAllOrders() {
    return await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.orderDesc('$createdAt')]
    );
  },

  // Get a single order by ID
  async getOrder(orderId: string) {
    return await databases.getDocument(
      DATABASE_ID,
      COLLECTION_ID,
      orderId
    );
  },

  // Update order status
  async updateOrderStatus(orderId: string, status: Order['status']) {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      orderId,
      {
        status,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  // Update payment status
  async updatePaymentStatus(orderId: string, paymentStatus: Order['paymentStatus']) {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      orderId,
      {
        paymentStatus,
        updatedAt: new Date().toISOString(),
      }
    );
  },

  // Delete an order (admin only)
  async deleteOrder(orderId: string) {
    return await databases.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      orderId
    );
  }
};