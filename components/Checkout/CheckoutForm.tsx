"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCheckout } from "@/hooks/useCheckout";
import AddressForm from "./AddressForm";
import CouponSection from "./CouponSection";
import PaymentMethod from "./PaymentMethod";
import OrderSummary from "./OrderSummary";
import { removeFromCheckout } from "@/lib/checkout";

interface Address {
  id: number;
  name: string;
  phone: string;
  district: string;
  zone: string;
  address: string;
}

export default function CheckoutPage() {
  const {
    router,
    checkoutItems,
    checkoutTotals,
    setCheckoutTotals,
    districts,
    districtLoading,
    variantLoading ,
  } = useCheckout();

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "card">(
    "cod"
  );
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | "new">(
    "new"
  );
  const [addressLoading, setAddressLoading] = useState(false);
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
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [shippingLoading, setShippingLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);

  const paymentShortLabels = { cod: "COD", bkash: "bKash", card: "Card" };

  // 🟩 Fetch saved addresses
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
      } catch {
        toast.error("Failed to load addresses");
      } finally {
        setAddressLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  // 🟩 Auto-fill address when selected
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
      const found = savedAddresses.find((a) => a.id === selectedAddressId);
      if (found) {
        setAddressForm({
          name: found.name,
          phone: found.phone,
          district: found.district,
          zone: found.zone,
          address: found.address,
        });
      }
    }
  }, [selectedAddressId, savedAddresses]);

  // 🟩 Recalculate checkout totals
  const recalculateCheckout = async (
    coupon = couponCode,
    districtName = addressForm.district
  ) => {
    setCouponMessage("");
    if (!districtName) return;

    const district = districts.find(
      (d) => d.name.toLowerCase() === districtName.toLowerCase()
    );
    if (!district) return;

    // 🟩 Each item sends its own flash_sale slug
    const product_list = checkoutItems.map((i) => ({
      product_id: String(i.product_id),
      variant_id: String(i.id),
      quantity: String(i.quantity),
      flash_sale: i.flash_sale ?? null, // ✅ individual flash sale
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
    } catch {
      toast.error("Failed to update totals");
    } finally {
      setShippingLoading(false);
      setCouponLoading(false);
    }
  };

  // 🟩 Auto recalc when district changes
  useEffect(() => {
    if (addressForm.district && checkoutItems.length > 0) {
      setShippingLoading(true);
      const timeout = setTimeout(() => {
        recalculateCheckout("", addressForm.district);
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [addressForm.district, checkoutItems]);

  // 🟩 Apply coupon manually
  const applyCoupon = async () => {
    if (!couponCode) return setCouponMessage("Enter a coupon code first.");
    if (!addressForm.district)
      return toast.error("Select your district first.");
    setCouponLoading(true);
    const promise = recalculateCheckout(couponCode, addressForm.district);
    toast.promise(promise, {
      loading: "Applying Coupon...",
      success: "Coupon checked successfully!",
      error: "Failed to apply coupon!",
    });
  };

  // 🟩 Place order
  const placeOrder = async () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.district)
      return toast.error("Please fill all required fields");

    const district = districts.find(
      (d) => d.name.toLowerCase() === addressForm.district.toLowerCase()
    );
    if (!district) return toast.error("Invalid district selected");

    // 🟩 Each product carries its own flash_sale
    const product_list = checkoutItems.map((i) => ({
      product_id: String(i.product_id),
      variant_id: String(i.id),
      quantity: String(i.quantity),
      flash_sale: i.flash_sale ?? null,
    }));

    const payload = {
      product_list,
      coupon_code: couponCode || "",
      payment_status: paymentMethod === "cod" ? "pending" : "paid",
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
          if (!res.ok || !data.status)
            throw new Error(data.message || "Failed");
          checkoutItems.forEach((i) => removeFromCheckout(i.id));
          router.push("/my-orders");
        })(),
        {
          loading: "Placing order...",
          success: "Order placed successfully!",
          error: "Failed to place order!",
        }
      );
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* LEFT SECTION */}
        <div className="md:w-2/3 bg-white p-6 rounded-lg shadow space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Shipping Information</h2>
            <Link
              href="/address-book"
              className="text-sm px-2 py-1 bg-amber-500 text-white rounded hover:bg-amber-600 transition"
            >
              Address Book
            </Link>
          </div>

          {/* Address selector */}
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

          {/* Forms & Sections */}
          <AddressForm
            addressForm={addressForm}
            setAddressForm={setAddressForm}
            addressErrors={addressErrors}
            setAddressErrors={setAddressErrors}
            districts={districts}
            districtLoading={districtLoading}
          />

          <CouponSection
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            applyCoupon={applyCoupon}
            couponLoading={couponLoading}
            couponMessage={couponMessage}
          />

          <PaymentMethod
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>

        {/* RIGHT SECTION */}
        <div className="md:w-1/3">
          <OrderSummary
            checkoutItems={checkoutItems}
            checkoutTotals={checkoutTotals}
            shippingLoading={shippingLoading}
            placeOrder={placeOrder}
            paymentLabel={paymentShortLabels[paymentMethod]}
            orderLoading={orderLoading}
            variantLoading ={variantLoading}
          />
        </div>
      </div>
    </div>
  );
}
