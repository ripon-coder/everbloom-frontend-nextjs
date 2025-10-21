"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { getCart, removeFromCart } from "@/lib/cart";
import { fetchVariant, Variant } from "@/lib/variants";
import { setCheckoutItems } from "@/lib/checkout";

interface LocalCartItem {
  variantId: number;
  quantity: number;
  image?: string;
  name?: string;
  sku?: string;
  price?: number;
  slug: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<(Variant & {
    quantity: number;
    fallbackImage?: string;
    name?: string;
    skuLocal?: string;
    slug: string;
    isDisabled?: boolean;
    isLoadingApi?: boolean;
  })[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [cartLoaded, setCartLoaded] = useState(false);

  useEffect(() => {
    const localCart = getCart() as LocalCartItem[];

    const initialCart = localCart.map(item => ({
      id: item.variantId,
      product_id: 0,
      sku: "",
      discount_price: item.price || 0,
      stock: 1,
      images: [],
      attributes: [],
      quantity: item.quantity,
      fallbackImage: item.image,
      name: item.name,
      skuLocal: item.sku || "Unknown SKU",
      slug: item.slug,
      isDisabled: false,
      isLoadingApi: true,
    }));

    setCartItems(initialCart);

    localCart.forEach(async (item) => {
      try {
        const variant = await fetchVariant(item.variantId);
        setCartItems(prevItems =>
          prevItems.map(ci =>
            ci.id === item.variantId
              ? {
                  ...variant,
                  quantity: ci.quantity,
                  fallbackImage: item.image,
                  name: item.name,
                  skuLocal: item.sku || "Unknown SKU",
                  slug: item.slug,
                  isDisabled: false,
                  isLoadingApi: false,
                }
              : ci
          )
        );
      } catch {
        setCartItems(prevItems =>
          prevItems.map(ci =>
            ci.id === item.variantId
              ? { ...ci, isDisabled: true, isLoadingApi: false }
              : ci
          )
        );
      }
    });

    setCartLoaded(true);
  }, []);

  const updateQty = (variantId: number, action: "inc" | "dec") => {
    setCartItems(items =>
      items.map(item => {
        if (item.id === variantId && !item.isDisabled) {
          const newQty =
            action === "inc"
              ? Math.min(item.quantity + 1, item.stock)
              : Math.max(1, item.quantity - 1);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (variantId: number) => {
    removeFromCart(variantId);
    setCartItems(items => items.filter(item => item.id !== variantId));
    setSelectedItems(items => items.filter(id => id !== variantId));
  };

  const subtotal = cartItems
    .filter(item => selectedItems.includes(item.id) && !item.isDisabled)
    .reduce((acc, item) => acc + Number(item.discount_price) * item.quantity, 0);

  const total = subtotal;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="md:col-span-2 bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <Link href="/shop">
              <button className="bg-amber-500 text-white text-sm py-1 px-2 rounded hover:bg-amber-600 transition cursor-pointer">
                Continue Shopping
              </button>
            </Link>
          </div>

          {cartLoaded && cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Your cart is empty 🛒</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => {
                const imageSrc = item.images?.[0] || item.fallbackImage || "/placeholder.png";
                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between border-b pb-3 ${item.isDisabled ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        disabled={item.isDisabled || item.isLoadingApi}
                        onChange={() =>
                          setSelectedItems(prev =>
                            prev.includes(item.id)
                              ? prev.filter(id => id !== item.id)
                              : [...prev, item.id]
                          )
                        }
                        className="mr-2 w-5 h-5 cursor-pointer"
                      />
                      <Link href={`/product/${item.slug}`}>
                        <div className="relative w-20 h-20 rounded-md overflow-hidden border cursor-pointer">
                          {item.isLoadingApi ? (
                            <div className="w-full h-full bg-gray-200 animate-pulse rounded" />
                          ) : (
                            <Image
                              src={imageSrc}
                              alt={item.name || item.skuLocal || ""}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          )}
                        </div>
                      </Link>
                      <div>
                        <Link href={`/product/${item.slug}`}>
                          <h3 className="font-medium cursor-pointer hover:underline">{item.name || item.skuLocal}</h3>
                        </Link>
                        <p className="text-sm text-gray-600">SKU: {item.skuLocal}</p>
                        <p className="text-sm text-gray-500">
                          {item.isLoadingApi
                            ? <span className="bg-gray-200 rounded w-40 h-3 inline-block animate-pulse" />
                            : item.attributes.length > 0
                              ? item.attributes.map(a => `${a.attribute_name}: ${a.attribute_value}`).join(", ")
                              : "No attributes"}
                        </p>
                        <p className="text-orange-600 font-semibold">
                          {item.isLoadingApi
                            ? <span className="bg-gray-200 rounded w-16 h-4 inline-block animate-pulse" />
                            : `৳ ${Number(item.discount_price)}`}
                        </p>
                        {item.isDisabled && !item.isLoadingApi && <p className="text-red-500 text-xs">Product not available</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQty(item.id, "dec")}
                          className="px-3 py-1 hover:bg-gray-100"
                          disabled={item.isDisabled || item.isLoadingApi}
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, "inc")}
                          className={`px-3 py-1 hover:bg-gray-100 ${item.quantity >= item.stock || item.isDisabled || item.isLoadingApi ? "cursor-not-allowed opacity-50" : ""}`}
                          disabled={item.quantity >= item.stock || item.isDisabled || item.isLoadingApi}
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-4 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>৳ {subtotal}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg border-t pt-2">
            <span>Total</span>
            <span>৳ {total}</span>
          </div>

          {/* Checkout Button */}
          <button
            disabled={selectedItems.length === 0 || cartItems.some(item => item.isLoadingApi)}
            onClick={() => {
              const checkoutData = cartItems
                .filter(item => selectedItems.includes(item.id) && !item.isDisabled)
                .map(item => ({
                  id: item.id,
                  productId: item.product_id,
                  name: item.name || item.skuLocal || "Unknown Product",
                  quantity: item.quantity,
                  discount_price: Number(item.discount_price),
                  sku: item.skuLocal || "Unknown SKU",
                  slug: item.slug,
                  // Ensure attributeIds is number[] to match CheckoutItem type.
                  attributeIds: item.attributes
                    ?.map(a => Number((a as any).attribute_id ?? (a as any).id ?? (a as any).attributeId ?? NaN))
                    .filter(n => !Number.isNaN(n)) || [],
                }));

              setCheckoutItems(checkoutData);
              window.location.href = "/checkout"; // redirect to checkout page
            }}
            className={`w-full mt-4 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition ${
              selectedItems.length === 0 || cartItems.some(item => item.isLoadingApi)
                ? "cursor-not-allowed bg-gray-300 hover:bg-gray-300"
                : ""
            }`}
          >
            {cartItems.some(item => item.isLoadingApi) ? "Loading products..." : "Proceed to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
}
