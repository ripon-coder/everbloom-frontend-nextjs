import { useState, useEffect, useContext, createContext } from 'react';
import { Cart, CartItem, AddToCartData } from '@/types';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (data: AddToCartData) => Promise<boolean>;
  removeItem: (itemId: string) => Promise<boolean>;
  updateQuantity: (itemId: string, quantity: number) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  itemCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCart(data.data);
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (data: AddToCartData): Promise<boolean> => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.success) {
        await fetchCart(); // Refresh cart
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      return false;
    }
  };

  const removeItem = async (itemId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cart/remove/${itemId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        await fetchCart(); // Refresh cart
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      return false;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number): Promise<boolean> => {
    try {
      const response = await fetch(`/api/cart/update/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });

      const result = await response.json();
      if (result.success) {
        await fetchCart(); // Refresh cart
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update cart item quantity:', error);
      return false;
    }
  };

  const clearCart = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        setCart(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return false;
    }
  };

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const total = cart?.total || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};