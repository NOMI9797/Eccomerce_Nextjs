import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService, Order } from '@/appwrite/db/orders';
import { useAuth } from '@/session/AuthContext';
import { toast } from 'sonner';

export const useOrders = () => {
  const { user, isUserAdmin } = useAuth();
  const queryClient = useQueryClient();

  // Get orders based on user role
  const { data: ordersData, isLoading, error } = useQuery<Order[]>({
    queryKey: ['orders', user?.$id],
    queryFn: async () => {
      if (isUserAdmin) {
        const response = await ordersService.getOrders();
        return response.documents;
      }
      if (user?.$id) {
        const response = await ordersService.getUserOrders(user.$id);
        return response.documents;
      }
      return [];
    },
    enabled: !!user
  });

  // Create order mutation
  const createOrder = useMutation({
    mutationFn: (orderData: Omit<Order, '$id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) =>
      ordersService.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create order');
    }
  });

  // Update order status mutation
  const updateOrderStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: Order['status'] }) =>
      ordersService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update order status');
    }
  });

  // Update payment status mutation
  const updatePaymentStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: Order['paymentStatus'] }) =>
      ordersService.updatePaymentStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Payment status updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update payment status');
    }
  });

  // Delete order mutation
  const deleteOrder = useMutation({
    mutationFn: (orderId: string) => ordersService.deleteOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete order');
    }
  });

  return {
    orders: ordersData || [],
    isLoading,
    error,
    createOrder,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder
  };
};
