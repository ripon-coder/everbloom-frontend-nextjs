import toast from "react-hot-toast";

export interface CartItem {
  productId: number;
  variantId: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
  slug: string; // stored for reference
}

/**
 * Safely parse cart from localStorage and recover valid items
 */
function safeParseCart(): CartItem[] {
  try {
    const stored = localStorage.getItem("cart");
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) throw new Error("Invalid cart format");

    // Only keep valid items
    const validItems = parsed.filter(
      (item: any) =>
        item &&
        typeof item.productId === "number" &&
        typeof item.variantId === "number" &&
        typeof item.quantity === "number" &&
        typeof item.name === "string" &&
        typeof item.price === "number" &&
        typeof item.image === "string" &&
        typeof item.slug === "string"
    );

    if (validItems.length !== parsed.length) {
      console.warn("Some invalid cart items were ignored.", parsed, validItems);
      localStorage.setItem("cart", JSON.stringify(validItems)); // fix corrupted data
    }

    return validItems;
  } catch (error) {
    console.warn("Corrupted cart data detected, recovering what we can.", error);
    localStorage.removeItem("cart"); // remove completely corrupted cart
    return [];
  }
}

/**
 * Add an item to the cart or update existing variant
 * Always preserves the order in localStorage
 */
export function addToCart(item: CartItem) {
  const cart = safeParseCart();

  const index = cart.findIndex(i => i.variantId === item.variantId);

  if (index !== -1) {
    // Update quantity and attributes, keep slug
    cart[index].quantity = Math.min(cart[index].quantity + item.quantity, item.quantity);
    cart[index].slug = item.slug;
  } else {
    cart.unshift(item); // append to end to preserve order
  }

  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartchange"));
    toast.success(`${item.name} added to cart!`);
  } catch (error) {
    console.error("Failed to save cart:", error);
    toast.error("Failed to add to cart.");
  }
}

/**
 * Get all items in the cart in the same order as stored in localStorage
 */
export function getCart(): CartItem[] {
  return safeParseCart();
}

/**
 * Get the total number of items in the cart
 */
export function getCartCount(): number {
  const cart = safeParseCart();
  return cart.length;
}

/**
 * Remove a cart item by variant ID, keeping order intact
 */
export function removeFromCart(variantId: number) {
  const cart = safeParseCart().filter(i => i.variantId !== variantId);
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartchange"));
    toast.success("Item removed from cart.");
  } catch (error) {
    console.error("Failed to remove item:", error);
    toast.error("Failed to remove item from cart.");
  }
}

/**
 * Clear the entire cart
 */
export function clearCart() {
  try {
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartchange"));
    toast.success("Cart cleared.");
  } catch (error) {
    console.error("Failed to clear cart:", error);
    toast.error("Failed to clear cart.");
  }
}
