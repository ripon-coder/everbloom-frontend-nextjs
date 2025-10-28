"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart, setCheckoutItems, CheckoutItem } from "@/lib/checkout";

interface Variant {
  id: number;
  product_id: number;
  sell_price: string;
  discount_price: any;
  stock: number;
  weight: string;
  status: string;
  images?: string[];
  attributes: any[];
}

interface CheckoutVariant extends Variant {
  quantity: number;
  name?: string;
  fallbackImage?: string;
  key: string;
  isDisabled?: boolean;
  isLoadingPrice?: boolean;
}

interface District {
  id: number;
  name: string;
  delivery_charge?: number;
  information?: string | null;
}

interface Address {
  id: number;
  name: string;
  phone: string;
  district: string;
  zone: string;
  address: string;
}

export default function CheckoutPage() {
  const [checkoutItems, setCheckoutItemsState] = useState<CheckoutVariant[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "card">("cod");

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | "new">("new");
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    district: "",
    zone: "",
    address: "",
  });

  const [districts, setDistricts] = useState<District[]>([]);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [checkoutTotals, setCheckoutTotals] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0,
    coupon_discount: 0,
    flash_discount: 0,
  });

  // Fetch district list
  useEffect(() => {
    const fetchDistricts = async () => {
      setDistrictLoading(true);
      try {
        const res = await fetch("/api/district-list");
        const data = await res.json();
        if (res.ok && data) setDistricts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setDistrictLoading(false);
      }
    };
    fetchDistricts();
  }, []);

  // Fetch address book
  useEffect(() => {
    const fetchAddresses = async () => {
      setAddressLoading(true);
      try {
        const res = await fetch("/api/address-book");
        const data = await res.json();
        if (data.status && data.data) {
          const formatted: Address[] = data.data.map((addr: any) => ({
            id: addr.id,
            name: addr.name,
            phone: addr.phone_number,
            district: addr.district?.name || "",
            zone: addr.zone,
            address: addr.address,
          }));
          setSavedAddresses(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  // Update form when address selected
  useEffect(() => {
    if (selectedAddressId === "new") {
      setAddressForm({
        name: "",
        phone: "",
        district: "",
        zone: "",
        address: "",
      });
    } else {
      const addr = savedAddresses.find((a) => a.id === selectedAddressId);
      if (addr) setAddressForm(addr);
    }
  }, [selectedAddressId, savedAddresses]);

  // Load checkout items and initial prices from variant API
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
              discount_price: variant.discount_price || variant.sell_price,
              sell_price: variant.sell_price,
              fallbackImage: variant.images?.[0] || "",
              isDisabled: variant.stock <= 0,
              isLoadingPrice: false,
              key: `${ci.id}-${index}`,
            };
          }
          return { ...ci, isDisabled: true, isLoadingPrice: false, key: `${ci.id}-${index}` };
        });

        setCheckoutItemsState(updatedItems);

        // 🔹 Compute initial subtotal locally
        const initialSubtotal = updatedItems.reduce(
          (sum, item) => sum + Number(item.discount_price) * item.quantity,
          0
        );

        setCheckoutTotals({
          subtotal: initialSubtotal,
          shipping: 0, // initial shipping 0
          total: initialSubtotal,
          coupon_discount: 0,
          flash_discount: 0,
        });

        // Save items to localStorage
        const itemsToSave: CheckoutItem[] = updatedItems
          .filter((item) => !item.isDisabled)
          .map((item) => ({
            variant_id: item.id,
            productId: item.product_id,
            name: item.name || "",
            quantity: item.quantity,
            discount_price: Number(item.discount_price),
          }));
        setCheckoutItems(itemsToSave);
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔁 Recalculate totals using backend (shipping/coupons)
  const recalculateCheckout = async (
    items = checkoutItems,
    coupon = couponCode,
    districtName = addressForm.district
  ) => {
    const district = districts.find(
      (d) => d.name.toLowerCase() === districtName.toLowerCase()
    );
    if (!district) return;

    const product_list = items.map((item) => ({
      product_id: String(item.product_id),
      variant_id: String(item.id),
      quantity: String(item.quantity),
      flash_sale: "",
    }));

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_list,
          coupon_code: coupon,
          district_id: district.id,
        }),
      });

      const data = await res.json();
      if (data.status && data.data) {
        const d = data.data;
        setCheckoutTotals({
          subtotal: d.subtotal || 0,
          shipping: d.shipping_amount || 0,
          total: d.total_amount || 0,
          coupon_discount: d.coupon_discount_amount || 0,
          flash_discount: d.flash_discount_amount || 0,
        });
        setCouponMessage(`✅ Checkout updated (${coupon || "no coupon"})`);
      } else {
        setCouponMessage("Failed to update totals");
      }
    } catch (err) {
      console.error(err);
      setCouponMessage("Error calculating checkout");
    }
  };

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode) return setCouponMessage("Enter coupon code");
    await recalculateCheckout(checkoutItems, couponCode, addressForm.district);
  };

  // Recalculate when district changes
  useEffect(() => {
    if (addressForm.district && checkoutItems.length > 0) {
      recalculateCheckout(checkoutItems, couponCode, addressForm.district);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addressForm.district]);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Shipping Information</h2>
            <button className="text-sm px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition cursor-pointer">
              <Link href="/address-book">Address Book</Link>
            </button>
          </div>

          <div className="space-y-3">
            <select
              value={selectedAddressId}
              onChange={(e) =>
                setSelectedAddressId(
                  e.target.value === "new" ? "new" : Number(e.target.value)
                )
              }
              className="border p-3 rounded w-full text-sm"
              disabled={addressLoading}
            >
              {addressLoading ? (
                <option>Loading addresses...</option>
              ) : (
                <>
                  <option value="new">Enter New Address</option>
                  {savedAddresses.map((addr) => (
                    <option key={addr.id} value={addr.id}>
                      {addr.name}, {addr.zone}, {addr.district}
                    </option>
                  ))}
                </>
              )}
            </select>

            <input
              type="text"
              placeholder="Name"
              value={addressForm.name}
              onChange={(e) =>
                setAddressForm({ ...addressForm, name: e.target.value })
              }
              className="border p-3 rounded w-full"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={addressForm.phone}
              onChange={(e) =>
                setAddressForm({ ...addressForm, phone: e.target.value })
              }
              className="border p-3 rounded w-full"
            />
            <textarea
              placeholder="Address"
              value={addressForm.address}
              onChange={(e) =>
                setAddressForm({ ...addressForm, address: e.target.value })
              }
              className="border p-3 rounded w-full"
              rows={3}
            />
            <input
              type="text"
              placeholder="Zone"
              value={addressForm.zone}
              onChange={(e) =>
                setAddressForm({ ...addressForm, zone: e.target.value })
              }
              className="border p-3 rounded w-full"
            />

            <select
              value={addressForm.district}
              onChange={(e) =>
                setAddressForm({ ...addressForm, district: e.target.value })
              }
              className="border p-3 rounded w-full"
              disabled={districtLoading}
            >
              <option value="">
                {districtLoading ? "Loading districts..." : "Select District"}
              </option>
              {districts.map((district) => (
                <option key={district.id} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
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
            {couponMessage && (
              <p className="text-green-600 text-sm mt-1">{couponMessage}</p>
            )}
          </div>

          {/* Payment */}
          <div className="mt-6 space-y-2">
            <span className="font-medium text-sm">Payment Method</span>
            <div className="flex flex-col gap-2">
              {["cod", "bkash", "card"].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 border p-3 rounded cursor-pointer"
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === method}
                    onChange={() =>
                      setPaymentMethod(method as "cod" | "bkash" | "card")
                    }
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

        {/* Right Summary */}
        <div className="md:w-1/3 bg-white p-6 rounded-lg shadow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              {checkoutItems.map((item) => (
                <div key={item.key} className="flex justify-between items-center">
                  <span>
                    {item.name} ({item.quantity}x)
                  </span>
                  <span>
                    ৳{" "}
                    {(
                      Number(item.discount_price || item.sell_price) *
                      Number(item.quantity)
                    ).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mt-4 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>৳ {checkoutTotals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>৳ {checkoutTotals.shipping.toLocaleString()}</span>
              </div>
              {checkoutTotals.coupon_discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount</span>
                  <span>-৳ {checkoutTotals.coupon_discount.toLocaleString()}</span>
                </div>
              )}
              {checkoutTotals.flash_discount > 0 && (
                <div className="flex justify-between text-blue-600">
                  <span>Flash Discount</span>
                  <span>-৳ {checkoutTotals.flash_discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>৳ {checkoutTotals.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="hidden md:block mt-6">
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition text-lg">
                Place Order ৳ {checkoutTotals.total.toLocaleString()}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Order Button */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white p-4 shadow-t flex justify-between items-center z-50">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 font-semibold">Total</span>
          <span className="text-lg font-semibold">
            ৳ {checkoutTotals.total.toLocaleString()}
          </span>
        </div>
        
        <button className="bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition">
          Place Order
        </button>
      </div>
    </div>
  );
}
