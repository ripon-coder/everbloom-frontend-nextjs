"use client";

import { useEffect, useState } from "react";
import { getCart, setCheckoutItems, CheckoutItem } from "@/lib/checkout";

interface Variant {
  id: number;
  product_id: number;
  buying_price?: string | null;
  sell_price: string;
  discount_price: any;
  discount_amount?: string | null;
  stock: number;
  weight: string;
  status: string;
  images?: string[];
  attributes: {
    id: number;
    product_variant_id: number;
    attribute_id: number;
    attribute_value_id: number;
    attribute_name: string;
    is_image: number;
    attribute_value: string;
  }[];
}

interface CheckoutVariant extends Variant {
  quantity: number;
  fallbackImage?: string;
  name?: string;
  slug?: string;
  isDisabled?: boolean;
  isLoadingPrice?: boolean;
  key: string;
}

export default function CheckoutPage() {
  const [checkoutItems, setCheckoutItemsState] = useState<CheckoutVariant[]>([]);
  const [location, setLocation] = useState<"inside" | "outside">("inside");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "card">("cod");

  useEffect(() => {
    const localCart = getCart();
    if (!localCart || localCart.length === 0) return;

    // 1️⃣ Initialize placeholders
    const placeholders: CheckoutVariant[] = localCart.map((item, index) => ({
      id: item.variant_id,
      product_id: item.productId,
      discount_price: "0",
      sell_price: "0",
      stock: 0,
      weight: "0",
      status: "inactive",
      images: [],
      attributes: [],
      quantity: item.quantity,
      fallbackImage: "",
      name: item.name,
      isDisabled: false,
      isLoadingPrice: true,
      key: `${item.variant_id}-${index}`,
    }));
    setCheckoutItemsState(placeholders);

    const variantIds = localCart.map((item) => item.variant_id);

    // 2️⃣ Fetch variant data
    fetch("/api/variants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: variantIds }),
    })
      .then((res) => res.json())
      .then((resData) => {
        if (!resData.status || !resData.data) throw new Error("No variants found");

        const variants: Variant[] = resData.data;

        const updatedItems: CheckoutVariant[] = placeholders.map((ci, index) => {
          const variant = variants.find((v) => v.id === ci.id);
          if (variant) {
            return {
              ...ci,
              ...variant,
              discount_price: variant.discount_price || "0", // keep string
              sell_price: variant.sell_price || "0",         // keep string
              quantity: ci.quantity,
              fallbackImage: variant.images?.[0] || "",
              isDisabled: variant.stock <= 0,
              isLoadingPrice: false,
              key: `${ci.id}-${index}`,
            };
          }
          return {
            ...ci,
            isDisabled: true,
            isLoadingPrice: false,
            key: `${ci.id}-${index}`,
          };
        });

        setCheckoutItemsState(updatedItems);

        // 3️⃣ Save only after API data loaded to prevent double-save
        const itemsToSave: CheckoutItem[] = updatedItems
          .filter((item) => !item.isDisabled && !item.isLoadingPrice)
          .map((item) => ({
            variant_id: item.id,
            productId: item.product_id,
            name: item.name || "",
            quantity: item.quantity,
            discount_price: Number(item.discount_price),
          }));

        setCheckoutItems(itemsToSave);
      })
      .catch(() => {
        setCheckoutItemsState((prev) =>
          prev.map((ci, index) => ({
            ...ci,
            isDisabled: true,
            isLoadingPrice: false,
            key: `${ci.id}-${index}`,
          }))
        );
      });
  }, []);

  const subtotal = checkoutItems
    .filter((item) => !item.isDisabled)
    .reduce((acc, item) => acc + Number(item.discount_price) * item.quantity, 0);

  const deliveryCharge = location === "inside" ? 80 : 120;
  const total = subtotal + deliveryCharge;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left - Shipping */}
        <div className="md:col-span-2 bg-white p-4 space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

          {/* Shipping Form */}
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

            {/* Payment Method */}
            <div className="mt-4">
              <span className="font-medium text-sm">Payment Method:</span>
              <div className="flex flex-col gap-2 mt-2">
                {["cod", "bkash", "card"].map((method) => (
                  <label key={method} className="flex items-center gap-3 border p-3 rounded-md cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method as "cod" | "bkash" | "card")}
                    />
                    <span>
                      {method === "cod" ? "Cash on Delivery (COD)" : method === "bkash" ? "bKash / Mobile Banking" : "Credit / Debit Card"}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Order Summary + Place Order */}
        <div className="bg-white p-4 h-fit flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-medium mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              {checkoutItems.map((item) => (
                <div key={item.key} className="flex justify-between items-center">
                  <span>{item.name} ({item.discount_price} x{item.quantity})</span>
                  <span>{item.isLoadingPrice ? <span className="bg-gray-200 rounded w-16 h-4 inline-block animate-pulse" /> : `৳ ${Number(item.discount_price * item.quantity).toLocaleString()}`}</span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-3 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>৳ {subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>৳ {deliveryCharge.toLocaleString()}</span></div>
              <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>৳ {total.toLocaleString()}</span></div>
            </div>
          </div>

          {/* Place Order Button */}
          <button className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
