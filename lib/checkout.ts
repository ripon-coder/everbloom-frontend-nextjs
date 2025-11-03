// lib/checkout.ts
export interface CheckoutItem {

  variant_id: number;
  productId: number;
  name: string;
  discount_price?: number;
  quantity: number;
}

const CHECKOUT_KEY = "checkout";

// Get all checkout items from localStorage
export function getCart(): CheckoutItem[] {
  try {
    const stored = localStorage.getItem(CHECKOUT_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Save checkout items to localStorage (overwrite previous data)
export function setCheckoutItems(items: CheckoutItem[]) {
  try {
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save checkout items:", error);
  }
}

// Add a single item to checkout
export function addToCheckout(item: CheckoutItem) {
  const cart = getCart();
  const exists = cart.find((i) => i.variant_id === item.variant_id);
  const updated = exists
    ? cart.map((i) =>
        i.variant_id === item.variant_id
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      )
    : [...cart, item];
  setCheckoutItems(updated);
}

// Remove a single item from checkout
export function removeFromCheckout(variant_id: number) {
  const cart = getCart().filter((i) => i.variant_id !== variant_id);
  setCheckoutItems(cart);
}

// Clear all checkout data explicitly
export function clearCheckout() {
  localStorage.removeItem(CHECKOUT_KEY);
}
