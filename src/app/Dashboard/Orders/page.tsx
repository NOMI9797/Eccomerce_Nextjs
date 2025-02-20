"use client";

import { useState } from 'react';
import { useOrders } from '@/app/hooks/useOrders';
import { Order } from '@/appwrite/db/orders';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function OrdersPage() {
  const { orders, isLoading, updateOrderStatus, updatePaymentStatus, deleteOrder } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handlePaymentStatusChange = async (orderId: string, newStatus: Order['paymentStatus']) => {
    try {
      await updatePaymentStatus.mutateAsync({ orderId, status: newStatus });
    } catch (error) {
      console.error('Failed to update payment status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder.mutateAsync(orderId);
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: Order) => (
              <TableRow key={order.$id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>
                  {format(new Date(order.createdAt || ''), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>{order.userId}</TableCell>
                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) => handleStatusChange(order.$id!, value as Order['status'])}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.paymentStatus}
                    onValueChange={(value) => handlePaymentStatusChange(order.$id!, value as Order['paymentStatus'])}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select payment status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteOrder(order.$id!)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}