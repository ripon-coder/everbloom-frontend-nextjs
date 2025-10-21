import toast from "react-hot-toast";

export interface CheckoutItem {
  id: number;              // Variant ID
  productId: number;       // Product ID
  name: string;
  quantity: number;
  discount_price: number;
  sku: string;
  slug: string;
  attributeIds?: number[];
}

/**
 * Safely parse checkout items from localStorage
 */
function safeParseCheckout(): CheckoutItem[] {
  try {
    const stored = localStorage.getItem("checkout");
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("Invalid checkout format");

    const validItems = parsed.filter(
      (item: any) =>
        item &&
        typeof item.id === "number" &&
        typeof item.productId === "number" &&
        typeof item.name === "string" &&
        typeof item.quantity === "number" &&
        typeof item.discount_price === "number" &&
        typeof item.sku === "string" &&
        typeof item.slug === "string"
    );

    if (validItems.length !== parsed.length) {
      console.warn("Some invalid checkout items were ignored.", parsed, validItems);
    }

    return validItems;
  } catch (error) {
    console.warn("Corrupted checkout data detected, recovering what we can.", error);
    return [];
  }
}

/**
 * Save checkout items to localStorage
 */
export function setCheckoutItems(items: CheckoutItem[]) {
  try {
    localStorage.setItem("checkout", JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save checkout items:", error);
  }
}

/**
 * Get all checkout items from localStorage
 */
export function getCart(): CheckoutItem[] {
  return safeParseCheckout();
}

/**
 * Clear checkout storage
 */
export function clearCheckout() {
  try {
    localStorage.removeItem("checkout");
  } catch (error) {
    console.error("Failed to clear checkout:", error);
  }
}
