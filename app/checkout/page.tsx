"use client";

import { useEffect, useState } from "react";
import { getCart, setCheckoutItems, CheckoutItem } from "@/lib/checkout";

interface Variant {
  id: number;
  product_id: number;
  buy_price?: string | null;
  sell_price: string;
  discount_price: any;
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

  // Address states
  const [savedAddresses, setSavedAddresses] = useState<
    {
      id: number;
      name: string;
      phone: string;
      district: string;
      zone: string;
      address: string;
    }[]
  >([
    {
      id: 1,
      name: "John Doe",
      phone: "017XXXXXXXX",
      district: "Dhaka",
      zone: "Gulshan",
      address: "House 12, Road 5",
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | "new">("new");
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    district: "",
    zone: "",
    address: "",
  });

  // District options
  const districts = ["Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barishal", "Rangpur", "Mymensingh"];

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    if (selectedAddressId === "new") {
      setAddressForm({ name: "", phone: "", district: "", zone: "", address: "" });
    } else {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      if (addr) setAddressForm(addr);
    }
  }, [selectedAddressId]);

  useEffect(() => {
    const localCart = getCart();
    if (!localCart || localCart.length === 0) return;

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
              discount_price: variant.discount_price || "0",
              sell_price: variant.sell_price || "0",
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

  const applyCoupon = async () => {
    if (!couponCode) return setCouponMessage("Please enter a coupon code.");

    try {
      const res = await fetch("/api/validate-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode }),
      });
      const data = await res.json();

      if (data.valid) {
        setCouponDiscount(data.discount);
        setCouponMessage(`Coupon applied! Discount: ৳${data.discount}`);
      } else {
        setCouponDiscount(0);
        setCouponMessage("Invalid coupon code.");
      }
    } catch (err) {
      setCouponDiscount(0);
      setCouponMessage("Error validating coupon.");
    }
  };

  const subtotal = checkoutItems
    .filter((item) => !item.isDisabled)
    .reduce((acc, item) => acc + Number(item.discount_price) * item.quantity, 0);

  const deliveryCharge = addressForm.district.toLowerCase() === "dhaka" ? 80 : 120;
  const total = subtotal + deliveryCharge - couponDiscount;

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left - Shipping */}
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>

          {/* Address Form */}
          <div className="space-y-3">
            <select
              value={selectedAddressId}
              onChange={(e) => setSelectedAddressId(e.target.value === "new" ? "new" : Number(e.target.value))}
              className="border p-3 rounded w-full text-sm"
            >
              <option value="new">Enter New Address</option>
              {savedAddresses.map((addr) => (
                <option key={addr.id} value={addr.id}>
                  {addr.name}, {addr.district}, {addr.zone}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Name"
              value={addressForm.name}
              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
              className="border p-3 rounded w-full"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              className="border p-3 rounded w-full"
            />

            {/* District dropdown */}
            <select
              value={addressForm.district}
              onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
              className="border p-3 rounded w-full"
            >
              <option value="">Select District</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Zone"
              value={addressForm.zone}
              onChange={(e) => setAddressForm({ ...addressForm, zone: e.target.value })}
              className="border p-3 rounded w-full"
            />
            <textarea
              placeholder="Address"
              value={addressForm.address}
              onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
              className="border p-3 rounded w-full"
              rows={3}
            />
          </div>

          {/* Coupon */}
          <div className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="border p-3 rounded flex-1"
              />
              <button
                onClick={applyCoupon}
                className="bg-amber-500 text-white px-4 py-3 rounded hover:bg-amber-600 transition text-sm cursor-pointer"
              >
                Apply
              </button>
            </div>
            {couponMessage && <p className="text-green-600 text-sm mt-1">{couponMessage}</p>}
          </div>

          {/* Payment */}
          <div className="mt-6 space-y-2">
            <span className="font-medium text-sm">Payment Method</span>
            <div className="flex flex-col gap-2">
              {["cod", "bkash", "card"].map((method) => (
                <label key={method} className="flex items-center gap-3 border p-3 rounded cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method as "cod" | "bkash" | "card")}
                  />
                  <span className="text-sm">
                    {method === "cod"
                      ? "Cash on Delivery"
                      : method === "bkash"
                      ? "bKash / Mobile Banking"
                      : "Credit / Debit Card"}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Order Summary */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              {checkoutItems.map((item) => (
                <div key={item.key} className="flex justify-between items-center">
                  <span>{item.name} ({item.discount_price} x{item.quantity})</span>
                  <span>৳ {Number(item.discount_price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
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
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-৳ {couponDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>৳ {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Desktop Place Order Button */}
            <div className="hidden md:block mt-6">
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition text-lg">
                Place Order  ৳ {total.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Place Order Button fixed at bottom */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white p-4 shadow-t flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-semibold">Total</span>
          <span className="text-lg font-semibold">৳ {total.toLocaleString()}</span>
        </div>
        <button className="bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition">
          Place Order
        </button>
      </div>
    </div>
  );
}
