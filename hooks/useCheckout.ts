"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCart, CheckoutItem } from "@/lib/checkout";
import { removeFromCart } from "@/lib/cart";
import toast from "react-hot-toast";

export interface Variant {
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

export interface CheckoutVariant extends Variant {
  quantity: number;
  name?: string;
  fallbackImage?: string;
  key: string;
  flash_sale?: string | null;
  isDisabled?: boolean;
  isLoadingPrice?: boolean;
}

export interface District {
  id: number;
  name: string;
}

export interface Address {
  id: number;
  name: string;
  phone: string;
  district: string;
  zone: string;
  address: string;
}

export const useCheckout = () => {
  const router = useRouter();

  const [checkoutItems, setCheckoutItems] = useState<CheckoutVariant[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [checkoutTotals, setCheckoutTotals] = useState({
    subtotal: 0,
    shipping: 0,
    total: 0,
    coupon_discount: 0,
    flash_discount: 0,
  });

  // 🟩 Fetch all districts
  useEffect(() => {
    const fetchDistricts = async () => {
      setDistrictLoading(true);
      try {
        const res = await fetch("/api/district-list");
        const data = await res.json();
        if (res.ok && data) {
          setDistricts(Array.isArray(data) ? data : data.data || []);
        }
      } catch (err) {
        console.error("District fetch error:", err);
      } finally {
        setDistrictLoading(false);
      }
    };
    fetchDistricts();
  }, []);



  // 🟩 Load cart + variant details
  useEffect(() => {
    const loadCartAndVariants = async () => {
      const localCart = getCart();

      if (!localCart || localCart.length === 0) {
        router.push("/cart");
        return;
      }

      // Create placeholders
      const placeholders: CheckoutVariant[] = localCart.map((item, i) => ({
        id: item.variant_id,
        product_id: item.productId,
        discount_price: "0",
        sell_price: "0",
        stock: 0,
        weight: "0",
        status: "inactive",
        quantity: item.quantity,
        fallbackImage: "",
        name: item.name,
        attributes: [],
        images: [],
        isDisabled: false,
        isLoadingPrice: true,
        key: `${item.variant_id}-${i}`,
        flash_sale: item.flash_sale, // ✅ Pass flash_sale from cart
      }));

      setCheckoutItems(placeholders);

      // ✅ No need for storedFlash, use item-level flash_sale
      const variantPayload = localCart.map((item) => ({
        product_id: String(item.productId),
        variants_id: String(item.variant_id),
        flash_sale: item.flash_sale ?? null, // ✅ Use individual flash_sale
      }));

      try {
        const res = await fetch("/api/variants", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(variantPayload),
        });

        const resData = await res.json();

        if (!resData.status || !resData.data)
          throw new Error("No variants found");

        const variants: Variant[] = resData.data;
        const updated = placeholders.map((ci) => {
          const v = variants.find((v) => v.id === ci.id);
          return v
            ? {
                ...ci,
                ...v,
                discount_price: v.discount_price || v.sell_price,
                fallbackImage: v.images?.[0] || "",
                isDisabled: v.stock <= 0,
                isLoadingPrice: false,
              }
            : { ...ci, isDisabled: true, isLoadingPrice: false };
        });

        setCheckoutItems(updated);

        const subtotal = updated.reduce(
          (sum, item) => sum + Number(item.discount_price) * item.quantity,
          0
        );

        setCheckoutTotals({
          subtotal,
          shipping: 0,
          total: subtotal,
          coupon_discount: 0,
          flash_discount: 0,
        });
      } catch (err) {
        console.error("Variant fetch error:", err);
        toast.error("Failed to load product variants");
      }
    };

    if (router) loadCartAndVariants();
  }, [router]);

  return {
    router,
    checkoutItems,
    setCheckoutItems,
    checkoutTotals,
    setCheckoutTotals,
    districts,
    districtLoading,
  };
};
