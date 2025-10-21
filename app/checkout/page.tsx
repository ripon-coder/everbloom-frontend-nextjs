"use client";

import { useEffect, useState } from "react";
import { fetchVariant, Variant } from "@/lib/variants";
import { getCart, CheckoutItem, setCheckoutItems } from "@/lib/checkout";

interface CheckoutVariant extends Variant {
  quantity: number;
  fallbackImage?: string;
  name?: string;
  skuLocal?: string;
  slug: string;
  isDisabled?: boolean;
  isLoadingPrice?: boolean;
}

export default function CheckoutPage() {
  const [checkoutItems, setCheckoutItemsState] = useState<CheckoutVariant[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [location, setLocation] = useState<"inside" | "outside">("inside");

  // Load cart and fetch variant details
  useEffect(() => {
    const localCart = getCart();

    // Deduplicate by variantId to avoid same product showing twice
    const uniqueCart = Array.from(new Map(localCart.map(item => [item.id, item])).values());

    const initialItems: CheckoutVariant[] = uniqueCart.map(item => ({
      id: item.id,
      product_id: item.productId,
      sku: item.sku,
      discount_price: 0,
      stock: 1,
      images: [],
      attributes: [],
      quantity: item.quantity,
      fallbackImage: "",
      name: item.name,
      skuLocal: item.sku,
      slug: item.slug,
      isDisabled: false,
      isLoadingPrice: true,
    }));

    setCheckoutItemsState(initialItems);

    uniqueCart.forEach(async item => {
      try {
        const variant = await fetchVariant(item.id);
        setCheckoutItemsState(prev =>
          prev.map(ci =>
            ci.id === item.id
              ? {
                  ...variant,
                  quantity: ci.quantity,
                  fallbackImage: ci.fallbackImage || "",
                  name: ci.name,
                  skuLocal: ci.skuLocal,
                  slug: ci.slug,
                  isDisabled: false,
                  isLoadingPrice: false,
                }
              : ci
          )
        );
      } catch {
        setCheckoutItemsState(prev =>
          prev.map(ci =>
            ci.id === item.id
              ? { ...ci, isDisabled: true, isLoadingPrice: false }
              : ci
          )
        );
      }
    });
  }, []);

  const subtotal = checkoutItems
    .filter(item => !item.isDisabled)
    .reduce((acc, item) => acc + Number(item.discount_price) * item.quantity, 0);

  const deliveryCharge = location === "inside" ? 80 : 120;
  const total = subtotal + deliveryCharge;

  // Save checkout items to localStorage whenever checkoutItems change
  useEffect(() => {
    const itemsToSave: CheckoutItem[] = checkoutItems
      .filter(item => !item.isDisabled && !item.isLoadingPrice)
      .map(item => ({
        id: item.id,
        productId: item.product_id,
        name: item.name || "",
        quantity: item.quantity,
        discount_price: Number(item.discount_price),
        sku: item.skuLocal || "",
        slug: item.slug,
        attributeIds: item.attributes?.map(a => a.attribute_value) || [],
      }));

    setCheckoutItems(itemsToSave);
  }, [checkoutItems]);

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side - Shipping & Payment */}
        <div className="md:col-span-2 bg-white p-4 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
          {/* Shipping form inputs */}
          <div className="space-y-3">
            <input type="text" placeholder="Full Name" className="border p-3 rounded-md w-full" />
            <input type="text" placeholder="Phone Number" className="border p-3 rounded-md w-full" />
            <input type="text" placeholder="City" className="border p-3 rounded-md w-full" />
            <input type="text" placeholder="Postal Code" className="border p-3 rounded-md w-full" />
            <textarea placeholder="Full Address" className="border p-3 rounded-md w-full" rows={3} />
          </div>

          {/* Delivery Location */}
          <div className="mt-4">
            <span className="font-medium text-sm">Delivery Location:</span>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => setLocation("inside")}
                className={`px-4 py-2 border rounded-md text-sm ${
                  location === "inside" ? "border-orange-500 bg-orange-50 text-orange-600" : "hover:bg-gray-100"
                }`}
              >
                Inside Dhaka (৳80)
              </button>
              <button
                onClick={() => setLocation("outside")}
                className={`px-4 py-2 border rounded-md text-sm ${
                  location === "outside" ? "border-orange-500 bg-orange-50 text-orange-600" : "hover:bg-gray-100"
                }`}
              >
                Outside Dhaka (৳120)
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-medium mb-2">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 border p-3 rounded-md cursor-pointer">
                <input type="radio" name="payment" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} />
                <span>Cash on Delivery (COD)</span>
              </label>
              <label className="flex items-center gap-3 border p-3 rounded-md cursor-pointer">
                <input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                <span>Credit / Debit Card</span>
              </label>
              <label className="flex items-center gap-3 border p-3 rounded-md cursor-pointer">
                <input type="radio" name="payment" checked={paymentMethod === "bkash"} onChange={() => setPaymentMethod("bkash")} />
                <span>bKash / Mobile Banking</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="bg-white p-4 h-fit">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            {checkoutItems.map((item) => {
              const priceDisplay = item.isLoadingPrice
                ? <span className="bg-gray-200 rounded w-16 h-4 inline-block animate-pulse" />
                : `৳ ${Number(item.discount_price).toLocaleString()}`;

              return (
                <div key={item.id} className="flex justify-between items-center">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>{priceDisplay}</span>
                </div>
              );
            })}
          </div>

          <div className="border-t mt-4 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>৳ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>৳ {deliveryCharge.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>৳ {total.toLocaleString()}</span>
            </div>
          </div>

          <button className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
