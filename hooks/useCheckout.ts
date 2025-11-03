import { useState } from 'react';
import { ShippingAddress, PaymentMethod, Order } from '@/types';

interface UseCheckoutReturn {
  loading: boolean;
  error: string | null;
  createOrder: (
    shippingAddress: ShippingAddress,
    billingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    cartItems: any[]
  ) => Promise<Order | null>;
}

export const useCheckout = (): UseCheckoutReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (
    shippingAddress: ShippingAddress,
    billingAddress: ShippingAddress,
    paymentMethod: PaymentMethod,
    cartItems: any[]
  ): Promise<Order | null> => {
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cartItems,
        shippingAddress,
        billingAddress,
        paymentMethod
      };

      const response = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createOrder
  };
};