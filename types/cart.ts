// Cart related types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  updatedAt: string;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
  variant?: string;
}