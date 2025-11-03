"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, setCheckoutItems, CheckoutItem } from "@/lib/checkout";
import {removeFromCart} from "@/lib/cart"
import toast from "react-hot-toast";

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
  const router = useRouter();

  const [checkoutItems, setCheckoutItemsState] = useState<CheckoutVariant[]>(
    []
  );
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "card">(
    "cod"
  );

  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | "new">(
    "new"
  );
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    district: "",
    zone: "",
    address: "",
  });

  const [addressErrors, setAddressErrors] = useState({
    name: "",
    phone: "",
    district: "",
    zone: "",
    address: "",
  });

  const [districts, setDistricts] = useState<District[]>([]);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [checkoutTotals, setCheckoutTotals] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0,
    coupon_discount: 0,
    flash_discount: 0,
  });

  const paymentShortLabels: Record<"cod" | "bkash" | "card", string> = {
    cod: "COD",
    bkash: "bKash",
    card: "Card",
  };

  const paymentFullLabels: Record<"cod" | "bkash" | "card", string> = {
    cod: "Cash on Delivery",
    bkash: "bKash / Mobile Banking",
    card: "Credit / Debit Card",
  };
  

  // Fetch districts
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
    setAddressErrors({
      name: "",
      phone: "",
      district: "",
      zone: "",
      address: "",
    });
  }, [selectedAddressId, savedAddresses]);

  // Load checkout items
  useEffect(() => {
    const localCart = getCart();
    if (!localCart || localCart.length === 0) {
      router.push("/cart");
      return;
    }

    const localSubtotal = localCart.reduce(
      (sum, item) => sum + Number(item.discount_price || 0) * item.quantity,
      0
    );

    setCheckoutTotals({
      subtotal: localSubtotal,
      shipping: 0,
      total: localSubtotal,
      coupon_discount: 0,
      flash_discount: 0,
    });

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
        if (!resData.status || !resData.data)
          throw new Error("No variants found");

        const variants: Variant[] = resData.data;
        const updatedItems: CheckoutVariant[] = placeholders.map(
          (ci, index) => {
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
            return {
              ...ci,
              isDisabled: true,
              isLoadingPrice: false,
              key: `${ci.id}-${index}`,
            };
          }
        );

        setCheckoutItemsState(updatedItems);

        const initialSubtotal = updatedItems.reduce(
          (sum, item) => sum + Number(item.discount_price) * item.quantity,
          0
        );

        setCheckoutTotals({
          subtotal: initialSubtotal,
          shipping: 0,
          total: initialSubtotal,
          coupon_discount: 0,
          flash_discount: 0,
        });

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

  // Recalculate totals
  const recalculateCheckout = async (
    items = checkoutItems,
    coupon = couponCode,
    districtName = addressForm.district
  ) => {
    setCouponMessage("");
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
      setShippingLoading(true);
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
        if (d.coupon_discount_amount > 0 && coupon)
          setCouponMessage(`✔ Coupon Applied (${coupon})`);
        if (coupon && d.coupon_discount_amount <= 0)
          setCouponMessage(`❌ Coupon Failed (${coupon})`);
      }
    } catch (err) {
      toast.error("Failed to update totals");
    } finally {
      setShippingLoading(false);
      setCouponLoading(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode)
      return setCouponMessage("Please enter a coupon code first.");
    if (addressForm.district === "")
      return toast.error("Add your address before applying a coupon.", {
        duration: 4000,
        style: { whiteSpace: "nowrap", maxWidth: "none", fontSize: "14px" },
      });

    setCouponLoading(true);
    const promise = recalculateCheckout(
      checkoutItems,
      couponCode,
      addressForm.district
    );
    toast.promise(promise, {
      loading: "Applying Coupon...",
      success: "Coupon Status updated successfully!",
      error: "Failed to apply coupon. Please try again.",
    });
  };

  useEffect(() => {
    if (addressForm.district && checkoutItems.length > 0)
      recalculateCheckout(checkoutItems, couponCode, addressForm.district);
  }, [addressForm.district]);

  // Place order with validation
  const placeOrder = async () => {
    const errors: typeof addressErrors = {
      name: "",
      phone: "",
      district: "",
      zone: "",
      address: "",
    };
    let hasError = false;

    if (!addressForm.name) {
      errors.name = "Name is required";
      hasError = true;
    }
    if (!addressForm.phone) {
      errors.phone = "Phone is required";
      hasError = true;
    }
    if (!addressForm.district) {
      errors.district = "District is required";
      hasError = true;
    }
    if (!addressForm.zone) {
      errors.zone = "Zone is required";
      hasError = true;
    }
    if (!addressForm.address) {
      errors.address = "Address is required";
      hasError = true;
    }

    setAddressErrors(errors);

    if (hasError) {
      toast.error("Please fill all required fields");
      return;
    }

    // Build product_list
    const product_list = checkoutItems
      .filter((item) => !item.isDisabled)
      .map((item) => ({
        product_id: String(item.product_id),
        variant_id: String(item.id),
        quantity: String(item.quantity),
        flash_sale: "", // You can replace with actual flash sale if any
      }));

    // Find district ID
    const district = districts.find(
      (d) => d.name.toLowerCase() === addressForm.district.toLowerCase()
    );
    if (!district) {
      toast.error("Invalid district selected");
      return;
    }
    if (product_list.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Build payload
    const payload = {
      product_list,
      coupon_code: couponCode || "",
      payment_status: paymentMethod === "cod" ? "pending" : "paid", // adjust if needed
      notes: "",
      shipping_address: {
        name: addressForm.name,
        phone_number: addressForm.phone,
        district_id: String(district.id),
        zone: addressForm.zone,
        address: addressForm.address,
      },
    };
    setOrderLoading(true);
    try {
      await toast.promise(
        (async () => {
          const res = await fetch("/api/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          const data = await res.json();
          if (!res.ok || !data.status) {
            throw new Error(data.message || "Failed to place order");
          }
          removeFromCart
          // Clear cart and redirect
          setCheckoutItemsState([]);
          setCheckoutItems([]);
          router.push("/order-success");

          return data;
        })(),
        {
          loading: "Placing your order...",
          success: "Order placed successfully!",
          error: (err) => err.message || "Failed to place order",
        }
      );
    } catch (err) {
      console.error(err);
      setOrderLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
          {/* Left */}
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

              {/* Name */}
              <input
                type="text"
                placeholder="Name"
                value={addressForm.name}
                onChange={(e) => {
                  setAddressForm({ ...addressForm, name: e.target.value });
                  setAddressErrors({ ...addressErrors, name: "" });
                }}
                className={`border p-3 rounded w-full ${
                  addressErrors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {addressErrors.name && (
                <p className="text-red-500 text-sm mt-0">
                  {addressErrors.name}
                </p>
              )}

              {/* Phone */}
              <input
                type="text"
                placeholder="Phone Number"
                value={addressForm.phone}
                onChange={(e) => {
                  setAddressForm({ ...addressForm, phone: e.target.value });
                  setAddressErrors({ ...addressErrors, phone: "" });
                }}
                className={`border p-3 rounded w-full ${
                  addressErrors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {addressErrors.phone && (
                <p className="text-red-500 text-sm mt-0">
                  {addressErrors.phone}
                </p>
              )}

              {/* Address */}
              <textarea
                placeholder="Address"
                value={addressForm.address}
                onChange={(e) => {
                  setAddressForm({ ...addressForm, address: e.target.value });
                  setAddressErrors({ ...addressErrors, address: "" });
                }}
                className={`border p-3 rounded w-full ${
                  addressErrors.address ? "border-red-500" : "border-gray-300"
                }`}
                rows={3}
              />
              {addressErrors.address && (
                <p className="text-red-500 text-sm mt-0">
                  {addressErrors.address}
                </p>
              )}

              {/* Zone */}
              <input
                type="text"
                placeholder="Zone"
                value={addressForm.zone}
                onChange={(e) => {
                  setAddressForm({ ...addressForm, zone: e.target.value });
                  setAddressErrors({ ...addressErrors, zone: "" });
                }}
                className={`border p-3 rounded w-full ${
                  addressErrors.zone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {addressErrors.zone && (
                <p className="text-red-500 text-sm mt-0">
                  {addressErrors.zone}
                </p>
              )}

              {/* District */}
              <select
                value={addressForm.district}
                onChange={(e) => {
                  setAddressForm({ ...addressForm, district: e.target.value });
                  setAddressErrors({ ...addressErrors, district: "" });
                }}
                className={`border p-3 rounded w-full ${
                  addressErrors.district ? "border-red-500" : "border-gray-300"
                }`}
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
              {addressErrors.district && (
                <p className="text-red-500 text-sm mt-0">
                  {addressErrors.district}
                </p>
              )}
            </div>

            {/* Coupon */}
            <div className="mt-4">
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="border p-3 rounded flex-1 pr-8"
                />
                {couponCode && (
                  <span
                    className="absolute right-12 top-3 cursor-pointer text-gray-400 hover:text-gray-700"
                    onClick={() => setCouponCode("")}
                  >
                    ✕
                  </span>
                )}
                <button
                  onClick={applyCoupon}
                  className="bg-amber-500 text-white px-4 py-3 rounded hover:bg-amber-600 transition text-sm cursor-pointer"
                  disabled={couponLoading || shippingLoading}
                >
                  {couponLoading ? "Applying..." : "Apply"}
                </button>
              </div>
              {couponMessage && (
                <p className="text-green-600 text-sm mt-1">{couponMessage}</p>
              )}
            </div>

            {/* Payment */}
            <span className="font-medium text-sm mb-2 inline-block">
              Payment Method
            </span>
            <div className="flex flex-col gap-3">
              {["cod", "bkash", "card"].map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <label
                    key={method}
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer border transition ${
                      isSelected
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={isSelected}
                      onChange={() =>
                        setPaymentMethod(method as "cod" | "bkash" | "card")
                      }
                      className="hidden"
                    />
                    <span
                      className={`w-5 h-5 flex-shrink-0 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? "border-amber-500 bg-amber-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                      )}
                    </span>
                    <span className="text-sm font-medium">
                      {paymentFullLabels[method as "cod" | "bkash" | "card"]}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Right Summary */}
          <div className="md:w-1/3 bg-white p-6 rounded-lg shadow flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                {checkoutItems.map((item) => (
                  <div
                    key={item.key}
                    className="flex justify-between items-center"
                  >
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
                  <span>
                    {shippingLoading ? (
                      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      `৳ ${checkoutTotals.subtotal.toLocaleString()}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Charge</span>
                  <span>
                    {shippingLoading ? (
                      <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      `৳ ${checkoutTotals.shipping.toLocaleString()}`
                    )}
                  </span>
                </div>
                {checkoutTotals.coupon_discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>
                      -৳ {checkoutTotals.coupon_discount.toLocaleString()}
                    </span>
                  </div>
                )}
                {checkoutTotals.flash_discount > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Flash Discount</span>
                    <span>
                      -৳ {checkoutTotals.flash_discount.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>
                    {shippingLoading ? (
                      <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      `৳ ${checkoutTotals.total.toLocaleString()}`
                    )}
                  </span>
                </div>
              </div>

              <div className="hidden md:block mt-6">
                <button
                  onClick={placeOrder}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition text-lg cursor-pointer"
                  disabled={couponLoading || shippingLoading || orderLoading}
                >
                  Place Order ({paymentShortLabels[paymentMethod]}){" "}
                  {shippingLoading
                    ? ""
                    : `৳ ${checkoutTotals.total.toLocaleString()}`}
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
              {shippingLoading ? (
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                `৳ ${checkoutTotals.total.toLocaleString()}`
              )}
            </span>
          </div>
          <button
            onClick={placeOrder}
            className="bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition"
            disabled={couponLoading || shippingLoading || orderLoading}
          >
            Place Order ({paymentShortLabels[paymentMethod]})
          </button>
        </div>
      </div>
    </>
  );
}
