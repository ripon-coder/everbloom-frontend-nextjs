export interface CheckoutItem {
  variant_id: number;
  productId: number;
  name: string;
  discount_price?: number;
  quantity: number;
  flash_sale?: string | null; // 🟩 item-level flash sale
}

const CHECKOUT_KEY = "checkout";

// 🟩 Get all checkout items from localStorage
export function getCart(): CheckoutItem[] {
  try {
    const stored = localStorage.getItem(CHECKOUT_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// 🟩 Save checkout items to localStorage
export function setCheckoutItems(items: CheckoutItem[]) {
  try {
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save checkout items:", error);
  }
}

// 🟩 Add a single item to checkout
export function addToCheckout(item: CheckoutItem) {
  const cart = getCart();
  const exists = cart.find((i) => i.variant_id === item.variant_id);

  const updated = exists
    ? cart.map((i) =>
        i.variant_id === item.variant_id
          ? {
              ...i,
              quantity: i.quantity + item.quantity,
              flash_sale: item.flash_sale ?? i.flash_sale ?? null, // ✅ preserve flash_sale
            }
          : i
      )
    : [...cart, { ...item, flash_sale: item.flash_sale ?? null }];

  setCheckoutItems(updated);
}

// 🟩 Remove a single item
export function removeFromCheckout(variant_id: number) {
  const cart = getCart().filter((i) => i.variant_id !== variant_id);
  setCheckoutItems(cart);
}

// 🟩 Clear all checkout data
export function clearCheckout() {
  localStorage.removeItem(CHECKOUT_KEY);
}
